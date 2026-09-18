import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

const TIPLER = ['satilik', 'kiralik']

function dogrula(g) {
  const hatalar = []

  if (!g.baslik?.trim()) hatalar.push('Başlık zorunludur.')
  if (!g.konum?.trim()) hatalar.push('Konum zorunludur.')

  const fiyat = Number(g.fiyat)
  if (!Number.isFinite(fiyat) || fiyat <= 0) {
    hatalar.push('Fiyat sıfırdan büyük bir sayı olmalıdır.')
  }

  if (String(g.metrekare ?? '').trim() !== '') {
    const m = Number(g.metrekare)
    if (!Number.isFinite(m) || m <= 0) {
      hatalar.push('Metrekare sıfırdan büyük bir sayı olmalıdır.')
    }
  }

  if (!TIPLER.includes(g.tip)) hatalar.push('Tip satilik veya kiralik olmalıdır.')

  return hatalar
}

// Sorgu parametrelerini kolon sırasına göre dizer.
function degerler(g) {
  return [
    g.baslik.trim(),
    g.aciklama?.trim() || null,
    Number(g.fiyat),
    g.konum.trim(),
    g.oda_sayisi?.trim() || null,
    String(g.metrekare ?? '').trim() === '' ? null : Number(g.metrekare),
    g.tip,
    Array.isArray(g.gorseller)
      ? g.gorseller.map((u) => String(u).trim()).filter(Boolean)
      : [],
  ]
}

function gecerliId(deger) {
  const id = Number(deger)
  return Number.isInteger(id) ? id : null
}

// ── OKUMA (herkese açık) ───────────────────────────────────────────
router.get('/', async (req, res) => {
  const limit = Number(req.query.limit)

  const { rows } =
    Number.isInteger(limit) && limit > 0
      ? await pool.query(
          'select * from ilanlar order by created_at desc limit $1',
          [limit]
        )
      : await pool.query('select * from ilanlar order by created_at desc')

  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const id = gecerliId(req.params.id)
  if (id === null) return res.status(404).json({ error: 'İlan bulunamadı' })

  const { rows } = await pool.query('select * from ilanlar where id = $1', [id])
  if (rows.length === 0) {
    return res.status(404).json({ error: 'İlan bulunamadı' })
  }

  res.json(rows[0])
})

// ── YAZMA (giriş gerekli) ──────────────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  const govde = req.body ?? {}
  const hatalar = dogrula(govde)
  if (hatalar.length > 0) return res.status(400).json({ error: hatalar[0] })

  const { rows } = await pool.query(
    `insert into ilanlar
       (baslik, aciklama, fiyat, konum, oda_sayisi, metrekare, tip, gorseller)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     returning *`,
    degerler(govde)
  )

  res.status(201).json(rows[0])
})

router.put('/:id', requireAuth, async (req, res) => {
  const id = gecerliId(req.params.id)
  if (id === null) return res.status(404).json({ error: 'İlan bulunamadı' })

  const govde = req.body ?? {}
  const hatalar = dogrula(govde)
  if (hatalar.length > 0) return res.status(400).json({ error: hatalar[0] })

  const { rows } = await pool.query(
    `update ilanlar set
       baslik = $1, aciklama = $2, fiyat = $3, konum = $4,
       oda_sayisi = $5, metrekare = $6, tip = $7, gorseller = $8
     where id = $9
     returning *`,
    [...degerler(govde), id]
  )

  if (rows.length === 0) {
    return res.status(404).json({ error: 'İlan bulunamadı' })
  }

  res.json(rows[0])
})

router.delete('/:id', requireAuth, async (req, res) => {
  const id = gecerliId(req.params.id)
  if (id === null) return res.status(404).json({ error: 'İlan bulunamadı' })

  const { rows } = await pool.query(
    'delete from ilanlar where id = $1 returning id',
    [id]
  )

  if (rows.length === 0) {
    return res.status(404).json({ error: 'İlan bulunamadı' })
  }

  res.json({ id: rows[0].id })
})

export default router
