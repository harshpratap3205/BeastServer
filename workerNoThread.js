const uWS = require("uWebSockets.js");

const PORT = 3003;

const response = '{"hello":"world"}';

uWS.App()
  .get("/api/users", (res) => {
    res.end(response);
  })
  .listen("127.0.0.1", PORT, (token) => {
    if (token) {
      console.log(`uWS running on http://127.0.0.1:${PORT}`);
    } else {
      console.log(`Failed to start server on port ${PORT}`);
    }
  });