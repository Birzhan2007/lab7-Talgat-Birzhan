import { useState } from 'react';
import { apiFetch } from '../api.js';

// Бонус: смена пароля — PATCH /auth/password
export default function ChangePasswordForm() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));

    try {
      const result = await apiFetch('/auth/password', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      setMessage(result.message);
      form.reset();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="password-form" onSubmit={handleSubmit}>
      <h3>Смена пароля</h3>
      <input name="oldPassword" type="password" placeholder="Старый пароль" required />
      <input name="newPassword" type="password" placeholder="Новый пароль (от 8 символов)"
             required minLength={8} />
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <button type="submit">Сменить пароль</button>
    </form>
  );
}
