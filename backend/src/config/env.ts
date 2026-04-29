import dotenv from "dotenv";
import path from "path";

/**
 * Loads and exposes environmental variables from .env file
 */
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set in .env");

const env = {
  jiraEmail: process.env.JIRA_EMAIL,
  jiraToken: process.env.JIRA_TOKEN,
  baseURL: process.env.JIRA_BASE_URL,
  allowInsecureTls: process.env.ALLOW_INSECURE_TLS, // DEV ONLY
  jwtSecret: process.env.JWT_SECRET,
};

export default env;
