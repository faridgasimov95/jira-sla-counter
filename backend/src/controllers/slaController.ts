import { Response, Request } from "express";
import { parseJiraTicket } from "../services/jiraService";
import { extractTicketData, appendSlaResults } from "../services/excelService";
import {
  normalize,
  buildIntervals,
  getSecondLineIntervals,
} from "../services/slaService";
import { getTotalWorkingTime } from "../utils/workingTime";
import { getSpecialDays } from "../services/holidayService";
import prisma from "../prisma";

/**
 * Controls SLA calculation flow
 * 1. Reads the uploaded Excel file and extracts all Jira ticket numbers
 * 2. Fetches stauts history for each ticket
 * 3. Calculates the SLA time for each ticket
 * 4. Returns the updated Excel file
 */
export const processFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const settings = await prisma.settings.findUnique({
      where: { userId: req.user.userId },
    });

    if (
      !settings?.jiraUsername ||
      !settings?.jiraToken ||
      !settings?.jiraSubdomain
    ) {
      res.status(400).json({ error: "Jira settings are not configured" });
      return;
    }

    const auth = {
      username: settings.jiraUsername,
      password: settings.jiraToken,
    };

    const baseURL = `https://${settings.jiraSubdomain}.atlassian.net`;

    await parseJiraTicket(`${baseURL}/rest/api/2/myself`, auth);

    const buffer = req.file.buffer;
    const ticketKeys = await extractTicketData(buffer);

    if (ticketKeys.length === 0) {
      res.status(400).json({ error: "No tickets found in the Excel file" });
      return;
    }

    const allIntervals: { key: string; secondLineIntervals: any[] }[] = [];
    const results = new Map<string, number | string>();

    for (const key of ticketKeys) {
      try {
        const url = `${baseURL}/rest/servicedeskapi/request/${key}/status`;
        const ticketStatus = await parseJiraTicket(url, auth);
        const timestamps = ticketStatus.values.reverse();
        const timestampsNormalized = normalize(timestamps);
        const timeIntervals = buildIntervals(timestampsNormalized);
        const secondLineIntervals = getSecondLineIntervals(timeIntervals);
        allIntervals.push({ key, secondLineIntervals });
      } catch (err: any) {
        // Hanlde Axios's error object
        const status = err.response?.status;
        if (status === 401) {
          res.status(401).json({ error: "Invalid Jira credentials" }); // unauthorized
          return;
        }

        if (status === 403)
          results.set(key, "NO ACCESS"); // no access to the ticket
        else if (status === 404)
          results.set(key, "NOT FOUND"); // ticket not found
        else if (status === 429) results.set(key, "RATE LIMITED"); //
        else results.set(key, "ERROR"); // default error
      }
    }

    const years = [
      ...new Set(
        allIntervals
          .flatMap((t) => t.secondLineIntervals)
          .flatMap((i) => [
            new Date(i.start).getFullYear(),
            new Date(i.end).getFullYear(),
          ])
      ),
    ];

    const specialDays = await getSpecialDays(
      settings.country ?? "AZ",
      years.length > 0 ? years : [new Date().getFullYear()]
    );

    for (const { key, secondLineIntervals } of allIntervals) {
      if (results.has(key)) continue;
      const totalWorkingTime = getTotalWorkingTime(
        secondLineIntervals,
        specialDays
      );
      results.set(key, Math.ceil(totalWorkingTime));
    }

    if (Array.from(results.values()).every((v) => typeof v === "string")) {
      res.status(400).json({ error: "None of the tickets could be processed" });
      return;
    }

    const hasProblematic = Array.from(results.values()).some(
      (v) =>
        v === "NO ACCESS" ||
        v === "NOT FOUND" ||
        v === "RATE LIMITED" ||
        v === "ERROR"
    );

    const updatedBuffer = await appendSlaResults(buffer, results);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sla-results.xlsx"
    );
    if (hasProblematic) res.setHeader("X-Has-Warnings", "true");

    res.send(updatedBuffer);
  } catch (err: any) {
    if (err.name === "ClientError") {
      res.status(400).json({ error: err.message });
    } else if (err.config?.url?.includes("date.nager.at")) {
      res
        .status(503)
        .json({ error: "Failed to fetch public holidays. Please try again." });
    } else if (!err.response) {
      res.status(503).json({ error: "Jira server is unreachable" });
    } else {
      res.status(500).json({ error: err.message || "Something went wrong" });
    }
  }
};
