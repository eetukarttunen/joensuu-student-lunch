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
app.use(helmet());

const cache = new NodeCache({ stdTTL: 30 * 60, checkperiod: 30 * 60 }); // 30 minutes

const apiLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 5, // Max 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log('Rate limit exceeded, checking cache...');

    const cachedData = cache.get('menusData');
    if (cachedData) {
      console.log('Serving cached data due to rate limit exceeded.');
      return res.status(200).json(cachedData.data); // Serve cached data if available
    }

    console.log('No cached data available, returning 429 error.');
    return res.status(429).json({ message: 'Rate limit exceeded. Please wait for the rate limit to reset before trying again.' });
  }
});

app.use('/api/', (req, res, next) => {
  const origin = req.get('Origin');
  if (origin === process.env.origin) {
    console.log('Origin is valid, applying rate limiter...');
    return apiLimiter(req, res, next); // Apply rate limiter for valid origin
  }
  console.log('Access denied due to invalid origin');
  return res.status(403).json({ message: 'Access Denied' });
});

app.get('/api/menus', async (req, res) => {
  console.log('Checking cache for menus data...');
  const cachedData = cache.get('menusData');

  if (cachedData) {
    console.log('Cache hit, serving cached data...');
    return res.status(200).json(cachedData.data); // Serve cached data if valid
  }

  // If rate limit is hit, serve cached data if available
  if (req.rateLimit && req.rateLimit.remaining === 0) {
    console.log('Rate limit exceeded, checking for cached data...');
    if (cachedData) {
      console.log('Rate limit exceeded, but cache is available. Serving cached data...');
      return res.status(200).json(cachedData.data); // Serve cached data if rate limit exceeded
    }
  }

  console.log('Cache miss or rate limit not hit, fetching fresh data...');
  try {
    const data = await menuService.getData();
    console.log('Data fetched successfully from restaurant API.');

    // Cache the data with the timestamp
    cache.set('menusData', { data, timestamp: Date.now() });
    console.log('New data cached and now being served...');
    res.status(200).json(data); // Send new data
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: 'Unable to fetch menus at this time' });
  }
});

app.get('/', (req, res) => {
  console.log('Access denied for root route.');
  res.status(403).json({ message: 'Access Denied' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Something went wrong', details: err.message });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
