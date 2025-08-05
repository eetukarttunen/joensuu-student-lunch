import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { getData } from './services/menuService';
import NodeCache from 'node-cache';
import type { RestaurantResponse, RestaurantResponseSuccess } from './services/menuService';

const app = express();

const ORIGIN = process.env.ORIGIN;

const corsOptions = {
  origin: ORIGIN,
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

const cache = new NodeCache({ stdTTL: 30 * 60, checkperiod: 30 * 60 });

const apiLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const cachedData = cache.get('menusData') as { data: RestaurantResponse[] } | undefined;
    if (cachedData) {
      return res.status(200).json(cachedData.data);
    }
    return res.status(429).json({ message: 'Rate limit exceeded. Please wait before trying again.' });
  },
});

app.use('/api/', (req: Request, res: Response, next: NextFunction) => {
  const origin = req.get('Origin') || '';
  if (origin === ORIGIN) {
    return apiLimiter(req, res, next);
  }
  return res.status(403).json({ message: 'Access Denied' });
});

app.get('/api/menus', async (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;

  function isSuccess(item: RestaurantResponse): item is RestaurantResponseSuccess {
    return 'category' in item;
  }

  try {
    const cachedData = cache.get('menusData') as { data: RestaurantResponse[] } | undefined;
    if (cachedData) {
      let data = cachedData.data;
      if (category) {
        data = data.filter(isSuccess).filter(item => item.category === category);
      }
      return res.status(200).json(data);
    }

    const data = await getData();
    cache.set('menusData', { data });

    let responseData = data;
    if (category) {
      responseData = data.filter(isSuccess).filter(item => item.category === category);
    }
    return res.status(200).json(responseData);
  } catch (err) {
    console.error('Error fetching menus:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: 'Unable to fetch menus at this time' });
  }
});

app.get('/', (_req: Request, res: Response) => {
  res.status(403).json({ message: 'Access Denied' });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  if (err instanceof Error) {
    return res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
  return res.status(500).json({ error: 'Something went wrong', details: 'Unknown error' });
});

export default app;
