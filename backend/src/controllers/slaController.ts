import { Response, Request } from "express";
import { parseJiraTicket } from "../services/jiraService";
import { extractTicketKeys, appendSlaResults } from "../services/excelService";
import { upload } from "../middlewares/uploadMiddleware";
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

    const buffer = req.file.buffer;
    const ticketKeys = await extractTicketKeys(buffer);

    if (!env.jiraEmail || !env.jiraToken || !env.baseURL) {
      res.status(500).json({ error: "Missing Jira credentials" });
      return;
    }

    const auth = {
      username: env.jiraEmail,
      password: env.jiraToken,
    };

    const results = new Map<string, number>();

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
        // If a ticket fails, store -1 so the row isn't left empty
        results.set(key, -1);
      }
    }

    const updatedBuffer = await appendSlaResults(buffer, results);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sla-results.xlsx"
    );
    res.send(updatedBuffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
