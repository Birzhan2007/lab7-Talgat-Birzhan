import { useState, useEffect } from 'react';
import { apiFetch } from './api.js';
import LoginForm from './components/LoginForm.jsx';
import AddProductForm from './components/AddProductForm.jsx';
import ContactForm from './components/ContactForm.jsx';
import OrdersPanel from './components/OrdersPanel.jsx';
import MyOrders from './components/MyOrders.jsx';
import ChangePasswordForm from './components/ChangePasswordForm.jsx';

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [ordersVersion, setOrdersVersion] = useState(0); // обновляет «Мои заявки» после новой заявки

  // Пользователь читается из localStorage (ленивая инициализация)
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('user') || 'null')
  );

  // Каталог: открытый маршрут, поиск выполняет сервер (?search=)
  useEffect(() => {
    apiFetch(`/products?search=${encodeURIComponent(search)}`)
      .then((list) => { setProducts(list); setError(''); })
      .catch((err) => setError(err.message));
  }, [search]);

  // При открытии страницы проверяем сохранённый токен
  useEffect(() => {
    if (!localStorage.getItem('token')) return; // не входили — проверять нечего
    apiFetch('/auth/me')
      .then((me) => {
        localStorage.setItem('user', JSON.stringify(me));
        setUser(me);
      })
      .catch(() => {}); // при 401 apiFetch сам выполнит выход
  }, []);

  function handleLogin(user, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  // Бонус: удаление товара (только admin; настоящая проверка — на сервере)
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
    <>
      <header className="site-header">
        <h1>АгроМаркет</h1>
      </header>

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

      <main>
        {error && <p className="error">{error}</p>}

        {/* Форма товара и панель заявок — только администратору */}
        {user?.role === 'admin' && (
          <>
            <AddProductForm onAdded={(p) => setProducts([...products, p])} />
            <OrdersPanel />
          </>
        )}

        {/* «Мои заявки» и смена пароля — обычному пользователю */}
        {user?.role === 'user' && (
          <>
            <MyOrders key={ordersVersion} />
            <ChangePasswordForm />
          </>
        )}

        <h2>Каталог</h2>
        <input
          className="search"
          type="search"
          placeholder="Поиск товара…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {products.length === 0 ? (
          <p>Ничего не найдено.</p>
        ) : (
          <ul className="catalog">
            {products.map((p) => (
              <li key={p.id} className="card">
                <h3>{p.name}</h3>
                <div className="meta">{p.category ?? 'Без категории'}</div>
                <div className="price">{p.price} ₸ / {p.unit}</div>
                {user?.role === 'admin' && (
                  <button className="delete-btn" onClick={() => handleDelete(p)}>
                    Удалить
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <h2>Заявка</h2>
        <ContactForm
          key={user?.id ?? 'guest'}
          products={products}
          user={user}
          onSent={() => setOrdersVersion((v) => v + 1)}
        />
      </main>
    </>
  );
}
