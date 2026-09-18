import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { requireAuth } from '../middleware/requireAuth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// server/uploads — nereden başlatılırsa başlatılsın aynı yer.
export const YUKLEME_KLASORU = path.join(__dirname, '..', 'uploads')
fs.mkdirSync(YUKLEME_KLASORU, { recursive: true })

const IZINLI_TURLER = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAKS_BOYUT = 5 * 1024 * 1024 // 5 MB
const MAKS_ADET = 10

const depolama = multer.diskStorage({
  destination: (req, file, cb) => cb(null, YUKLEME_KLASORU),
  filename: (req, file, cb) => {
    // Rastgele ad: çakışma ve Türkçe karakter sorunu olmasın.
    const uzanti = path.extname(file.originalname).toLowerCase() || '.jpg'
    cb(null, `${crypto.randomUUID()}${uzanti}`)
  },
})

function turFiltresi(req, file, cb) {
  if (!IZINLI_TURLER.includes(file.mimetype)) {
    const hata = new Error('Sadece JPG, PNG, WEBP veya GIF yükleyebilirsiniz.')
    hata.status = 400
    return cb(hata)
  }

  cb(null, true)
}

const yukle = multer({
  storage: depolama,
  fileFilter: turFiltresi,
  limits: { fileSize: MAKS_BOYUT, files: MAKS_ADET },
}).array('dosyalar', MAKS_ADET)

const router = Router()

// POST /api/upload  (multipart/form-data, alan adı: dosyalar)
// → { urller: ["/uploads/xxx.jpg", ...] }
router.post('/', requireAuth, (req, res) => {
  // multer'ı elle çağırıyoruz ki hatalarını Türkçeye çevirebilelim.
  yukle(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Dosya 5 MB sınırını aşıyor.' })
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res
          .status(400)
          .json({ error: `En fazla ${MAKS_ADET} dosya yükleyebilirsiniz.` })
      }
      return res
        .status(err.status || 400)
        .json({ error: err.message || 'Yükleme başarısız.' })
    }

    if (!req.files?.length) {
      return res.status(400).json({ error: 'Dosya seçilmedi.' })
    }

    // Göreli yol kaydediyoruz: alan adı değişirse veritabanı bozulmasın.
    res.status(201).json({
      urller: req.files.map((dosya) => `/uploads/${dosya.filename}`),
    })
  })
})

export default router
