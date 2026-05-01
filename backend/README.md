> 🚧 Under active development — README will be updated upon deployment.

# Jira SLA Counter — Backend

REST API for processing Jira ticket SLA data. Receives requests from the frontend, fetches ticket status history from the Jira Service Desk API, and calculates total time spent in "Second line" status.

## Tech Stack

- Node.js + TypeScript
- Express
- Axios

### Prerequisites

- Node.js 16+
- Jira account with API token

### Environment Variables

Create `.env` file based on `.env.example`:

```properties
JIRA_EMAIL=your@email.com
JIRA_TOKEN=your_api_token
JIRA_BASE_URL=https://yourcompany.atlassian.net
ALLOW_INSECURE_TLS=false
```

### Run

```bash
npm install
npm run dev
```

Server runs on http://localhost:3000
