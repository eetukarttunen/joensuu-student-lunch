const express = require('express');
const menuService = require('./services/menuService');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');

const app = express();

const corsOptions = {
  origin: process.env.origin,
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

const cache = new NodeCache({ stdTTL: 30 * 60, checkperiod: 30 * 60 }); // Cache TTL is now 30 minutes to match the rate limit window

const apiLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 5, // Max 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const cachedData = cache.get('menusData');
    if (cachedData) {
      return res.status(200).json(cachedData.data); // Serve cached data if available
    }
    return res.status(429).json({ message: 'Rate limit exceeded. Please wait for the rate limit to reset before trying again.' });
  }
});

app.use('/api/', (req, res, next) => {
  const origin = req.get('Origin');
  if (origin === process.env.origin) {
    return apiLimiter(req, res, next); // Apply rate limiter for valid origin
  }
  return res.status(403).json({ message: 'Access Denied' });
});

app.get('/api/menus', async (req, res) => {
  const cachedData = cache.get('menusData');

  // Serve cached data if valid and within rate limit window
  if (cachedData) {
    return res.status(200).json(cachedData.data); // Serve cached data
  }

  // If rate limit is hit, serve cached data if available
  if (req.rateLimit && req.rateLimit.remaining === 0) {
    if (cachedData) {
      return res.status(200).json(cachedData.data); // Serve cached data if rate limit exceeded
    }
  }

  // Fetch fresh data if no valid cache exists and rate limit is not hit
  try {
    const data = await menuService.getData();
    cache.set('menusData', { data, timestamp: Date.now() }); // Cache the data with the timestamp
    res.status(200).json(data); // Send new data
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: 'Unable to fetch menus at this time' });
  }
});

app.get('/', (req, res) => {
  res.status(403).json({ message: 'Access Denied' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong', details: err.message });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
