import express from 'express';

const app = express();

app.get('/api/menus', (req, res) => {
  res.json([{ message: 'Hello from test API' }]);
});

app.get('/', (req, res) => {
  res.status(403).json({ message: 'Access Denied' });
});

export default app;
