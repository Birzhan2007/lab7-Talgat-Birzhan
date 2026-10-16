# АгроМаркет (React) — Лабораторная 7

Выполнил: Біржан Талғат

В этой папке — только то, что **добавляется** к проекту `agromarket-react` из ЛР5/ЛР6.

## Куда что положить

| Файл | Действие |
|------|----------|
| `src/api.js` | новый файл |
| `src/lab7.css` | новый файл (подключается в App.jsx) |
| `src/components/LoginForm.jsx` | новый файл |
| `src/components/AddProductForm.jsx` | новый файл |
| `src/components/OrdersPanel.jsx` | новый файл (бонус) |
| `src/components/MyOrders.jsx` | новый файл (бонус) |
| `src/components/ChangePasswordForm.jsx` | новый файл (бонус) |
| `src/App.example.jsx` | пример: перенесите блоки «ЛР7» в свой `App.jsx` |

## Две правки в уже существующих файлах

1. В `App.jsx` и `components/ContactForm.jsx` замените свою константу адреса API на
   `import { API_URL } from './api.js';` (в компонентах — `'../api.js'`).
2. Чтобы заявка попадала в «Мои заявки», в `ContactForm.jsx` отправляйте её через `apiFetch`
   (он сам добавляет токен, если пользователь вошёл):

```js
import { apiFetch } from '../api.js';
// вместо fetch(`${API_URL}/orders`, {...}):
await apiFetch('/orders', { method: 'POST', body: JSON.stringify(order) });
```

Без токена заявка по-прежнему создаётся (как гостевая), просто `user_id` у неё будет пустым.

## Запуск

```
npm run dev   # http://localhost:5173
```

Сервер (`agromarket-server`) должен работать на `http://localhost:3000`.
