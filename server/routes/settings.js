import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

// Sadece bu anahtarlar yazılabilir; istemci uydurma anahtar ekleyemesin.
const IZINLI = ['telefon', 'email', 'adres']

async function tumAyarlar(sorgulayici = pool) {
  const { rows } = await sorgulayici.query('select key, value from settings')

  const ayarlar = {}
  rows.forEach((satir) => {
    ayarlar[satir.key] = satir.value
  })

  return ayarlar
}

// GET /api/settings → { telefon, email, adres }
router.get('/', async (req, res) => {
  res.json(await tumAyarlar())
})

// PUT /api/settings  { telefon, email, adres }
router.put('/', requireAuth, async (req, res) => {
  const govde = req.body ?? {}
  const girdiler = IZINLI.filter((anahtar) => anahtar in govde)

  if (girdiler.length === 0) {
    return res.status(400).json({ error: 'Güncellenecek ayar bulunamadı.' })
  }

  for (const anahtar of girdiler) {
    if (!String(govde[anahtar] ?? '').trim()) {
      return res.status(400).json({ error: `${anahtar} boş bırakılamaz.` })
    }
  }

  // Üç satır ya hep birlikte yazılır ya hiç: yarım kaydedilmiş ayar olmasın.
  const client = await pool.connect()

  try {
    await client.query('begin')

    for (const anahtar of girdiler) {
      await client.query('update settings set value = $1 where key = $2', [
        String(govde[anahtar]).trim(),
        anahtar,
      ])
    }

    await client.query('commit')
  } catch (e) {
    await client.query('rollback')
    throw e
  } finally {
    client.release()
  }

  res.json(await tumAyarlar())
})

export default router
