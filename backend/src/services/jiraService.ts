import axios from "axios";
import https from "https";
import env from "../config/env";

const httpsAgent = env.allowInsecureTls
  ? new https.Agent({
      rejectUnauthorized: false,
    })
  : undefined;

/** Fetches status history for a single Jira ticket from the API.
 * @param apiUrl - Jira API endpoint URL
 * @param auth - Auth credentials (email and API token)
 * @returns API response data
 */
export async function parseJiraTicket(
  apiUrl: string,
  auth: { username: string; password: string }
) {
  const res = await axios.get(apiUrl, {
    auth: auth,
    httpsAgent,
    headers: {
      Accept: "application/json",
    },
  });

  const data = res.data;

  return data;
}
