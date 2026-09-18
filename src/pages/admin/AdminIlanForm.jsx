import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { apiGet, apiPost, apiPut, apiUpload } from '../../lib/api.js'

const bosForm = {
  baslik: '',
  aciklama: '',
  fiyat: '',
  konum: '',
  oda_sayisi: '',
  metrekare: '',
  tip: 'satilik',
  gorseller: [''], // en az bir boş satır göster
}

function AdminIlanForm() {
  const { id } = useParams()
  const duzenleme = Boolean(id) // id varsa düzenleme, yoksa yeni kayıt
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
        const data = await apiGet(`/api/ilanlar/${id}`)
        // null gelen alanları '' yap: input'lar null kabul etmez.
        setForm({
          baslik: data.baslik ?? '',
          aciklama: data.aciklama ?? '',
          fiyat: data.fiyat ?? '',
          konum: data.konum ?? '',
          oda_sayisi: data.oda_sayisi ?? '',
          metrekare: data.metrekare ?? '',
          tip: data.tip ?? 'satilik',
          // Görseli olmayan ilanda boş bir satır göster.
          gorseller: data.gorseller?.length ? data.gorseller : [''],
        })
      } catch (e) {
        setGenelHata(
          e.status === 404 ? 'İlan bulunamadı.' : 'İlan yüklenemedi: ' + e.message
        )
      } finally {
        setYukleniyor(false)
      }
    }

    getir()
  }, [id, duzenleme])

  // Tek handler tüm alanları yönetir: input'un name'i state'in anahtarıdır.
  function degistir(olay) {
    const { name, value } = olay.target
    setForm((onceki) => ({ ...onceki, [name]: value }))
  }

  // --- Görsel satırları -------------------------------------------------
  function gorselDegistir(sira, deger) {
    setForm((onceki) => {
      const yeni = [...onceki.gorseller] // kopya al, orijinali değiştirme
      yeni[sira] = deger
      return { ...onceki, gorseller: yeni }
    })
  }

  function gorselEkle() {
    setForm((onceki) => ({ ...onceki, gorseller: [...onceki.gorseller, ''] }))
  }

  // Dosyaları sunucuya yollar; dönen /uploads/... yollarını listeye ekler.
  async function dosyaYukle(olay) {
    const dosyalar = Array.from(olay.target.files ?? [])
    if (dosyalar.length === 0) return

    setGorselHatasi('')
    setYukleniyorGorsel(true)

    const veri = new FormData()
    dosyalar.forEach((dosya) => veri.append('dosyalar', dosya))

    try {
      const { urller } = await apiUpload('/api/upload', veri)

      setForm((onceki) => {
        const dolu = onceki.gorseller.filter((u) => u.trim() !== '')
        return { ...onceki, gorseller: [...dolu, ...urller] }
      })
    } catch (e) {
      setGorselHatasi(e.message)
    } finally {
      setYukleniyorGorsel(false)
      olay.target.value = '' // aynı dosya tekrar seçilebilsin
    }
  }

  function gorselSil(sira) {
    setForm((onceki) => {
      const kalan = onceki.gorseller.filter((_, i) => i !== sira)
      // Hiç satır kalmasın istemiyoruz: en az bir boş kutu dursun.
      return { ...onceki, gorseller: kalan.length ? kalan : [''] }
    })
  }
  // ----------------------------------------------------------------------

  function dogrula() {
    const yeni = {}

    if (!form.baslik.trim()) {
      yeni.baslik = 'Başlık zorunludur.'
    }

    if (!form.konum.trim()) {
      yeni.konum = 'Konum zorunludur.'
    }

    if (String(form.fiyat).trim() === '') {
      yeni.fiyat = 'Fiyat zorunludur.'
    } else if (Number.isNaN(Number(form.fiyat))) {
      yeni.fiyat = 'Fiyat sayı olmalıdır.'
    } else if (Number(form.fiyat) <= 0) {
      yeni.fiyat = 'Fiyat sıfırdan büyük olmalıdır.'
    }

    if (String(form.metrekare).trim() !== '') {
      if (Number.isNaN(Number(form.metrekare))) {
        yeni.metrekare = 'Metrekare sayı olmalıdır.'
      } else if (Number(form.metrekare) <= 0) {
        yeni.metrekare = 'Metrekare sıfırdan büyük olmalıdır.'
      }
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

    // Boş metinleri null'a çevir, sayıları sayıya.
    const kayit = {
      baslik: form.baslik.trim(),
      aciklama: form.aciklama.trim() || null,
      fiyat: Number(form.fiyat),
      konum: form.konum.trim(),
      oda_sayisi: form.oda_sayisi.trim() || null,
      metrekare:
        String(form.metrekare).trim() === '' ? null : Number(form.metrekare),
      tip: form.tip,
      // Boş satırları at, sırayı koru. Hiç görsel yoksa boş dizi.
      gorseller: form.gorseller.map((u) => u.trim()).filter(Boolean),
    }

    try {
      if (duzenleme) await apiPut(`/api/ilanlar/${id}`, kayit)
      else await apiPost('/api/ilanlar', kayit)

      navigate('/admin/ilanlar')
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
        to="/admin/ilanlar"
        className="text-[11px] uppercase tracking-[0.2em] text-ink-400 hover:text-gold-700"
      >
        ← İlanlara dön
      </Link>

      <h1 className="mt-4 font-display text-3xl text-ink-900">
        {duzenleme ? 'İlanı Düzenle' : 'Yeni İlan'}
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
          {hatalar.baslik && (
            <p className="form-error">{hatalar.baslik}</p>
          )}
        </div>

        <div>
          <label htmlFor="aciklama" className="form-label">
            Açıklama
          </label>
          <textarea
            id="aciklama"
            name="aciklama"
            rows={5}
            value={form.aciklama}
            onChange={degistir}
            className="form-input"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="fiyat" className="form-label">
              Fiyat (₺) *
            </label>
            <input
              id="fiyat"
              name="fiyat"
              type="number"
              min="0"
              value={form.fiyat}
              onChange={degistir}
              className="form-input"
            />
            {hatalar.fiyat && (
              <p className="form-error">{hatalar.fiyat}</p>
            )}
          </div>

          <div>
            <label htmlFor="konum" className="form-label">
              Konum *
            </label>
            <input
              id="konum"
              name="konum"
              value={form.konum}
              onChange={degistir}
              placeholder="Kadıköy, İstanbul"
              className="form-input"
            />
            {hatalar.konum && (
              <p className="form-error">{hatalar.konum}</p>
            )}
          </div>

          <div>
            <label htmlFor="oda_sayisi" className="form-label">
              Oda Sayısı
            </label>
            <input
              id="oda_sayisi"
              name="oda_sayisi"
              value={form.oda_sayisi}
              onChange={degistir}
              placeholder="3+1"
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="metrekare" className="form-label">
              Metrekare
            </label>
            <input
              id="metrekare"
              name="metrekare"
              type="number"
              min="0"
              value={form.metrekare}
              onChange={degistir}
              className="form-input"
            />
            {hatalar.metrekare && (
              <p className="form-error">{hatalar.metrekare}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="tip" className="form-label">
            Tip *
          </label>
          <select
            id="tip"
            name="tip"
            value={form.tip}
            onChange={degistir}
            className="form-input"
          >
            <option value="satilik">Satılık</option>
            <option value="kiralik">Kiralık</option>
          </select>
        </div>

        <div>
          <span className="form-label">Görseller</span>
          <p className="mt-2 text-xs text-ink-400">
            İlk görsel kapak fotoğrafı olarak kullanılır.
          </p>

          <div className="mt-3 space-y-3">
            {form.gorseller.map((url, sira) => (
              <div key={sira} className="flex items-start gap-3">
                <img
                  src={url.trim() || undefined}
                  alt=""
                  className="h-14 w-20 shrink-0 border border-ink-200 bg-ink-100 object-cover"
                />

                <div className="flex-1">
                  <input
                    value={url}
                    onChange={(olay) => gorselDegistir(sira, olay.target.value)}
                    placeholder="https://…"
                    aria-label={`${sira + 1}. görsel bağlantısı`}
                    className="form-input mt-0"
                  />
                  {sira === 0 && url.trim() !== '' && (
                    <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-gold-600">
                      Kapak
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => gorselSil(sira)}
                  aria-label={`${sira + 1}. görseli sil`}
                  className="shrink-0 border border-ink-300 px-3 py-2.5 text-[11px] uppercase tracking-[0.15em] text-ink-500 hover:border-red-300 hover:text-red-700"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {/* Seçenek 1: dosyayı bilgisayardan yükle */}
            <label
              className={`border px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] transition ${
                yukleniyorGorsel
                  ? 'cursor-not-allowed border-ink-200 text-ink-300'
                  : 'cursor-pointer border-ink-900 bg-ink-900 text-white hover:bg-ink-800'
              }`}
            >
              {yukleniyorGorsel ? 'Yükleniyor…' : '↑ Bilgisayardan yükle'}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={dosyaYukle}
                disabled={yukleniyorGorsel}
                className="sr-only"
              />
            </label>

            {/* Seçenek 2: elle URL yapıştır */}
            <button
              type="button"
              onClick={gorselEkle}
              className="border border-ink-300 px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] text-ink-600 hover:bg-ink-50"
            >
              + URL ekle
            </button>
          </div>

          {gorselHatasi && (
            <p role="alert" className="form-error">
              {gorselHatasi}
            </p>
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

          <Link to="/admin/ilanlar" className="btn-outline">
            Vazgeç
          </Link>
        </div>
      </form>
    </div>
  )
}

export default AdminIlanForm
