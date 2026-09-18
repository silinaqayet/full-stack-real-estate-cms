import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiGet } from '../lib/api.js'

function IlanDetay() {
  const { id } = useParams()
  const [ilan, setIlan] = useState(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)
  const [aktif, setAktif] = useState(0) // galeride gösterilen görselin sırası

  useEffect(() => {
    async function getir() {
      setYukleniyor(true)
      setHata(null)
      setAktif(0) // başka bir ilana geçildiğinde galeriyi başa sar

      try {
        setIlan(await apiGet(`/api/ilanlar/${id}`))
      } catch (e) {
        // 404 = ilan yok → aşağıdaki "bulunamadı" ekranı çıksın.
        if (e.status === 404) setIlan(null)
        else setHata(e.message)
      } finally {
        setYukleniyor(false)
      }
    }

    getir()
  }, [id])

  if (yukleniyor) {
    return <p className="py-24 text-center text-ink-400">Yükleniyor…</p>
  }

  if (hata) {
    return (
      <p className="py-24 text-center text-ink-500">
        İlan yüklenemedi: {hata}
      </p>
    )
  }

  if (!ilan) {
    return (
      <div className="mx-auto max-w-md border border-ink-200 bg-white p-12 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-3xl">İlan bulunamadı</h1>
        <span className="mx-auto mt-6 block h-px w-16 bg-gold-300" />
        <p className="mt-6 text-ink-500">
          Aradığınız ilan kaldırılmış veya adres hatalı olabilir.
        </p>
        <Link
          to="/ilanlar"
          className="mt-8 inline-block border border-gold-500 px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-gold-700 hover:bg-gold-500 hover:text-white"
        >
          Tüm ilanlara dön
        </Link>
      </div>
    )
  }

  const satilik = ilan.tip === 'satilik'
  const fiyat = new Intl.NumberFormat('tr-TR').format(ilan.fiyat)

  const gorseller = ilan.gorseller ?? []
  // aktif sıra dizinin dışında kalırsa ilk görsele düş.
  const anaGorsel = gorseller[aktif] ?? gorseller[0]

  return (
    <article>
      <Link
        to="/ilanlar"
        className="text-[11px] uppercase tracking-[0.2em] text-ink-400 hover:text-gold-700"
      >
        ← İlanlara dön
      </Link>

      <div className="mt-6 border border-ink-200 bg-white">
        <div className="relative aspect-[16/9] bg-ink-100">
          {anaGorsel ? (
            <img
              src={anaGorsel}
              alt={ilan.baslik}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-[11px] uppercase tracking-[0.2em] text-ink-400">
              Görsel yok
            </div>
          )}

          <span
            className={`absolute left-0 top-6 px-5 py-2 text-[10px] uppercase tracking-[0.2em] ${
              satilik ? 'bg-ink-900 text-white' : 'bg-gold-500 text-ink-950'
            }`}
          >
            {satilik ? 'Satılık' : 'Kiralık'}
          </span>
        </div>

        {/* Tek görsel varsa şerit gereksiz; sadece 2+ görselde göster. */}
        {gorseller.length > 1 && (
          <div className="flex gap-3 overflow-x-auto border-t border-ink-100 p-4">
            {gorseller.map((url, sira) => (
              <button
                key={sira}
                type="button"
                onClick={() => setAktif(sira)}
                aria-label={`${sira + 1}. görseli göster`}
                aria-current={sira === aktif}
                className={`h-16 w-24 shrink-0 border-2 transition ${
                  sira === aktif
                    ? 'border-gold-500'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={url}
                  alt=""
                  loading="lazy"
                  className="h-full w-full bg-ink-100 object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div className="p-8 sm:p-12">
          <p className="eyebrow">{ilan.konum}</p>
          <h1 className="mt-3">{ilan.baslik}</h1>

          <span className="mt-8 block h-px w-16 bg-gold-400" />

          <p className="mt-8 font-display text-4xl text-ink-900">
            {fiyat} ₺
            {!satilik && (
              <span className="font-sans text-sm uppercase tracking-[0.1em] text-ink-400">
                {' '}
                / ay
              </span>
            )}
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-8 border-y border-ink-100 py-8 sm:grid-cols-3">
            <div>
              <dt className="eyebrow">Oda Sayısı</dt>
              <dd className="mt-2 font-display text-2xl text-ink-900">
                {ilan.oda_sayisi}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Metrekare</dt>
              <dd className="mt-2 font-display text-2xl text-ink-900">
                {ilan.metrekare} m²
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Durum</dt>
              <dd className="mt-2 font-display text-2xl text-ink-900">
                {satilik ? 'Satılık' : 'Kiralık'}
              </dd>
            </div>
          </dl>

          <h2 className="mt-10 text-2xl">Açıklama</h2>
          <p className="mt-4 leading-loose text-ink-500">{ilan.aciklama}</p>
        </div>
      </div>
    </article>
  )
}

export default IlanDetay
