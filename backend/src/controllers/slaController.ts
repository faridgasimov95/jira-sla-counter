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
import { SlaResultMap } from "../types/sla";

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

    if (ticketKeys.size === 0) {
      res.status(400).json({ error: "No tickets found in the Excel file" });
      return;
    }

    const allIntervals: {
      key: string;
      intervals: any[];
      prio: string;
      typeId: number;
    }[] = [];
    const results: SlaResultMap = new Map();

    for (const [key, prio] of ticketKeys) {
      try {
        const statusUrl = `${baseURL}/rest/servicedeskapi/request/${key}/status`;
        const infoUrl = `${baseURL}/rest/servicedeskapi/request/${key}`;
        const [ticketStatus, ticketInfo] = await Promise.all([
          parseJiraTicket(statusUrl, auth),
          parseJiraTicket(infoUrl, auth),
        ]);

        const timestamps = ticketStatus.values.reverse();
        const timestampsNormalized = normalize(timestamps);
        const timeIntervals = buildIntervals(timestampsNormalized);
        const secondLineIntervals = getSecondLineIntervals(timeIntervals);
        allIntervals.push({
          key,
          intervals: secondLineIntervals,
          prio,
          typeId: ticketInfo.requestTypeId,
        });
      } catch (err: any) {
        // Hanlde Axios's error object
        const status = err.response?.status;
        if (status === 401) {
          res.status(401).json({ error: "Invalid Jira credentials" }); // unauthorized
          return;
        }

        if (status === 403)
          results.set(key, {
            sla: "NO ACCESS",
            status: "NO ACCESS",
            note: "NO ACCESS",
          });
        else if (status === 404)
          results.set(key, {
            sla: "NOT FOUND",
            status: "NOT FOUND",
            note: "NOT FOUND",
          });
        else if (status === 429)
          results.set(key, {
            sla: "RATE LIMITED",
            status: "RATE LIMITED",
            note: "RATE LIMITED",
          });
        else results.set(key, { sla: "ERROR", status: "ERROR", note: "ERROR" }); // default error
      }
    }
    // Get the years in which ticket was active
    const years = [
      ...new Set(
        allIntervals
          .flatMap((t) => t.intervals)
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

    const priorityThresholds =
      (settings.priorityThresholds as { name: string; minutes: number }[]) ??
      [];

    for (const { key, intervals, prio, typeId } of allIntervals) {
      if (results.has(key)) continue;
      const totalWorkingTime = getTotalWorkingTime(intervals, specialDays);
      const sla = Math.ceil(totalWorkingTime);
      const threshold = priorityThresholds.find((p) => p.name === prio);
      const status = threshold
        ? sla > threshold?.minutes
          ? "Overdue"
          : "Ok"
        : null;
      const note = settings.ignoredStatusCodes.includes(Number(typeId))
        ? "Development"
        : "";
      results.set(key, { sla, status, note });
    }

    if (Array.from(results.values()).every((v) => typeof v.sla === "string")) {
      res.status(400).json({ error: "None of the tickets could be processed" });
      return;
    }

    const hasProblematic = Array.from(results.values()).some(
      (v) =>
        v.sla === "NO ACCESS" ||
        v.sla === "NOT FOUND" ||
        v.sla === "RATE LIMITED" ||
        v.sla === "ERROR"
    );

    const updatedBuffer = await appendSlaResults(buffer, results);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${req.file.originalname.replace(
        ".xlsx",
        ""
      )}-processed.xlsx`
    );
    if (hasProblematic) res.setHeader("X-Has-Warnings", "true");

    const { _sum } = await prisma.savedFile.aggregate({
      where: { userId: req.user.userId },
      _sum: { size: true },
    });

    const totalSize = _sum.size ?? 0;

    if (totalSize + updatedBuffer.length > 1 * 1024 * 1024) {
      res.setHeader("X-Storage-Limit", "true");
    } else {
      await prisma.savedFile
        .create({
          data: {
            userId: req.user.userId,
            filename: `${req.file.originalname.replace(
              ".xlsx",
              ""
            )}-processed.xlsx`,
            filedata: updatedBuffer,
            size: updatedBuffer.length,
          },
        })
        .catch((err) => console.error("Failed to save file:", err));
    }

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
