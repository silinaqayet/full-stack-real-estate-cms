import { Link } from 'react-router-dom'

function IlanCard({ ilan }) {
  const satilik = ilan.tip === 'satilik'
  const fiyat = new Intl.NumberFormat('tr-TR').format(ilan.fiyat)
  const kapak = ilan.gorseller?.[0] // ilk görsel = kapak

  return (
    <article className="h-full">
      {/* flex kolon: fiyat blogu mt-auto ile en alta yapışır, böylece
          başlık bir veya iki satır olsa da kartlarda aynı hizada durur. */}
      <Link
        to={`/ilanlar/${ilan.id}`}
        className="group flex h-full flex-col border border-ink-200 bg-white transition duration-300 hover:border-gold-400"
      >
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-ink-100">
          {kapak ? (
            <img
              src={kapak}
              alt={ilan.baslik}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-[10px] uppercase tracking-[0.2em] text-ink-400">
              Görsel yok
            </div>
          )}

          <span
            className={`absolute left-0 top-5 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] ${
              satilik ? 'bg-ink-900 text-white' : 'bg-gold-500 text-ink-950'
            }`}
          >
            {satilik ? 'Satılık' : 'Kiralık'}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-7">
          <p className="eyebrow">{ilan.konum}</p>

          <h3 className="mt-3 line-clamp-2 font-display text-xl leading-snug text-ink-900">
            {ilan.baslik}
          </h3>

          <div className="mt-auto pt-7">
            {(ilan.oda_sayisi || ilan.metrekare) && (
              <div className="flex gap-6 border-t border-ink-100 pt-5 text-[11px] uppercase tracking-[0.15em] text-ink-400">
                {ilan.oda_sayisi && <span>{ilan.oda_sayisi}</span>}
                {ilan.metrekare && <span>{ilan.metrekare} m²</span>}
              </div>
            )}

            <p className="mt-5 font-display text-2xl leading-none text-ink-900">
              {fiyat} ₺
              {!satilik && (
                <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-ink-400">
                  {' '}
                  / ay
                </span>
              )}
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default IlanCard
