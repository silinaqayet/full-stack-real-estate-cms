import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

function dogrula(g) {
  const hatalar = []
  if (!g.baslik?.trim()) hatalar.push('Başlık zorunludur.')
  if (!g.icerik?.trim()) hatalar.push('İçerik zorunludur.')
  return hatalar
}

function degerler(g) {
  return [g.baslik.trim(), g.icerik.trim(), g.image_url?.trim() || null]
}

function gecerliId(deger) {
  const id = Number(deger)
  return Number.isInteger(id) ? id : null
}

// ── OKUMA (herkese açık) ───────────────────────────────────────────
router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'select * from blog_posts order by created_at desc'
  )
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const id = gecerliId(req.params.id)
  if (id === null) return res.status(404).json({ error: 'Yazı bulunamadı' })

  const { rows } = await pool.query('select * from blog_posts where id = $1', [
    id,
  ])
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Yazı bulunamadı' })
  }

  res.json(rows[0])
})

// ── YAZMA (giriş gerekli) ──────────────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  const govde = req.body ?? {}
  const hatalar = dogrula(govde)
  if (hatalar.length > 0) return res.status(400).json({ error: hatalar[0] })

  const { rows } = await pool.query(
    `insert into blog_posts (baslik, icerik, image_url)
     values ($1, $2, $3)
     returning *`,
    degerler(govde)
  )

  res.status(201).json(rows[0])
})

router.put('/:id', requireAuth, async (req, res) => {
  const id = gecerliId(req.params.id)
  if (id === null) return res.status(404).json({ error: 'Yazı bulunamadı' })

  const govde = req.body ?? {}
  const hatalar = dogrula(govde)
  if (hatalar.length > 0) return res.status(400).json({ error: hatalar[0] })

  const { rows } = await pool.query(
    `update blog_posts set baslik = $1, icerik = $2, image_url = $3
     where id = $4
     returning *`,
    [...degerler(govde), id]
  )

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Yazı bulunamadı' })
  }

  res.json(rows[0])
})

router.delete('/:id', requireAuth, async (req, res) => {
  const id = gecerliId(req.params.id)
  if (id === null) return res.status(404).json({ error: 'Yazı bulunamadı' })

  const { rows } = await pool.query(
    'delete from blog_posts where id = $1 returning id',
    [id]
  )

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Yazı bulunamadı' })
  }

  res.json({ id: rows[0].id })
})

export default router
