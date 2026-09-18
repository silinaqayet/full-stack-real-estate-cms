import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiGet, apiDelete } from '../../lib/api.js'
import SilOnayModal from '../../components/SilOnayModal.jsx'

function AdminIlanlar() {
  const [ilanlar, setIlanlar] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState('')

  // null = dialog kapalı. Bir ilan nesnesi = o ilan için dialog açık.
  const [silinecek, setSilinecek] = useState(null)
  const [siliniyor, setSiliniyor] = useState(false)

  useEffect(() => {
    async function getir() {
      try {
        setIlanlar(await apiGet('/api/ilanlar'))
      } catch (e) {
        setHata('İlanlar yüklenemedi: ' + e.message)
      } finally {
        setYukleniyor(false)
      }
    }

    getir()
  }, [])

  async function sil() {
    const hedef = silinecek
    setSiliniyor(true)
    setHata('')

    try {
      await apiDelete(`/api/ilanlar/${hedef.id}`)
      // Listeyi yeniden çekmeden, state üzerinden güncelle.
      setIlanlar((onceki) => onceki.filter((i) => i.id !== hedef.id))
    } catch (e) {
      setHata('İlan silinemedi: ' + e.message)
    } finally {
      setSiliniyor(false)
      setSilinecek(null)
    }
  }

  const fiyatYaz = (deger) => new Intl.NumberFormat('tr-TR').format(deger)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold-600">
            Yönetim
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink-900">İlanlar</h1>
        </div>

        <Link
          to="/admin/ilanlar/yeni"
          className="bg-ink-900 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-white transition hover:bg-ink-800"
        >
          + Yeni İlan
        </Link>
      </div>

      {hata && (
        <p
          role="alert"
          className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {hata}
        </p>
      )}

      {yukleniyor && <p className="mt-8 text-sm text-ink-400">Yükleniyor…</p>}

      {!yukleniyor && ilanlar.length === 0 && (
        <p className="mt-8 border border-dashed border-ink-300 bg-white p-8 text-sm text-ink-500">
          Henüz ilan yok. “Yeni İlan” ile ilk ilanı ekleyin.
        </p>
      )}

      {!yukleniyor && ilanlar.length > 0 && (
        <div className="mt-8 overflow-x-auto border border-ink-200 bg-white">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink-200 text-[10px] uppercase tracking-[0.15em] text-ink-500">
                <th className="p-4 font-normal">Görsel</th>
                <th className="p-4 font-normal">Başlık</th>
                <th className="p-4 font-normal">Konum</th>
                <th className="p-4 font-normal">Fiyat</th>
                <th className="p-4 font-normal">Tip</th>
                <th className="p-4 text-right font-normal">İşlem</th>
              </tr>
            </thead>

            <tbody>
              {ilanlar.map((ilan) => (
                <tr
                  key={ilan.id}
                  className="border-b border-ink-100 last:border-b-0 hover:bg-ink-50"
                >
                  <td className="p-4">
                    <img
                      src={ilan.gorseller?.[0]}
                      alt=""
                      className="h-12 w-16 bg-ink-100 object-cover"
                    />
                  </td>

                  <td className="max-w-xs truncate p-4 text-ink-900">
                    {ilan.baslik}
                  </td>

                  <td className="p-4 text-sm text-ink-500">{ilan.konum}</td>

                  <td className="whitespace-nowrap p-4 text-ink-900">
                    {fiyatYaz(ilan.fiyat)} ₺
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-[10px] uppercase tracking-[0.15em] ${
                        ilan.tip === 'satilik'
                          ? 'bg-ink-900 text-white'
                          : 'bg-gold-500 text-ink-950'
                      }`}
                    >
                      {ilan.tip === 'satilik' ? 'Satılık' : 'Kiralık'}
                    </span>
                  </td>

                  <td className="whitespace-nowrap p-4 text-right">
                    <Link
                      to={`/admin/ilanlar/${ilan.id}`}
                      className="text-[11px] uppercase tracking-[0.15em] text-ink-600 hover:text-gold-700"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => setSilinecek(ilan)}
                      className="ml-5 text-[11px] uppercase tracking-[0.15em] text-red-700 hover:text-red-900"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {silinecek && (
        <SilOnayModal
          baslik="İlan silinsin mi?"
          ad={silinecek.baslik}
          calisiyor={siliniyor}
          onOnayla={sil}
          onVazgec={() => setSilinecek(null)}
        />
      )}
    </div>
  )
}

export default AdminIlanlar
