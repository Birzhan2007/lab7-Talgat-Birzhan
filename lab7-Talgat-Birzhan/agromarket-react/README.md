# АгроМаркет (React) — Лабораторная 7

Выполнил: Біржан Талғат

React-клиент (Vite) для API `agromarket-server`: каталог, заявки, вход и регистрация, роли.

## Запуск

```
npm install
npm run dev        # http://localhost:5173
```

Сервер (`agromarket-server`) должен работать на `http://localhost:3000`.
Адрес API задан в одном месте — `src/api.js`.

## Что умеет

- Каталог с поиском (`GET /api/products?search=`), открыт всем.
- Форма заявки (`POST /api/orders`) — для всех; у вошедшего пользователя заявка привязывается к аккаунту.
- Вход и регистрация (`LoginForm`), токен хранится в `localStorage`, запросы идут через `apiFetch`
  с заголовком `Authorization: Bearer …`; при 401 с токеном выполняется выход.
- При открытии страницы токен проверяется через `GET /api/auth/me`.
- Администратор: форма нового товара, кнопка «Удалить», панель заявок со сменой статуса.
- Обычный пользователь: «Мои заявки» и смена пароля.

## Структура

```
src/
├── api.js                  API_URL и apiFetch (добавляет токен)
├── App.jsx                 состояние пользователя, каталог, показ блоков по роли
├── main.jsx, styles.css, lab7.css
└── components/
    ├── LoginForm.jsx       вход / регистрация
    ├── AddProductForm.jsx  новый товар (admin)
    ├── ContactForm.jsx     заявка
    ├── OrdersPanel.jsx     все заявки + статус (admin)
    ├── MyOrders.jsx        мои заявки (user)
    └── ChangePasswordForm.jsx
```
