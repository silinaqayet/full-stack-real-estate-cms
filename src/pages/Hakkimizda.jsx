const istatistikler = [
  { deger: '2008', etiket: 'Kuruluş yılı' },
  { deger: '1.400+', etiket: 'Tamamlanan işlem' },
  { deger: '12', etiket: 'Uzman danışman' },
  { deger: '%98', etiket: 'Müşteri memnuniyeti' },
]

// Örnek kadro — gerçek isimlerle değiştirin.
const ekip = [
  { ad: 'Ayşe Demir', unvan: 'Kurucu Ortak' },
  { ad: 'Mehmet Yılmaz', unvan: 'Satış Direktörü' },
  { ad: 'Elif Kaya', unvan: 'Kiralama Uzmanı' },
  { ad: 'Burak Şahin', unvan: 'Yatırım Danışmanı' },
]

import BolumBasligi from '../components/BolumBasligi.jsx'

function basHarfler(ad) {
  return ad
    .split(' ')
    .map((parca) => parca[0])
    .join('')
}

function Hakkimizda() {
  return (
    <>
      <section>
        <BolumBasligi
          ustBaslik="Sky Gayrimenkul"
          baslik="Hakkımızda"
          seviye="h1"
          aciklama="2008'den bu yana İstanbul'un en değerli bölgelerinde, doğru evi doğru kişiyle buluşturuyoruz."
        />

        <div className="content-gap grid items-center gap-12 lg:grid-cols-2">
          <div className="aspect-[4/3] border border-ink-200 bg-ink-100">
            <img
              src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1000&q=80&auto=format&fit=crop"
              alt="İstanbul'dan bir görünüm"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h2>Bir semti tanımak, bir evi tanımaktır</h2>
            <span className="mt-6 block h-px w-16 bg-gold-400" />

            <p className="mt-8 leading-loose text-ink-500">
              Sky Gayrimenkul, Levent&apos;te küçük bir ofiste üç danışmanla
              yola çıktı. Bugün İstanbul&apos;un Avrupa ve Anadolu
              yakasında geniş bir portföyü yönetiyoruz; ancak çalışma
              biçimimiz ilk günkü gibi kaldı.
            </p>

            <p className="mt-6 leading-loose text-ink-500">
              Her ilanı yerinde görüyor, her semti yalnızca fiyat
              tablolarından değil sokaklarından tanıyoruz. Bir daireyi
              önermeden önce ulaşımını, komşuluğunu, gün ışığını ve
              gelecekteki değerini değerlendiriyoruz.
            </p>

            <p className="mt-6 leading-loose text-ink-500">
              Amacımız hızlı satış yapmak değil; alıcının da satıcının da
              yıllar sonra doğru karar verdiğini düşüneceği işlemler
              gerçekleştirmek.
            </p>
          </div>
        </div>
      </section>

      <section className="section-gap border-y border-ink-200 bg-white py-16">
        <dl className="grid grid-cols-2 gap-10 px-8 text-center lg:grid-cols-4">
          {istatistikler.map((istatistik) => (
            <div key={istatistik.etiket}>
              <dt className="font-display text-4xl text-ink-900 sm:text-5xl">
                {istatistik.deger}
              </dt>
              <dd className="mt-3 text-[11px] uppercase tracking-[0.2em] text-ink-400">
                {istatistik.etiket}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section-gap">
        <BolumBasligi ustBaslik="Kadromuz" baslik="Ekibimiz" />

        <div className="content-gap grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ekip.map((kisi) => (
            <article
              key={kisi.ad}
              className="border border-ink-200 bg-white p-8 text-center"
            >
              <span className="mx-auto grid h-16 w-16 place-items-center border border-gold-400 font-display text-xl text-gold-600">
                {basHarfler(kisi.ad)}
              </span>

              <h3 className="mt-6 font-display text-xl text-ink-900">
                {kisi.ad}
              </h3>

              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-ink-400">
                {kisi.unvan}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default Hakkimizda
