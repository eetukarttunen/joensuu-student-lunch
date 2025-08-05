import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { getData } from './services/menuService';
import NodeCache from 'node-cache';
import type { RestaurantResponse, RestaurantResponseSuccess } from './services/menuService';

const app = express();

const corsOptions = {
  origin: 'https://opiskelijaruokalista.vercel.app', // Allow only this domain
  methods: ['GET'], // Allow only GET requests
  allowedHeaders: ['Content-Type'], // Allow this header (adjust as needed)
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

const cache = new NodeCache({ stdTTL: 30 * 60, checkperiod: 30 * 60 });

const apiLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 5, // Max 5 requests per window
  handler: (req: Request, res: Response) => {
    const cachedData = cache.get('menusData') as
      | { data: RestaurantResponse[]; timestamp: number }
      | undefined;
    if (cachedData) {
      return res.status(200).json(cachedData.data); // Serve cached data if available
    }
    return res.status(429).json({ message: 'Rate limit exceeded. Please wait before trying again.' });
  },
});

app.use('/api/', (req: Request, res: Response, _next: NextFunction) => {
  const origin = req.get('Origin');
  console.log(origin);
  if (origin === process.env.ORIGIN) {
    return apiLimiter(req, res, _next);
  }
  return res.status(403).json({ message: 'Access Denied' });
});

app.get('/api/menus', async (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  const cachedData = cache.get('menusData') as
    | { data: RestaurantResponse[]; timestamp: number }
    | undefined;

  function isSuccess(item: RestaurantResponse): item is RestaurantResponseSuccess {
    return 'category' in item;
  }

  if (cachedData) {
    let data = cachedData.data;

    if (category) {
      data = data.filter(isSuccess).filter(item => item.category === category);
    }

    return res.status(200).json(data);
  }

  try {
    const data = await getData();

    cache.set('menusData', { data, timestamp: Date.now() });

    if (category) {
      const filtered = data.filter(isSuccess).filter(item => item.category === category);
      return res.status(200).json(filtered);
    }

    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: 'Internal Server Error', details: 'Unable to fetch menus at this time' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.status(403).json({ message: 'Access Denied' });
});

// error handler middleware
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  if (err instanceof Error) {
    res.status(500).json({ error: 'Something went wrong', details: err.message });
  } else {
    res.status(500).json({ error: 'Something went wrong', details: 'Unknown error' });
  }
});

export default app;