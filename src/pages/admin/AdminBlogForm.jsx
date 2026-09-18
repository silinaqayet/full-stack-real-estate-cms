import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { apiGet, apiPost, apiPut, apiUpload } from '../../lib/api.js'

const bosForm = {
  baslik: '',
  icerik: '',
  image_url: '',
}

function AdminBlogForm() {
  const { id } = useParams()
  const duzenleme = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(bosForm)
  const [hatalar, setHatalar] = useState({})
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(duzenleme)
  const [genelHata, setGenelHata] = useState('')
  const [yukleniyorGorsel, setYukleniyorGorsel] = useState(false)
  const [gorselHatasi, setGorselHatasi] = useState('')

  useEffect(() => {
    if (!duzenleme) return

    async function getir() {
      try {
        const data = await apiGet(`/api/blog/${id}`)
        setForm({
          baslik: data.baslik ?? '',
          icerik: data.icerik ?? '',
          image_url: data.image_url ?? '',
        })
      } catch (e) {
        setGenelHata(
          e.status === 404 ? 'Yazı bulunamadı.' : 'Yazı yüklenemedi: ' + e.message
        )
      } finally {
        setYukleniyor(false)
      }
    }

    getir()
  }, [id, duzenleme])

  function degistir(olay) {
    const { name, value } = olay.target
    setForm((onceki) => ({ ...onceki, [name]: value }))
  }

  // Tek görsel: yüklenen dosyanın yolu image_url'e yazılır.
  async function dosyaYukle(olay) {
    const dosya = olay.target.files?.[0]
    if (!dosya) return

    setGorselHatasi('')
    setYukleniyorGorsel(true)

    const veri = new FormData()
    veri.append('dosyalar', dosya)

    try {
      const { urller } = await apiUpload('/api/upload', veri)
      setForm((onceki) => ({ ...onceki, image_url: urller[0] }))
    } catch (e) {
      setGorselHatasi(e.message)
    } finally {
      setYukleniyorGorsel(false)
      olay.target.value = ''
    }
  }

  function dogrula() {
    const yeni = {}

    if (!form.baslik.trim()) {
      yeni.baslik = 'Başlık zorunludur.'
    }

    if (!form.icerik.trim()) {
      yeni.icerik = 'İçerik zorunludur.'
    }

    return yeni
  }

  async function gonder(olay) {
    olay.preventDefault()
    setGenelHata('')

    const bulunanlar = dogrula()
    setHatalar(bulunanlar)
    if (Object.keys(bulunanlar).length > 0) return

    setKaydediliyor(true)

    const kayit = {
      baslik: form.baslik.trim(),
      icerik: form.icerik.trim(),
      image_url: form.image_url.trim() || null,
    }

    try {
      if (duzenleme) await apiPut(`/api/blog/${id}`, kayit)
      else await apiPost('/api/blog', kayit)

      navigate('/admin/blog')
    } catch (e) {
      setGenelHata('Kaydedilemedi: ' + e.message)
      setKaydediliyor(false)
    }
  }

  if (yukleniyor) {
    return <p className="text-sm text-ink-400">Yükleniyor…</p>
  }

  return (
    <div className="max-w-3xl">
      <Link
        to="/admin/blog"
        className="text-[11px] uppercase tracking-[0.2em] text-ink-400 hover:text-gold-700"
      >
        ← Yazılara dön
      </Link>

      <h1 className="mt-4 font-display text-3xl text-ink-900">
        {duzenleme ? 'Yazıyı Düzenle' : 'Yeni Yazı'}
      </h1>

      {genelHata && (
        <p
          role="alert"
          className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {genelHata}
        </p>
      )}

      <form onSubmit={gonder} noValidate className="mt-8 space-y-6">
        <div>
          <label htmlFor="baslik" className="form-label">
            Başlık *
          </label>
          <input
            id="baslik"
            name="baslik"
            value={form.baslik}
            onChange={degistir}
            className="form-input"
          />
          {hatalar.baslik && <p className="form-error">{hatalar.baslik}</p>}
        </div>

        <div>
          <label htmlFor="icerik" className="form-label">
            İçerik *
          </label>
          <textarea
            id="icerik"
            name="icerik"
            rows={18}
            value={form.icerik}
            onChange={degistir}
            className="form-input leading-relaxed"
          />
          <p className="mt-2 text-xs text-ink-400">
            Paragrafları ayırmak için aralarına bir boş satır bırakın.
          </p>
          {hatalar.icerik && <p className="form-error">{hatalar.icerik}</p>}
        </div>

        <div>
          <label htmlFor="image_url" className="form-label">
            Görsel bağlantısı (URL)
          </label>
          <input
            id="image_url"
            name="image_url"
            value={form.image_url}
            onChange={degistir}
            placeholder="https://… veya bilgisayardan yükleyin"
            className="form-input"
          />

          <label
            className={`mt-3 inline-block border px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] transition ${
              yukleniyorGorsel
                ? 'cursor-not-allowed border-ink-200 text-ink-300'
                : 'cursor-pointer border-ink-900 bg-ink-900 text-white hover:bg-ink-800'
            }`}
          >
            {yukleniyorGorsel ? 'Yükleniyor…' : '↑ Bilgisayardan yükle'}
            <input
              type="file"
              accept="image/*"
              onChange={dosyaYukle}
              disabled={yukleniyorGorsel}
              className="sr-only"
            />
          </label>

          {gorselHatasi && <p className="form-error">{gorselHatasi}</p>}

          {form.image_url.trim() !== '' && (
            <img
              src={form.image_url}
              alt=""
              className="mt-3 h-32 w-48 border border-ink-200 bg-ink-100 object-cover"
            />
          )}
        </div>

        <div className="flex gap-3 border-t border-ink-200 pt-6">
          <button
            type="submit"
            disabled={kaydediliyor || yukleniyorGorsel}
            className="btn-solid"
          >
            {kaydediliyor ? 'Kaydediliyor…' : 'Kaydet'}
          </button>

          <Link to="/admin/blog" className="btn-outline">
            Vazgeç
          </Link>
        </div>
      </form>
    </div>
  )
}

export default AdminBlogForm
