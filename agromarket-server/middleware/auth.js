import jwt from 'jsonwebtoken';

// Достаёт токен из заголовка  Authorization: Bearer eyJhbGciOi...
function getToken(req) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');
  return type === 'Bearer' && token ? token : null;
}

// Пропускает дальше только запросы с действительным токеном
export function requireAuth(req, res, next) {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Требуется вход в систему' });
  }

  try {
    // verify проверяет подпись и срок действия; при ошибке — исключение
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: Number(payload.sub), role: payload.role };
    next();
  } catch (err) {
    const error = err.name === 'TokenExpiredError'
      ? 'Срок действия токена истёк, войдите снова'
      : 'Недействительный токен';
    return res.status(401).json({ error });
  }
}

// Бонус: если токен есть и он действителен — заполняет req.user,
// если токена нет (или он плохой) — просто пропускает запрос как анонимный
export function optionalAuth(req, res, next) {
  const token = getToken(req);
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: Number(payload.sub), role: payload.role };
    } catch {
      // недействительный токен для открытого маршрута — не ошибка
    }
  }
  next();
}

// Пропускает дальше только пользователей с нужной ролью.
// Используется ПОСЛЕ requireAuth: requireRole('admin')
export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    next();
  };
}
