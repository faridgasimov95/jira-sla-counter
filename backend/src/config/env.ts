/**
 * Loads and exposes environmental variables from .env file
 */
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const env = {
  jiraEmail: process.env.JIRA_EMAIL,
  jiraToken: process.env.JIRA_TOKEN,
  baseURL: process.env.JIRA_BASE_URL,
  allowInsecureTls: process.env.ALLOW_INSECURE_TLS, // DEV ONLY
};

export default env;
