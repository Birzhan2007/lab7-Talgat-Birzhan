import { useEffect, useState } from 'react';
import { apiFetch } from '../api.js';
import { STATUS_LABELS } from './OrdersPanel.jsx';

// Бонус: «Мои заявки» — заявки вошедшего пользователя
export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/orders/my')
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Загрузка заявок…</p>;

  return (
    <section className="my-orders">
      <h3>Мои заявки</h3>
      {error && <p className="error">{error}</p>}
      {orders.length === 0 ? (
        <p>У вас пока нет заявок.</p>
      ) : (
        <ul>
          {orders.map((o) => (
            <li key={o.id}>
              №{o.id} · {o.product_name ?? 'товар удалён'} · {o.quantity} ·{' '}
              <b>{STATUS_LABELS[o.status] ?? o.status}</b>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
