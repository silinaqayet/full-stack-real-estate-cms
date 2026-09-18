import { useState, useEffect } from 'react'
import { apiGet } from '../lib/api.js'
import IlanCard from '../components/IlanCard.jsx'
import BolumBasligi from '../components/BolumBasligi.jsx'

function Ilanlar() {
  const [ilanlar, setIlanlar] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)

  useEffect(() => {
    async function getir() {
      try {
        setIlanlar(await apiGet('/api/ilanlar'))
      } catch (e) {
        setHata(e.message)
      } finally {
        setYukleniyor(false)
      }
    }

    getir()
  }, [])

  if (yukleniyor) {
    return <p className="py-24 text-center text-ink-400">Yükleniyor…</p>
  }

  if (hata) {
    return (
      <p className="py-24 text-center text-ink-500">
        İlanlar yüklenemedi: {hata}
      </p>
    )
  }

  return (
    <section>
      <BolumBasligi
        ustBaslik="Portföyümüz"
        baslik="İlanlar"
        seviye="h1"
        meta={`${ilanlar.length} ilan listeleniyor`}
      />

      <div className="content-gap grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {ilanlar.map((ilan) => (
          <IlanCard key={ilan.id} ilan={ilan} />
        ))}
      </div>
    </section>
  )
}

export default Ilanlar
