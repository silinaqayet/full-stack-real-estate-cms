import { useState, useEffect } from 'react'
import { apiGet } from '../lib/api.js'
import BlogCard from '../components/BlogCard.jsx'
import BolumBasligi from '../components/BolumBasligi.jsx'

function Blog() {
  const [yazilar, setYazilar] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)

  useEffect(() => {
    async function getir() {
      try {
        setYazilar(await apiGet('/api/blog'))
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
        Yazılar yüklenemedi: {hata}
      </p>
    )
  }

  return (
    <section>
      <BolumBasligi
        ustBaslik="Gayrimenkul Rehberi"
        baslik="Blog"
        seviye="h1"
        meta={`${yazilar.length} yazı listeleniyor`}
      />

      <div className="content-gap grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {yazilar.map((yazi) => (
          <BlogCard key={yazi.id} yazi={yazi} />
        ))}
      </div>
    </section>
  )
}

export default Blog
