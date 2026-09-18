import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Veritabanında görseller "/uploads/x.jpg" gibi göreli duruyor.
  // Dev'de Vite 5173'te olduğu için bu yolları API'ye yönlendiriyoruz.
  // Üretimde her şey aynı sunucudan servis edileceği için proxy gerekmez.
  server: {
    proxy: {
      '/uploads': 'http://localhost:3000',
    },
  },
})
