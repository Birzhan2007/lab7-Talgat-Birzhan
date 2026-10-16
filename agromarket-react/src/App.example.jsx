// ПРИМЕР App.jsx для лабораторной 7.
// Если у вас уже есть свой App.jsx (каталог из ЛР5) — не заменяйте его целиком,
// а перенесите блоки, помеченные «ЛР7». Ваш <ContactForm /> оставьте как есть.
import { useState, useEffect } from 'react';
import './lab7.css';
import { apiFetch } from './api.js';                              // ЛР7
import LoginForm from './components/LoginForm.jsx';               // ЛР7
import AddProductForm from './components/AddProductForm.jsx';     // ЛР7
import OrdersPanel from './components/OrdersPanel.jsx';           // ЛР7 бонус
import MyOrders from './components/MyOrders.jsx';                 // ЛР7 бонус
import ChangePasswordForm from './components/ChangePasswordForm.jsx'; // ЛР7 бонус

export default function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  // ЛР7: пользователь читается из localStorage (ленивая инициализация)
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('user') || 'null')
  );

  // Загрузка каталога (открытый маршрут)
  useEffect(() => {
    apiFetch('/products')
      .then(setProducts)
      .catch((err) => setError(err.message));
  }, []);

  // ЛР7: при открытии страницы проверяем сохранённый токен
  useEffect(() => {
    if (!localStorage.getItem('token')) return; // не входили — проверять нечего
    apiFetch('/auth/me')
      .then((me) => {
        localStorage.setItem('user', JSON.stringify(me));
        setUser(me);
      })
      .catch(() => {}); // при 401 apiFetch сам выполнит выход
  }, []);

  // ЛР7
  function handleLogin(user, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }

  // ЛР7
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  // ЛР7 бонус: удаление товара (только admin)
  async function handleDelete(product) {
    if (!confirm('Удалить товар?')) return;
    try {
      await apiFetch('/products/' + product.id, { method: 'DELETE' });
      setProducts((list) => list.filter((p) => p.id !== product.id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      {/* ЛР7: блок входа */}
      <div className="auth-bar">
        {user ? (
          <>
            <span>Вы вошли как <b>{user.name}</b> ({user.role})</span>
            <button onClick={handleLogout}>Выйти</button>
          </>
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </div>

      <h1>АгроМаркет</h1>
      {error && <p className="error">{error}</p>}

      {/* ЛР7: форма товара и панель заявок — только администратору */}
      {user?.role === 'admin' && (
        <>
          <AddProductForm onAdded={(p) => setProducts([...products, p])} />
          <OrdersPanel />
        </>
      )}

      {/* ЛР7 бонус: «Мои заявки» и смена пароля — обычному пользователю */}
      {user?.role === 'user' && (
        <>
          <MyOrders />
          <ChangePasswordForm />
        </>
      )}

      {/* Каталог */}
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <b>{p.name}</b> — {p.price} ₸ / {p.unit}
            {/* ЛР7 бонус: кнопка «Удалить» только у администратора */}
            {user?.role === 'admin' && (
              <button className="delete-btn" onClick={() => handleDelete(p)}>
                Удалить
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Ваш <ContactForm /> из ЛР5/ЛР6 — оставьте здесь */}
    </div>
  );
}
