const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Set response headers
  res.setHeader("Content-Type", "application/json");

  // Handle different routes
  switch (req.url) {
    case "/":
      res.writeHead(200);
      res.end(
        JSON.stringify({
          message: "Welcome to the Node.js server!",
        })
      );
      break;

    case "/api/users":
      res.writeHead(200);
      res.end(
        JSON.stringify({
          users: [
            { id: 1, name: "John Doe" },
            { id: 2, name: "Jane Smith" },
          ],
        })
      );
      break;

    default:
      res.writeHead(404);
      res.end(
        JSON.stringify({
          error: "Not Found",
        })
      );
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
