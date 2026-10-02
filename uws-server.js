const cluster = require("cluster");
const os = require("os");
const uWS = require("uWebSockets.js");

const PORT = 3002;
const WORKERS = 4;

if (cluster.isPrimary) {
  console.log("=================================");
  console.log(" uWebSockets.js Multi-Worker API");
  console.log("=================================");
  console.log(`CPU cores       : ${os.cpus().length}`);
  console.log(`API workers     : ${WORKERS}`);
  console.log(`Primary PID     : ${process.pid}`);
  console.log(`Port            : ${PORT}`);
  console.log("=================================");

  for (let i = 0; i < WORKERS; i++) {
    const worker = cluster.fork();

    console.log(
      `Worker ${worker.id} started | PID: ${worker.process.pid}`
    );
  }

  cluster.on("exit", (worker) => {
    console.log(
      `Worker ${worker.id} | PID ${worker.process.pid} stopped. Restarting...`
    );

    const newWorker = cluster.fork();

    console.log(
      `New worker ${newWorker.id} started | PID: ${newWorker.process.pid}`
    );
  });

} else {

  const usersResponse = '{"hello":"world"}';
  const benchmarkResponse = '{"success":true,"message":"OK"}';
  const healthResponse = '{"success":true,"status":"healthy"}';
  const rootResponse = '{"success":true,"message":"uWebSockets.js API"}';

  const workerInfo = JSON.stringify({
    workerId: cluster.worker.id,
    pid: process.pid
  });

  uWS
    .App()

    .get("/api/users", (res) => {
      res.end(usersResponse);
    })

    .get("/api/benchmark", (res) => {
      res.end(benchmarkResponse);
    })

    .get("/api/health", (res) => {
      res.end(healthResponse);
    })

    .get("/debug/worker", (res) => {
      res.end(workerInfo);
    })

    .get("/", (res) => {
      res.end(rootResponse);
    })

    .listen("127.0.0.1", PORT, (token) => {
      if (token) {
        console.log(
          `Worker ${cluster.worker.id} | PID ${process.pid} listening on ${PORT}`
        );
      } else {
        console.log(
          `Worker ${cluster.worker.id} | PID ${process.pid} failed to start`
        );
      }
    });
}