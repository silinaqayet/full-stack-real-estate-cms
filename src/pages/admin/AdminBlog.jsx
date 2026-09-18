import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiGet, apiDelete } from '../../lib/api.js'
import SilOnayModal from '../../components/SilOnayModal.jsx'

function AdminBlog() {
  const [yazilar, setYazilar] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState('')

  const [silinecek, setSilinecek] = useState(null)
  const [siliniyor, setSiliniyor] = useState(false)

  useEffect(() => {
    async function getir() {
      try {
        setYazilar(await apiGet('/api/blog'))
      } catch (e) {
        setHata('Yazılar yüklenemedi: ' + e.message)
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
      await apiDelete(`/api/blog/${hedef.id}`)
      setYazilar((onceki) => onceki.filter((y) => y.id !== hedef.id))
    } catch (e) {
      setHata('Yazı silinemedi: ' + e.message)
    } finally {
      setSiliniyor(false)
      setSilinecek(null)
    }
  }

  const tarihYaz = (deger) =>
    new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(deger))

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold-600">
            Yönetim
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink-900">Blog</h1>
        </div>

        <Link
          to="/admin/blog/yeni"
          className="bg-ink-900 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-white transition hover:bg-ink-800"
        >
          + Yeni Yazı
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

      {!yukleniyor && yazilar.length === 0 && (
        <p className="mt-8 border border-dashed border-ink-300 bg-white p-8 text-sm text-ink-500">
          Henüz yazı yok. “Yeni Yazı” ile ilk yazıyı ekleyin.
        </p>
      )}

      {!yukleniyor && yazilar.length > 0 && (
        <div className="mt-8 overflow-x-auto border border-ink-200 bg-white">
          <table className="w-full min-w-[38rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink-200 text-[10px] uppercase tracking-[0.15em] text-ink-500">
                <th className="p-4 font-normal">Görsel</th>
                <th className="p-4 font-normal">Başlık</th>
                <th className="p-4 font-normal">Tarih</th>
                <th className="p-4 text-right font-normal">İşlem</th>
              </tr>
            </thead>

            <tbody>
              {yazilar.map((yazi) => (
                <tr
                  key={yazi.id}
                  className="border-b border-ink-100 last:border-b-0 hover:bg-ink-50"
                >
                  <td className="p-4">
                    <img
                      src={yazi.image_url}
                      alt=""
                      className="h-12 w-16 bg-ink-100 object-cover"
                    />
                  </td>

                  <td className="max-w-md truncate p-4 text-ink-900">
                    {yazi.baslik}
                  </td>

                  <td className="whitespace-nowrap p-4 text-sm text-ink-500">
                    {tarihYaz(yazi.created_at)}
                  </td>

                  <td className="whitespace-nowrap p-4 text-right">
                    <Link
                      to={`/admin/blog/${yazi.id}`}
                      className="text-[11px] uppercase tracking-[0.15em] text-ink-600 hover:text-gold-700"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => setSilinecek(yazi)}
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
          baslik="Yazı silinsin mi?"
          ad={silinecek.baslik}
          calisiyor={siliniyor}
          onOnayla={sil}
          onVazgec={() => setSilinecek(null)}
        />
      )}
    </div>
  )
}

export default AdminBlog
