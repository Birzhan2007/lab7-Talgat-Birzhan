import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Сервер разработки по умолчанию: http://localhost:5173 (его ждёт CORS_ORIGIN на сервере)
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
