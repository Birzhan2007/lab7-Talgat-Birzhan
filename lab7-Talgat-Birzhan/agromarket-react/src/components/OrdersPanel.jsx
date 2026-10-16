import { useEffect, useState } from 'react';
import { apiFetch } from '../api.js';

export const STATUS_LABELS = {
  new: 'Новая',
  processing: 'В работе',
  done: 'Выполнена',
  cancelled: 'Отменена',
};

// Бонус: панель заявок — только для администратора
export default function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/orders')
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function changeStatus(id, status) {
    setError('');
    try {
      const updated = await apiFetch(`/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      // в таблице обновляем только изменённую строку
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, ...updated } : o)));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Загрузка заявок…</p>;

  return (
    <section className="orders-panel">
      <h3>Заявки ({orders.length})</h3>
      {error && <p className="error">{error}</p>}
      {orders.length === 0 ? (
        <p>Заявок пока нет.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>№</th><th>Товар</th><th>Клиент</th><th>Контакты</th>
                <th>Кол-во</th><th>Доставка</th><th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.product_name ?? '— (товар удалён)'}</td>
                  <td>{o.name}{o.user_id ? '' : ' (гость)'}</td>
                  <td>{o.email}{o.phone ? `, ${o.phone}` : ''}</td>
                  <td>{o.quantity}</td>
                  <td>{o.delivery_date ?? '—'}</td>
                  <td>
                    <select value={o.status}
                            onChange={(e) => changeStatus(o.id, e.target.value)}>
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
