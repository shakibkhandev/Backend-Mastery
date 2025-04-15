const express = require('express');
const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Redis client setup with ioredis
const redisClient = new Redis({
    port: process.env.REDIS_PORT,
    retryStrategy: times => Math.min(times * 50, 2000) // Reconnect strategy
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

// Example Usage Routes
// Set a key-value pair
app.post('/set', async (req, res) => {
    const { key, value } = req.body;
    try {
        await redisClient.set(key, value);
        res.json({ message: `Key ${key} set successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a value by key
app.get('/get/:key', async (req, res) => {
    const { key } = req.params;
    try {
        const value = await redisClient.get(key);
        if (value) {
            res.json({ key, value });
        } else {
            res.status(404).json({ message: 'Key not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Example: Cache a counter with expiration
app.get('/counter', async (req, res) => {
    const cacheKey = 'counter';
    try {
        // Check if counter exists in cache
        let count = await redisClient.get(cacheKey);
        
        if (count === null) {
            // If not in cache, initialize and set with 60s expiration
            count = 0;
            await redisClient.setex(cacheKey, 60, count);
        } else {
            // Increment counter
            count = await redisClient.incr(cacheKey);
        }
        
        res.json({ counter: parseInt(count) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});