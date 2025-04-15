const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Initialize SQLite database
const dbPath = path.join(__dirname, 'data', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('SQLite connection error:', err.message);
  } else {
    console.log('Connected to SQLite');
  }
});

app.use(express.json());

// Test database connection
app.get('/', (req, res) => {
  db.get('SELECT sqlite_version() AS version', (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Connected to SQLite', version: row.version });
  });
});

// Create users table
app.get('/setup', (req, res) => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE
    )`,
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Table created' });
    }
  );
});

// Create a user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  db.run(
    `INSERT INTO users (name, email) VALUES (?, ?)`,
    [name, email],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      db.get(
        `SELECT * FROM users WHERE id = ?`,
        [this.lastID],
        (err, row) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json(row);
        }
      );
    }
  );
});

// Get all users
app.get('/users', (req, res) => {
  db.all(`SELECT * FROM users`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Close database on process exit
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});