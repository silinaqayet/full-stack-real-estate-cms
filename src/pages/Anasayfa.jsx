import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../lib/api.js'
import IlanCard from '../components/IlanCard.jsx'
import BolumBasligi from '../components/BolumBasligi.jsx'

function Anasayfa() {
  const [sonIlanlar, setSonIlanlar] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)

  useEffect(() => {
    async function getir() {
      try {
        setSonIlanlar(await apiGet('/api/ilanlar?limit=3'))
      } catch (e) {
        setHata(e.message)
      } finally {
        setYukleniyor(false)
      }
    }

    getir()
  }, [])

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink-950 px-6 py-28 text-center sm:px-12 sm:py-40">
        {/* Üstten sızan altın ışık — tek dekoratif öge. */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/20 blur-3xl"
        />

        {/* İnce iç çerçeve: kutuyu "poster" gibi gösterir. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 border border-white/10 sm:inset-6"
        />

        <div className="relative">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold-400">
            İstanbul Gayrimenkul
          </p>

          <h1 className="mt-8 text-balance font-display text-5xl leading-[1.05] text-white sm:text-7xl lg:text-8xl">
            Sky Gayrimenkul
          </h1>

          <span className="mx-auto mt-10 block h-px w-24 bg-gold-500" />

          <p className="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-ink-300">
            İstanbul&apos;un en değerli bölgelerinde satılık ve kiralık
            gayrimenkul. Doğru ev, doğru fiyat, güvenilir danışmanlık.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              to="/ilanlar"
              className="bg-gold-500 px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] text-ink-950 transition hover:bg-gold-400"
            >
              İlanları görün
            </Link>

            <Link
              to="/iletisim"
              className="border border-white/25 px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white transition hover:border-gold-500 hover:text-gold-400"
            >
              Bize ulaşın
            </Link>
          </div>
        </div>
      </section>

      <section className="section-gap">
        <BolumBasligi ustBaslik="Portföyümüzden" baslik="Son İlanlar" />

        {yukleniyor && (
          <p className="content-gap text-center text-ink-400">Yükleniyor…</p>
        )}

        {hata && (
          <p className="content-gap text-center text-ink-500">
            İlanlar yüklenemedi: {hata}
          </p>
        )}

        {!yukleniyor && !hata && (
          <>
            <div className="content-gap grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {sonIlanlar.map((ilan) => (
                <IlanCard key={ilan.id} ilan={ilan} />
              ))}
            </div>

            <p className="mt-12 text-center">
              <Link
                to="/ilanlar"
                className="border border-gold-500 px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-gold-700 transition hover:bg-gold-500 hover:text-white"
              >
                Tüm ilanlar
              </Link>
            </p>
          </>
        )}
      </section>
    </>
  )
}

export default Anasayfa
