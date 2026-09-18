import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../db.js'

const router = Router()

// req.session.regenerate callback tabanlı; await edebilmek için sarmalıyoruz.
function oturumYenile(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => (err ? reject(err) : resolve()))
  })
}

// POST /api/auth/login  { email, sifre }
router.post('/login', async (req, res) => {
  const { email, sifre } = req.body ?? {}

  if (!email || !sifre) {
    return res.status(400).json({ error: 'E-posta ve şifre zorunludur.' })
  }

  const { rows } = await pool.query(
    'select id, email, password_hash from users where email = $1',
    [String(email).toLowerCase().trim()]
  )

  const kullanici = rows[0]
  const dogru =
    kullanici && (await bcrypt.compare(String(sifre), kullanici.password_hash))

  // Kullanıcı yok ile şifre yanlış aynı mesajı döner: hesap taraması yapılamasın.
  if (!dogru) {
    return res.status(401).json({ error: 'E-posta veya şifre hatalı.' })
  }

  // Giriş anında session id'yi yenile (session fixation koruması).
  await oturumYenile(req)
  req.session.userId = kullanici.id

  res.json({ id: kullanici.id, email: kullanici.email })
})

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Çıkış yapılamadı.' })
    }

    res.clearCookie('connect.sid')
    res.json({ ok: true })
  })
})

// GET /api/auth/me
router.get('/me', async (req, res) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Giriş yapılmamış.' })
  }

  const { rows } = await pool.query(
    'select id, email from users where id = $1',
    [req.session.userId]
  )

  // Oturum var ama kullanıcı silinmişse oturumu geçersiz say.
  if (rows.length === 0) {
    return res.status(401).json({ error: 'Giriş yapılmamış.' })
  }

  res.json(rows[0])
})

export default router
