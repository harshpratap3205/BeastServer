const Fastify = require("fastify");

const fastify = Fastify({
  logger: false
});

// Home
fastify.get("/", async () => {
  return {
    success: true,
    message: "Fastify API is running"
  };
});

// Users API
fastify.get("/api/users", (request, reply) => {
  return {
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
  };
});
// Health check
fastify.get("/api/health", async () => {
  return {
    success: true,
    status: "healthy"
  };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({
      port: 3001,
      host: "127.0.0.1"
    });

    console.log("Fastify server running on http://localhost:3001");
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();