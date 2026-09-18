import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'

import { pool } from './db.js'
import ilanlarRouter from './routes/ilanlar.js'
import blogRouter from './routes/blog.js'
import settingsRouter from './routes/settings.js'
import authRouter from './routes/auth.js'
import uploadRouter, { YUKLEME_KLASORU } from './routes/upload.js'

const app = express()
const PORT = process.env.PORT || 3000

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET eksik. server/.env dosyasını doldurun.')
}

// Vite başka portta çalıştığı için tarayıcı bunu ister.
// credentials: ileride cookie tabanlı oturum için gerekli.
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
)

app.use(express.json())

// Oturumlar Postgres'te "session" tablosunda tutulur; sunucu yeniden
// başlayınca kimse çıkış yapmış olmaz. Tablo yoksa otomatik oluşturulur.
const PgSession = connectPgSimple(session)

app.use(
  session({
    store: new PgSession({ pool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // giriş yapılmadan çerez yazma
    cookie: {
      httpOnly: true, // JavaScript okuyamaz → XSS çerezi çalamaz
      secure: process.env.NODE_ENV === 'production', // prod'da sadece HTTPS
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 gün
    },
  })
)

// Yüklenen görseller. Dosya adları rastgele olduğu için içerik hiç
// değişmez → uzun süreli önbellek güvenli.
app.use(
  '/uploads',
  express.static(YUKLEME_KLASORU, { maxAge: '1y', immutable: true })
)

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/ilanlar', ilanlarRouter)
app.use('/api/blog', blogRouter)
app.use('/api/settings', settingsRouter)

// Eşleşmeyen her yol
app.use((req, res) => {
  res.status(404).json({ error: 'Bulunamadı' })
})

// Route'lardan fırlayan hatalar buraya düşer (Express 5 async'i de yakalar).
app.use((err, req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Sunucu hatası' })
})

app.listen(PORT, () => {
  console.log(`API çalışıyor: http://localhost:${PORT}`)
})
