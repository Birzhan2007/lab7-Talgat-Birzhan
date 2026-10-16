import 'dotenv/config'; // ← ПЕРВОЙ строкой: читает .env в process.env
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pool } from './db/pool.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';

// Без секретного ключа сервер работать не должен — лучше упасть сразу и явно
if (!process.env.JWT_SECRET) {
  console.error('Не задан JWT_SECRET в .env');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet()); // защитные HTTP-заголовки — первым middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json({ limit: '10kb' })); // тело запроса не больше 10 КБ
app.use(logger);

app.get('/', (req, res) => {
  res.send('АгроМаркет API работает');
});

// «Жив ли сервер и есть ли связь с базой?»
app.get('/api/health', async (req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok', db: 'connected', time: new Date().toISOString() });
});

// GET /api/about из лабораторной 5
app.get('/api/about', (req, res) => {
  res.json({ name: 'АгроМаркет API', version: '1.0.0' });
});

app.use('/api/auth', authRouter); // ← перед /api/products
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.use((req, res) => {
  res.status(404).json({ error: `Маршрут ${req.method} ${req.originalUrl} не найден` });
});

app.use(errorHandler); // ← последний middleware

app.listen(PORT, () => {
  console.log(`API запущен: http://localhost:${PORT}`);
});
