import { useState, useEffect } from 'react'
import { apiGet, apiPut } from '../../lib/api.js'

// Formdaki alanlar = settings tablosundaki satırlar.
const alanlar = [
  { anahtar: 'telefon', etiket: 'Telefon', tip: 'tel' },
  { anahtar: 'email', etiket: 'E-posta', tip: 'email' },
  { anahtar: 'adres', etiket: 'Adres', tip: 'text' },
]

function AdminIletisim() {
  const [form, setForm] = useState({ telefon: '', email: '', adres: '' })
  const [hatalar, setHatalar] = useState({})
  const [yukleniyor, setYukleniyor] = useState(true)
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const [genelHata, setGenelHata] = useState('')
  const [basarili, setBasarili] = useState(false)

  useEffect(() => {
    async function getir() {
      try {
        // API zaten { telefon, email, adres } nesnesi döndürüyor.
        const data = await apiGet('/api/settings')
        setForm((onceki) => ({ ...onceki, ...data }))
      } catch (e) {
        setGenelHata('İletişim bilgileri yüklenemedi: ' + e.message)
      } finally {
        setYukleniyor(false)
      }
    }

    getir()
  }, [])

  function degistir(olay) {
    const { name, value } = olay.target
    setForm((onceki) => ({ ...onceki, [name]: value }))
    setBasarili(false)
  }

  function dogrula() {
    const yeni = {}

    if (!form.telefon.trim()) {
      yeni.telefon = 'Telefon zorunludur.'
    }

    if (!form.email.trim()) {
      yeni.email = 'E-posta zorunludur.'
    } else if (!form.email.includes('@')) {
      yeni.email = 'Geçerli bir e-posta adresi girin.'
    }

    if (!form.adres.trim()) {
      yeni.adres = 'Adres zorunludur.'
    }

    return yeni
  }

  async function gonder(olay) {
    olay.preventDefault()
    setGenelHata('')
    setBasarili(false)

    const bulunanlar = dogrula()
    setHatalar(bulunanlar)
    if (Object.keys(bulunanlar).length > 0) return

    setKaydediliyor(true)

    try {
      // Tek istek; sunucu üçünü tek transaction'da yazıyor.
      await apiPut('/api/settings', {
        telefon: form.telefon.trim(),
        email: form.email.trim(),
        adres: form.adres.trim(),
      })
      setBasarili(true)
    } catch (e) {
      setGenelHata('Kaydedilemedi: ' + e.message)
    } finally {
      setKaydediliyor(false)
    }
  }

  if (yukleniyor) {
    return <p className="text-sm text-ink-400">Yükleniyor…</p>
  }

  return (
    <div className="max-w-xl">
      <p className="text-[11px] uppercase tracking-[0.2em] text-gold-600">
        Yönetim
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink-900">İletişim</h1>
      <p className="mt-3 text-sm text-ink-500">
        Bu bilgiler sitedeki İletişim sayfasında görünür.
      </p>

      {genelHata && (
        <p
          role="alert"
          className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {genelHata}
        </p>
      )}

      {basarili && (
        <p
          role="status"
          className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          İletişim bilgileri kaydedildi.
        </p>
      )}

      <form onSubmit={gonder} noValidate className="mt-8 space-y-6">
        {alanlar.map((alan) => (
          <div key={alan.anahtar}>
            <label htmlFor={alan.anahtar} className="form-label">
              {alan.etiket} *
            </label>
            <input
              id={alan.anahtar}
              name={alan.anahtar}
              type={alan.tip}
              value={form[alan.anahtar]}
              onChange={degistir}
              className="form-input"
            />
            {hatalar[alan.anahtar] && (
              <p className="form-error">{hatalar[alan.anahtar]}</p>
            )}
          </div>
        ))}

        <div className="border-t border-ink-200 pt-6">
          <button type="submit" disabled={kaydediliyor} className="btn-solid">
            {kaydediliyor ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminIletisim
