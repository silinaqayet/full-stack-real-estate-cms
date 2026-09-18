import { Link } from 'react-router-dom'

const bolumler = [
  { path: '/admin/ilanlar', label: 'İlanlar', aciklama: 'Portföyü yönet' },
  { path: '/admin/blog', label: 'Blog', aciklama: 'Yazıları yönet' },
  {
    path: '/admin/iletisim',
    label: 'İletişim',
    aciklama: 'Telefon, e-posta, adres',
  },
]

function AdminDashboard() {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-gold-600">
        Genel Bakış
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink-900">Panel</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bolumler.map((bolum) => (
          <Link
            key={bolum.path}
            to={bolum.path}
            className="border border-ink-200 bg-white p-6 transition hover:border-gold-400"
          >
            <h2 className="font-display text-xl text-ink-900">{bolum.label}</h2>
            <p className="mt-1 text-sm text-ink-500">{bolum.aciklama}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
