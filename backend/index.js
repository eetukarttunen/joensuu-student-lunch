const express = require('express');
const menuService = require('./services/menuService');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET'],
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

const cache = new NodeCache({ stdTTL: 30 * 60, checkperiod: 30 * 60 }); // 30-minute cache

const apiLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 5, // Max 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const cachedData = cache.get('menusData');
    if (cachedData) {
      return res.status(200).json(cachedData.data); //Serve cached data if available
    }
    return res.status(429).json({ message: 'Rate limit exceeded. Please wait before trying again.' });
  }
});

app.use('/api/', (req, res, next) => {
  const origin = req.get('Origin');
  if (origin === process.env.origin) {
    return apiLimiter(req, res, next);
  }
  return res.status(403).json({ message: 'Access Denied' });
});

app.get('/api', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
});

app.get('/api/menus', async (req, res) => {
  const category = req.query.category; // Get the category parameter from query string
  const cachedData = cache.get('menusData');

  if (cachedData) {
    let data = cachedData.data;
    if (category) {
      data = data.filter(item => item.category === category);
    }
    return res.status(200).json(data); // Serve filtered or full cached data
  }

  try {
    const data = await menuService.getData();
    cache.set('menusData', { data, timestamp: Date.now() }); // Cache the data
    
    if (category) {
      return res.status(200).json(data.filter(item => item.category === category));
    }
    res.status(200).json(data);
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
