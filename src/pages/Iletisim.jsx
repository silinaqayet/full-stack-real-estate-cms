import { useState, useEffect } from 'react'
import { apiGet } from '../lib/api.js'
import BolumBasligi from '../components/BolumBasligi.jsx'

function Iletisim() {
  const [ayarlar, setAyarlar] = useState({})
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState('')

  useEffect(() => {
    async function getir() {
      try {
        // API zaten { telefon, email, adres } nesnesi döndürüyor.
        setAyarlar(await apiGet('/api/settings'))
      } catch {
        setHata('İletişim bilgileri yüklenemedi.')
      } finally {
        setYukleniyor(false)
      }
    }

    getir()
  }, [])

  return (
    <section>
      <BolumBasligi
        ustBaslik="Bize Ulaşın"
        baslik="İletişim"
        seviye="h1"
        aciklama="Portföyümüzdeki bir ilan hakkında bilgi almak veya gayrimenkulünüzü değerlendirmek için bize ulaşın."
      />

      {yukleniyor && (
        <p className="content-gap text-center text-sm text-ink-400">
          Yükleniyor…
        </p>
      )}

      {hata && <p className="content-gap text-center text-ink-500">{hata}</p>}

      {!yukleniyor && !hata && (
        <dl className="content-gap mx-auto max-w-2xl divide-y divide-ink-100 border border-ink-200 bg-white">
          <div className="p-8 sm:flex sm:items-baseline sm:gap-8">
            <dt className="eyebrow sm:w-32 sm:shrink-0">Telefon</dt>
            <dd className="mt-2 font-display text-2xl text-ink-900 sm:mt-0">
              <a
                href={`tel:${(ayarlar.telefon || '').replace(/\s/g, '')}`}
                className="hover:text-gold-700"
              >
                {ayarlar.telefon}
              </a>
            </dd>
          </div>

          <div className="p-8 sm:flex sm:items-baseline sm:gap-8">
            <dt className="eyebrow sm:w-32 sm:shrink-0">E-posta</dt>
            <dd className="mt-2 font-display text-2xl text-ink-900 sm:mt-0">
              <a
                href={`mailto:${ayarlar.email || ''}`}
                className="break-all hover:text-gold-700"
              >
                {ayarlar.email}
              </a>
            </dd>
          </div>

          <div className="p-8 sm:flex sm:items-baseline sm:gap-8">
            <dt className="eyebrow sm:w-32 sm:shrink-0">Adres</dt>
            <dd className="mt-2 leading-loose text-ink-500 sm:mt-0">
              {ayarlar.adres}
            </dd>
          </div>
        </dl>
      )}
    </section>
  )
}

export default Iletisim
