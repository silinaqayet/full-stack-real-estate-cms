// Ortalanmış başlık bloğu: üst etiket → başlık → altın çizgi → açıklama.
// Tüm herkese açık sayfalar bunu kullanır; boşluklar tek yerden değişir.
function BolumBasligi({ ustBaslik, baslik, seviye = 'h2', aciklama, meta }) {
  const Etiket = seviye // 'h1' | 'h2'

  return (
    <div className="text-center">
      {ustBaslik && <p className="eyebrow">{ustBaslik}</p>}

      <Etiket className="mt-4 text-balance">{baslik}</Etiket>

      <span className="mx-auto mt-7 block h-px w-16 bg-gold-300" />

      {aciklama && (
        <p className="mx-auto mt-7 max-w-2xl leading-relaxed text-ink-500">
          {aciklama}
        </p>
      )}

      {meta && (
        <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-ink-400">
          {meta}
        </p>
      )}
    </div>
  )
}

export default BolumBasligi
