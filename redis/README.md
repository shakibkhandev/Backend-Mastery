# Redis Express API Project

This project demonstrates the integration of Redis with Express.js for building a high-performance API with caching capabilities.

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- Git

## Project Setup Guide (From Zero)

### 1. Create Project Directory

```bash
mkdir redis-express-api
cd redis-express-api
```

### 2. Initialize Node.js Project

```bash
npm init -y
```

Update the package.json to add "type": "commonjs":

```bash
npm pkg set type="commonjs"
```

### 3. Install Dependencies

```bash
npm install express ioredis dotenv
```

### 4. Create Project Files

1. Create the environment files:

Create `.env`:

```bash
echo "REDIS_URL=redis://localhost:6379
PORT=3000" > .env
```

2. Create Docker Compose file (`compose.yaml`):

```yaml
services:
  redis:
    image: redis:latest
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

3. Create `.gitignore`:

```bash
echo "node_modules/
.env
.DS_Store" > .gitignore
```

4. Create the main application file (`index.js`):

```javascript
require("dotenv").config();
const express = require("express");
const Redis = require("ioredis");

const app = express();
const port = process.env.PORT || 3000;

// Redis client setup
const redis = new Redis(process.env.REDIS_URL);

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Data endpoints
app.post("/api/data", async (req, res) => {
  try {
    const { key, value } = req.body;
    await redis.set(key, JSON.stringify(value));
    res.json({ message: "Data stored successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/data", async (req, res) => {
  try {
    const keys = await redis.keys("*");
    const data = {};
    for (const key of keys) {
      data[key] = JSON.parse(await redis.get(key));
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/data/:id", async (req, res) => {
  try {
    const value = await redis.get(req.params.id);
    if (!value) return res.status(404).json({ error: "Not found" });
    res.json(JSON.parse(value));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/data/:id", async (req, res) => {
  try {
    const result = await redis.del(req.params.id);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search endpoint
app.get("/api/search", async (req, res) => {
  try {
    const { q } = req.query;
    const keys = await redis.keys("*");
    const results = {};

    for (const key of keys) {
      const value = JSON.parse(await redis.get(key));
      if (JSON.stringify(value).toLowerCase().includes(q.toLowerCase())) {
        results[key] = value;
      }
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

5. Create a test file (`test.http`):

```http
### Health Check
GET http://localhost:3000/health

### Store Data
POST http://localhost:3000/api/data
Content-Type: application/json

{
    "key": "user1",
    "value": {
        "name": "John Doe",
        "age": 30
    }
}

### Get All Data
GET http://localhost:3000/api/data

### Get Specific Data
GET http://localhost:3000/api/data/user1

### Search Data
GET http://localhost:3000/api/search?q=john

### Delete Data
DELETE http://localhost:3000/api/data/user1
```

### 5. Start Redis using Docker Compose

```bash
docker-compose up -d
```

### 6. Run the Application

```bash
node index.js
```

The API will be available at `http://localhost:3000`.


## Project Structure

```
.
├── .env                 # Environment variables
├── .env.sample         # Sample environment variables
├── index.js            # Main application file
├── compose.yaml        # Docker compose configuration
├── package.json        # Project dependencies
└── test.http          # API test file
```

## Features

- Express.js REST API
- Redis integration for caching
- Docker Compose setup
- Environment variable configuration
- API testing file included

## Development

To modify the project:

1. Make your changes in `index.js`
2. Update environment variables if needed
3. Restart the application to apply changes

## Testing

You can use the included `test.http` file to test the API endpoints. If you're using VS Code, install the "REST Client" extension to execute the tests directly from the editor.

## Troubleshooting

1. If Redis connection fails:

   - Ensure Docker is running
   - Check if Redis container is up (`docker ps`)
   - Verify REDIS_URL in .env file

2. If the application won't start:
   - Check if port 3000 is available
   - Ensure all dependencies are installed
   - Verify environment variables are set correctly

## License

ISC
