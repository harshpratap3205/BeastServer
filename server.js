const cluster = require("cluster");
const os = require("os");
const express = require("express");

const PORT = 3000;

// Get the number of CPU cores / logical processors
const CPU_COUNT = os.cpus().length;

if (cluster.isPrimary) {
  console.log("=================================");
  console.log("Node.js Cluster Server");
  console.log("=================================");
  console.log(`CPU cores available: ${CPU_COUNT}`);
  console.log(`Starting ${CPU_COUNT} worker processes...`);
  console.log("=================================");

  // Create one worker for each logical CPU
  for (let i = 0; i < CPU_COUNT; i++) {
    cluster.fork();
  }

  // If a worker crashes, automatically create a new one
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} stopped. Starting replacement...`
    );

    cluster.fork();
  });

} else {

  const app = express();

  app.use(express.json());

  // Dummy API
  app.get("/api/cpu-test", (req, res) => {
  const duration = Number(req.query.duration) || 5000;

  const start = Date.now();
  let result = 0;

  while (Date.now() - start < duration) {
    for (let i = 0; i < 100000; i++) {
      result += Math.sqrt(i) * Math.sin(i);
    }
  }

  res.json({
    success: true,
    message: "CPU test completed",
    duration: `${duration} ms`,
    result
  });
});
  app.get("/api/users", (req, res) => {
    res.json({
      success: true,
      worker: process.pid,
      message: "Request handled by worker",
  
    });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "OK",
      worker: process.pid,
      uptime: process.uptime(),
      cpuCount: CPU_COUNT,
      memory: process.memoryUsage()
    });
  });

  app.listen(PORT, () => {
    console.log(
      `Worker ${process.pid} running on http://localhost:${PORT}`
    );
  });
}