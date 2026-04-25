import { Response, Request } from "express";
import { parseJiraTicket } from "../services/jiraService";
import { extractTicketKeys, appendSlaResults } from "../services/excelService";
import {
  normalize,
  buildIntervals,
  getSecondLineIntervals,
} from "../services/slaService";
import { getTotalWorkingTime } from "../utils/workingTime";
import env from "../config/env";

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

    if (!env.jiraEmail || !env.jiraToken || !env.baseURL) {
      res.status(500).json({ error: "Missing Jira credentials" });
      return;
    }

    const auth = {
      username: env.jiraEmail,
      password: env.jiraToken,
    };

    await parseJiraTicket(`${env.baseURL}/rest/api/2/myself`, auth);

    const buffer = req.file.buffer;
    const ticketKeys = await extractTicketKeys(buffer);

    if (ticketKeys.length === 0) {
      res.status(400).json({ error: "No tickets found in the Excel file" });
      return;
    }

    const results = new Map<string, number | string>();

    for (const key of ticketKeys) {
      try {
        const url = `${env.baseURL}/rest/servicedeskapi/request/${key}/status`;
        const ticketStatus = await parseJiraTicket(url, auth);
        const timestamps = ticketStatus.values.reverse();
        const timestampsNormalized = normalize(timestamps);
        const timeIntervals = buildIntervals(timestampsNormalized);
        const secondLineIntervals = getSecondLineIntervals(timeIntervals);
        const totalWorkingTime = getTotalWorkingTime(secondLineIntervals);
        results.set(key, Math.ceil(totalWorkingTime));
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
    } else if (!err.response) {
      res.status(503).json({ error: "Jira server is unreachable" });
    } else {
      res.status(500).json({ error: err.message || "Something went wrong" });
    }
  }
};
