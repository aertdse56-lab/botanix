import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // mapping process.env.API_KEY to the variable Vercel injects
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});