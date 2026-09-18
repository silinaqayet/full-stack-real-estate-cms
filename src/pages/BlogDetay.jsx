import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiGet } from '../lib/api.js'

function BlogDetay() {
  const { id } = useParams()
  const [yazi, setYazi] = useState(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)

  useEffect(() => {
    async function getir() {
      setYukleniyor(true)
      setHata(null)

      try {
        setYazi(await apiGet(`/api/blog/${id}`))
      } catch (e) {
        if (e.status === 404) setYazi(null)
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
        Yazı yüklenemedi: {hata}
      </p>
    )
  }

  if (!yazi) {
    return (
      <div className="mx-auto max-w-md border border-ink-200 bg-white p-12 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-3xl">Yazı bulunamadı</h1>
        <span className="mx-auto mt-6 block h-px w-16 bg-gold-300" />
        <p className="mt-6 text-ink-500">
          Aradığınız yazı kaldırılmış veya adres hatalı olabilir.
        </p>
        <Link
          to="/blog"
          className="mt-8 inline-block border border-gold-500 px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-gold-700 hover:bg-gold-500 hover:text-white"
        >
          Tüm yazılara dön
        </Link>
      </div>
    )
  }

  const tarih = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(yazi.created_at))

  // Boş satırla ayrılmış metni paragraflara böl.
  const paragraflar = yazi.icerik.split('\n\n')

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        to="/blog"
        className="text-[11px] uppercase tracking-[0.2em] text-ink-400 hover:text-gold-700"
      >
        ← Bloga dön
      </Link>

      <div className="mt-6 border border-ink-200 bg-white">
        <div className="aspect-[16/9] bg-ink-100">
          <img
            src={yazi.image_url}
            alt={yazi.baslik}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-8 sm:p-12">
          <p className="eyebrow">{tarih}</p>
          <h1 className="mt-3">{yazi.baslik}</h1>

          <span className="mt-8 block h-px w-16 bg-gold-400" />

          <div className="mt-8">
            {paragraflar.map((paragraf, i) => (
              <p key={i} className="mt-6 leading-loose text-ink-500 first:mt-0">
                {paragraf}
              </p>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogDetay
