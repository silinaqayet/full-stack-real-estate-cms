import { Link } from 'react-router-dom'
import BolumBasligi from '../components/BolumBasligi.jsx'

const hizmetler = [
  {
    no: '01',
    baslik: 'Satılık',
    ozet:
      'Portföyümüzdeki daire, villa ve ofisleri sizin için değerlendirir; alım sürecinin her adımında yanınızda oluruz.',
    maddeler: [
      'Bütçe ve ihtiyaç analizi',
      'Yerinde inceleme ve karşılaştırmalı fiyat raporu',
      'Tapu, iskân ve kredi süreçlerinin takibi',
    ],
  },
  {
    no: '02',
    baslik: 'Kiralık',
    ozet:
      'Kiraya vermek isteyen mülk sahipleri ile doğru kiracıyı buluşturur, sözleşme sürecini baştan sona yönetiriz.',
    maddeler: [
      'Kiracı ön değerlendirmesi ve referans kontrolü',
      'Sözleşme hazırlığı ve teslim tutanağı',
      'Kira dönemi boyunca iletişim desteği',
    ],
  },
  {
    no: '03',
    baslik: 'Danışmanlık',
    ozet:
      'Elinizdeki gayrimenkulün bugünkü değerini ve önümüzdeki yıllarda nasıl bir seyir izleyeceğini birlikte konuşuruz.',
    maddeler: [
      'Bölge ve piyasa analizi',
      'Değerleme raporu',
      'Satış öncesi hazırlık ve fiyatlama önerisi',
    ],
  },
  {
    no: '04',
    baslik: 'Yatırım',
    ozet:
      'Getiri odaklı yatırımcılar için, ulaşım ve kentsel dönüşüm projelerini takip ederek fırsatları önceden belirleriz.',
    maddeler: [
      'Yükselen bölge tespiti',
      'Kira getirisi ve amortisman hesabı',
      'Portföy çeşitlendirme planı',
    ],
  },
]

function Hizmetlerimiz() {
  return (
    <>
      <section>
        <BolumBasligi
          ustBaslik="Ne yapıyoruz"
          baslik="Hizmetlerimiz"
          seviye="h1"
          aciklama="Almak, kiralamak, değerlendirmek ya da yatırım yapmak — hangi aşamada olursanız olun süreci sizinle birlikte yürütüyoruz."
        />

        <div className="content-gap grid grid-cols-1 gap-8 lg:grid-cols-2">
          {hizmetler.map((hizmet) => (
            <article
              key={hizmet.no}
              className="border border-ink-200 bg-white p-8 transition duration-300 hover:border-gold-400 sm:p-10"
            >
              <p className="eyebrow">{hizmet.no}</p>

              <h2 className="mt-3 text-2xl">{hizmet.baslik}</h2>

              <span className="mt-6 block h-px w-12 bg-gold-400" />

              <p className="mt-6 leading-loose text-ink-500">{hizmet.ozet}</p>

              <ul className="mt-8 space-y-3 border-t border-ink-100 pt-6">
                {hizmet.maddeler.map((madde) => (
                  <li
                    key={madde}
                    className="flex gap-3 text-sm leading-relaxed text-ink-500"
                  >
                    <span className="text-gold-500">—</span>
                    {madde}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-gap border border-ink-200 bg-white px-6 py-16 text-center sm:px-12">
        <BolumBasligi
          ustBaslik="Nasıl başlarız"
          baslik="Önce sizi dinleyelim"
          aciklama="İhtiyacınızı anlamadan ilan göstermiyoruz. Kısa bir görüşme, çoğu zaman haftalarca ev gezmekten daha yol aldırıyor."
        />

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            to="/iletisim"
            className="border border-gold-500 px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-gold-700 hover:bg-gold-500 hover:text-white"
          >
            Bize ulaşın
          </Link>

          <Link
            to="/ilanlar"
            className="border border-ink-300 px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-ink-600 hover:bg-ink-50"
          >
            İlanları görün
          </Link>
        </div>
      </section>
    </>
  )
}

export default Hizmetlerimiz
