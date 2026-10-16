import 'dotenv/config';
import { readFileSync } from 'node:fs';
import bcrypt from 'bcryptjs';
import { pool } from './pool.js';

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  console.error('Не заданы ADMIN_EMAIL и ADMIN_PASSWORD в .env');
  process.exit(1);
}

const schema = readFileSync('./db/schema.sql', 'utf-8');
const raw = JSON.parse(readFileSync('./data/db.json', 'utf-8'));
const products = Array.isArray(raw) ? raw : raw.products;

await pool.query(schema); // 1. создаём таблицы

for (const p of products) { // 2. переносим товары из db.json
  const name = p.name ?? p.title;                                  // название: name или title
  const price = Math.round(Number(String(p.price).replace(/[^\d.]/g, '')));
  await pool.query(
    `INSERT INTO products (name, category, price, unit, image)
     VALUES ($1, $2, $3, $4, $5)`,
    [name, p.category ?? null, price, p.unit ?? 'кг', p.image ?? null]
  );
}

// 3. Администратор: email и пароль берём из .env, в базу кладём только хэш
const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
await pool.query(
  `INSERT INTO users (name, email, password_hash, role)
   VALUES ($1, $2, $3, 'admin')`,
  ['Администратор', process.env.ADMIN_EMAIL.trim().toLowerCase(), hash]
);

console.log(
  `Готово: товаров — ${products.length}, админ — ${process.env.ADMIN_EMAIL}`
);
await pool.end(); // 4. закрываем соединения, иначе скрипт не завершится
