// Uzaktaki görselleri indirip server/uploads içine taşır ve
// veritabanındaki adresleri "/uploads/..." olarak günceller.
//
//   node scripts/gorselleri-tasi.js            → sadece Supabase Storage
//   node scripts/gorselleri-tasi.js --tum-uzak → tüm http(s) görseller
//
// Aynı script iki kez çalıştırılabilir: taşınmış olanlar atlanır.
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { pool } from '../db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const KLASOR = path.join(__dirname, '..', 'uploads')
fs.mkdirSync(KLASOR, { recursive: true })

const tumUzak = process.argv.includes('--tum-uzak')
const onbellek = new Map() // aynı adres iki kez inmesin
let tasinan = 0
let basarisiz = 0

function tasinmali(url) {
  if (typeof url !== 'string') return false
  if (!/^https?:\/\//i.test(url)) return false // zaten yerel
  return tumUzak || url.includes('supabase.co/storage')
}

function uzantiBul(contentType, url) {
  const tur = (contentType || '').toLowerCase()
  if (tur.includes('png')) return '.png'
  if (tur.includes('webp')) return '.webp'
  if (tur.includes('gif')) return '.gif'
  if (tur.includes('jpeg') || tur.includes('jpg')) return '.jpg'

  const uzanti = path.extname(new URL(url).pathname).toLowerCase()
  return uzanti || '.jpg'
}

async function indir(url) {
  if (onbellek.has(url)) return onbellek.get(url)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const ad = `${crypto.randomUUID()}${uzantiBul(res.headers.get('content-type'), url)}`
  fs.writeFileSync(path.join(KLASOR, ad), Buffer.from(await res.arrayBuffer()))

  const yeniYol = `/uploads/${ad}`
  onbellek.set(url, yeniYol)
  return yeniYol
}

async function cevir(url) {
  if (!tasinmali(url)) return url

  try {
    const yeni = await indir(url)
    tasinan++
    console.log(`  ✓ ${url}\n    → ${yeni}`)
    return yeni
  } catch (e) {
    basarisiz++
    console.warn(`  ✗ İNDİRİLEMEDİ (${e.message}): ${url}`)
    return url // başarısızsa eski adresi bozma
  }
}

// ── ilanlar.gorseller (text[]) ─────────────────────────────────────
console.log('\nilanlar:')
const { rows: ilanlar } = await pool.query(
  'select id, baslik, gorseller from ilanlar order by id'
)

for (const ilan of ilanlar) {
  const eski = ilan.gorseller ?? []
  if (eski.length === 0) continue

  console.log(`\n#${ilan.id} ${ilan.baslik}`)
  const yeni = []
  for (const url of eski) yeni.push(await cevir(url))

  if (yeni.some((u, i) => u !== eski[i])) {
    await pool.query('update ilanlar set gorseller = $1 where id = $2', [
      yeni,
      ilan.id,
    ])
  }
}

// ── blog_posts.image_url (text) ────────────────────────────────────
console.log('\nblog_posts:')
const { rows: yazilar } = await pool.query(
  'select id, baslik, image_url from blog_posts order by id'
)

for (const yazi of yazilar) {
  if (!yazi.image_url) continue

  console.log(`\n#${yazi.id} ${yazi.baslik}`)
  const yeni = await cevir(yazi.image_url)

  if (yeni !== yazi.image_url) {
    await pool.query('update blog_posts set image_url = $1 where id = $2', [
      yeni,
      yazi.id,
    ])
  }
}

console.log(`\nBitti. Taşınan: ${tasinan}, başarısız: ${basarisiz}`)
if (basarisiz > 0) {
  console.log('Başarısız olanlar için Supabase projesini SİLMEYİN.')
}

await pool.end()
