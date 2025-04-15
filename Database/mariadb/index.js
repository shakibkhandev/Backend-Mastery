const express = require("express");
const mariadb = require("mariadb");

const app = express();
const port = 5000;

// Middleware for parsing JSON and URL-encoded data
app.use([express.json(), express.urlencoded({ extended: true })]);

// Create a MariaDB connection pool
const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "my-secret-pw",
  database: "mydb",
  connectionLimit: 5,
});

// Initialize the database
const initDB = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )
    `);
    console.log("Database initialized and ready.");
  } catch (err) {
    console.error("Database initialization failed:", err);
  } finally {
    if (conn) conn.release();
  }
};

// Reusable database handler
const handleDB = async (callback, res, next) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await callback(conn);
  } catch (err) {
    next(err);
  } finally {
    if (conn) conn.release();
  }
};

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

app.get("/users", (req, res, next) => {
  handleDB(
    async (conn) => {
      const users = await conn.query("SELECT * FROM users");
      res.status(200).json({ success: true, data: users });
    },
    res,
    next
  );
});

app.post("/users", (req, res, next) => {
  const { name } = req.body;
  if (!name)
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });

  handleDB(
    async (conn) => {
      const result = await conn.query("INSERT INTO users (name) VALUES (?)", [
        name,
      ]);
      console.log(result);

      res
        .status(201)
        .json({ success: true, message: "User created successfully" });
    },
    res,
    next
  );
});

app.put("/users/:id", (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name)
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });

  handleDB(
    async (conn) => {
      const result = await conn.query(
        "UPDATE users SET name = ? WHERE id = ?",
        [name, id]
      );
      res
        .status(200)
        .json({
          success: true,
          message: "User updated successfully",
          data: result,
        });
    },
    res,
    next
  );
});

app.delete("/users/:id", (req, res, next) => {
  const { id } = req.params;

  handleDB(
    async (conn) => {
      const result = await conn.query("DELETE FROM users WHERE id = ?", [id]);
      res
        .status(200)
        .json({
          success: true,
          message: "User deleted successfully",
          data: result,
        });
    },
    res,
    next
  );
});

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res
    .status(statusCode)
    .json({ success: false, message: err.message || "Internal Server Error" });
});

// Start the server
app.listen(port, async () => {
  await initDB();
  console.log(`Server is running on http://localhost:${port}`);
});
