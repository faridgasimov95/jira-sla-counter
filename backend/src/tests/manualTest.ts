import {
  buildIntervals,
  getSecondLineIntervals,
  normalize,
} from "../services/slaService";
import { parseJiraTicket } from "../services/jiraService";
import { getTotalWorkingTime } from "../utils/workingTime";
import env from "../config/env";

async function test() {
  // const tickets = [
  //   "SD-100340",
  //   "SD-100338",
  //   "SD-100305",
  //   "SD-100302",
  //   "SD-100290",
  //   "SD-100283",
  //   "SD-100243",
  //   "SD-100241",
  //   "SD-100239",
  //   "SD-100185",
  //   "SD-100171",
  //   "SD-100165",
  //   "SD-100150",
  //   "SD-100125",
  //   "SD-100100",
  //   "SD-100075",
  //   "SD-100045",
  //   "SD-100044",
  //   "SD-100009",
  //   "SD-99993",
  //   "SD-99988",
  //   "SD-99985",
  //   "SD-99969",
  //   "SD-99950",
  //   "SD-99934",
  //   "SD-99877",
  //   "SD-99874",
  //   "SD-99862",
  //   "SD-99859",
  //   "SD-99839",
  //   "SD-99832",
  //   "SD-99811",
  //   "SD-99807",
  //   "SD-99767",
  //   "SD-99746",
  //   "SD-99681",
  //   "SD-99668",
  //   "SD-99666",
  //   "SD-99657",
  //   "SD-99656",
  //   "SD-99650",
  //   "SD-99649",
  //   "SD-99648",
  //   "SD-99631",
  //   "SD-99611",
  //   "SD-99606",
  //   "SD-99573",
  //   "SD-99551",
  //   "SD-99550",
  //   "SD-99520",
  //   "SD-99515",
  //   "SD-99464",
  //   "SD-99457",
  //   "SD-99440",
  //   "SD-99428",
  //   "SD-99426",
  //   "SD-99424",
  //   "SD-99420",
  //   "SD-99395",
  //   "SD-99387",
  //   "SD-99382",
  //   "SD-99372",
  //   "SD-99370",
  //   "SD-99363",
  //   "SD-99359",
  //   "SD-99354",
  //   "SD-99345",
  //   "SD-99333",
  //   "SD-99332",
  //   "SD-99329",
  //   "SD-99328",
  //   "SD-99315",
  //   "SD-99314",
  //   "SD-99294",
  //   "SD-99273",
  //   "SD-99272",
  //   "SD-99239",
  //   "SD-99224",
  //   "SD-99220",
  //   "SD-99208",
  //   "SD-99205",
  //   "SD-99199",
  //   "SD-99190",
  //   "SD-99184",
  //   "SD-99183",
  //   "SD-99177",
  //   "SD-99173",
  //   "SD-99168",
  //   "SD-99147",
  //   "SD-99136",
  //   "SD-99125",
  //   "SD-99105",
  //   "SD-99067",
  //   "SD-99063",
  //   "SD-99059",
  //   "SD-99057",
  //   "SD-99052",
  //   "SD-99035",
  //   "SD-99018",
  //   "SD-98978",
  //   "SD-98967",
  //   "SD-98962",
  //   "SD-98929",
  //   "SD-98921",
  //   "SD-98910",
  //   "SD-98907",
  //   "SD-98888",
  //   "SD-98885",
  //   "SD-98875",
  //   "SD-98874",
  //   "SD-98860",
  //   "SD-98853",
  //   "SD-98803",
  //   "SD-98802",
  //   "SD-98704",
  //   "SD-98703",
  // ];

  const tickets = ["SD-102266"];

  if (!env.jiraEmail || !env.jiraToken) {
    throw new Error("Missing Jira credentials in .env");
  }

  const auth = {
    username: env.jiraEmail,
    password: env.jiraToken,
  };

  for (const ticket of tickets) {
    const urlStatus = `${env.baseURL}/rest/servicedeskapi/request/${ticket}/status`;

    try {
      const ticketStatus = await parseJiraTicket(urlStatus, auth);
      const timestamps = ticketStatus.values.reverse();
      const timestampsNormalized = normalize(timestamps);
      const timeIntervals = buildIntervals(timestampsNormalized);
      const secondLineIntervals = getSecondLineIntervals(timeIntervals);
      const totalWorkingTime = getTotalWorkingTime(secondLineIntervals);
      console.log(Math.ceil(totalWorkingTime));
    } catch (err: any) {
      console.error("STATUS:", err.response?.status);
      console.error("DATA:", err.response?.data.errorMessage);
      console.log(err);
    }
  }
}

test();
