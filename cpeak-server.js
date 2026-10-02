import cpeak from "cpeak";

const app = cpeak();

process.title = "node-cpeak";

// Ultra-light API endpoint
app.route("get", "/api/benchmark", (req, res) => {
  res.json({
    success: true,
    message: "OK"
  });
});

// Users API
app.route("get", "/api/users", (req, res) => {
  res.json({
    success: true,
    users: [
      {
        id: 1,
        name: "Harsh",
        email: "harsh@example.com"
      },
      {
        id: 2,
        name: "John",
        email: "john@example.com"
      },
      {
        id: 3,
        name: "Sarah",
        email: "sarah@example.com"
      }
    ]
  });
});

// Health
app.route("get", "/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy"
  });
});

// Error handler
app.handleErr((error, req, res) => {
  console.error(error);

  res.status(500).json({
    error: "Internal server error"
  });
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Cpeak server running at http://localhost:${PORT}`);
});