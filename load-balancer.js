
const http = require("http");

const workers = [
  { port: 3003, id: 1 },
  { port: 3004, id: 2 },
  { port: 3005, id: 3 },
  { port: 3006, id: 4 }
];

let current = 0;

// Persistent connection pools to workers
const agents = workers.map((worker) => ({
  ...worker,
  agent: new http.Agent({
    keepAlive: true,
    maxSockets: 10000,
    maxFreeSockets: 1000
  })
}));

const server = http.createServer((req, res) => {
  // Round-robin worker selection
  const worker = agents[current];

  current = (current + 1) % agents.length;

  const proxyReq = http.request(
    {
      hostname: "127.0.0.1",
      port: worker.port,
      path: req.url,
      method: req.method,
      headers: req.headers,

      // Reuse backend TCP connections
      agent: worker.agent
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on("error", (err) => {
    if (!res.headersSent) {
      res.statusCode = 502;
      res.end("Worker unavailable");
    } else {
      res.destroy();
    }
  });

  req.pipe(proxyReq);
});

server.on("error", (err) => {
  console.error("Load Balancer Error:", err);
});

server.listen(3002, "127.0.0.1", () => {
  console.log("=================================");
  console.log(" Optimized Load Balancer");
  console.log("=================================");
  console.log("Listening: http://localhost:3002");
  console.log("");
  console.log("Workers:");
  console.log("3003 → Worker 1");
  console.log("3004 → Worker 2");
  console.log("3005 → Worker 3");
  console.log("3006 → Worker 4");
  console.log("");
  console.log("Keep-Alive: ENABLED");
  console.log("Max backend sockets: 10000");
  console.log("=================================");
})