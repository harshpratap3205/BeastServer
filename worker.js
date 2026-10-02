const uWS = require("uWebSockets.js");

const PORT = Number(process.argv[2] || 3003);
const WORKER_ID = process.argv[3] || "1";

let requestCount = 0;

const usersResponse = '{"hello":"world"}';

uWS.App()
  .get("/api/users", (res) => {
    requestCount++;
    res.end(usersResponse);
  })

  .get("/debug/worker", (res) => {
    res.end(JSON.stringify({
      worker: WORKER_ID,
      pid: process.pid,
      port: PORT,
      requests: requestCount
    }));
  })

.listen("0.0.0.0", PORT, (token) => {
    if (token) {
      console.log(
        `Worker ${WORKER_ID} | Port ${PORT} | PID ${process.pid}`
      );

      // Print request count every second
      setInterval(() => {
        console.log(
          `Worker ${WORKER_ID} | Requests: ${requestCount}`
        );
      }, 1000);
    }
  });