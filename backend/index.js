var express = require('express');
const menuService = require("./services/menuService");
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const corsOptions = {
  origin: 'https://opiskelijaruokalista.vercel.app',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
};

app.use(cors(corsOptions));
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());
app.use('/api/', apiLimiter);

const API_KEY = process.env.API_KEY;

app.use('/api/', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(403).json({ message: 'Access Denied' });
  }
  next();
});

app.get('/', (req, res) => {
  res.status(403).json({ message: 'Access Denied' });
});

app.get("/api/menus", async (req, res) => {
  try {
    const data = await menuService.getData();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching menus:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: 'Unable to fetch menus at this time' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong', details: err.message });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log("Server is running"));
