const express = require("express");

const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());
// CORS Middleware
// Home API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Express API is running",
    server: "Node.js + Express.js",
    timestamp: new Date().toISOString(),
    processId: process.pid
  });
});

// Dummy API
app.get("/api/users", (req, res) => {
  res.json({
    success: true,
    count: 5,
    users: [
      {
        id: 1,
        name: "Harsh",
        email: "harsh@example.com",
        role: "developer"
      }
    ]
  });
});

// Dummy product API
app.get("/api/products", (req, res) => {
  res.json({
    success: true,
    products: [
      {
        id: 101,
        name: "Laptop",
        price: 75000,
        currency: "INR"
      },
      {
        id: 102,
        name: "Keyboard",
        price: 2500,
        currency: "INR"
      },
      {
        id: 103,
        name: "Mouse",
        price: 1500,
        currency: "INR"
      }
    ]
  });
});

// Health check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    server: "Express",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage()
  });
});

// Start server
app.listen(PORT, () => {
  console.log("=================================");
  console.log("Express API Server Started");
  console.log("=================================");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Users:  http://localhost:${PORT}/api/users`);
  console.log(`Products: http://localhost:${PORT}/api/products`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Process ID: ${process.pid}`);
  console.log("=================================");
});