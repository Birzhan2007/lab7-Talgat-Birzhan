import { useState } from 'react';
import { apiFetch } from '../api.js';

// Форма заявки. Открыта для всех: если пользователь вошёл, apiFetch сам добавит токен,
// и сервер сохранит user_id (заявка появится в «Моих заявках»).
export default function ContactForm({ products, user, onSent }) {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));

    try {
      const order = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          product_id: data.product_id ? Number(data.product_id) : null,
          name: data.name,
          email: data.email,
          phone: data.phone,
          quantity: Number(data.quantity),
          date: data.date,
          comment: data.comment,
        }),
      });
      setMessage(`Заявка №${order.id} отправлена`);
      form.reset();
      onSent?.(order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h3>Оставить заявку</h3>

      <select name="product_id" defaultValue="">
        <option value="">— Товар не выбран —</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <input name="name" placeholder="Ваше имя" defaultValue={user?.name ?? ''} required />
      <input name="email" type="email" placeholder="Email" defaultValue={user?.email ?? ''} required />
      <input name="phone" placeholder="Телефон" />
      <input name="quantity" type="number" min="10" placeholder="Количество (от 10)" required />
      <input name="date" type="date" />
      <textarea name="comment" placeholder="Комментарий" rows={3} />

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Отправка…' : 'Отправить'}
      </button>
    </form>
  );
}
