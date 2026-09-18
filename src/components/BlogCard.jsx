import { Link } from 'react-router-dom'

function BlogCard({ yazi }) {
  const tarih = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(yazi.created_at))

  return (
    <article className="h-full">
      <Link
        to={`/blog/${yazi.id}`}
        className="group flex h-full flex-col border border-ink-200 bg-white transition duration-300 hover:border-gold-400"
      >
        <div className="aspect-[4/3] shrink-0 overflow-hidden bg-ink-100">
          {yazi.image_url ? (
            <img
              src={yazi.image_url}
              alt={yazi.baslik}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-[10px] uppercase tracking-[0.2em] text-ink-400">
              Görsel yok
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-7">
          <p className="eyebrow">{tarih}</p>

          <h3 className="mt-3 line-clamp-2 font-display text-xl leading-snug text-ink-900">
            {yazi.baslik}
          </h3>

          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink-500">
            {yazi.icerik}
          </p>

          <span className="mt-auto pt-7 text-[11px] uppercase tracking-[0.2em] text-gold-700">
            Devamını oku →
          </span>
        </div>
      </Link>
    </article>
  )
}

export default BlogCard
