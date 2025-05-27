import { flushLogs } from "../utils/logQueue";

async function globalTeardown() {
    console.log("Make sure all logs were sent to Loki")
    await flushLogs();
}

export default globalTeardown;