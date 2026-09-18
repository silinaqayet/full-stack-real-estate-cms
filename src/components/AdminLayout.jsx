import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { apiGet, apiPost } from '../lib/api.js'

const adminLinkleri = [
  { path: '/admin', label: 'Panel', end: true },
  { path: '/admin/ilanlar', label: 'İlanlar' },
  { path: '/admin/blog', label: 'Blog' },
  { path: '/admin/iletisim', label: 'İletişim' },
]

function AdminLayout() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    apiGet('/api/auth/me')
      .then((kullanici) => setEmail(kullanici.email))
      .catch(() => setEmail(''))
  }, [])

  async function cikisYap() {
    try {
      await apiPost('/api/auth/logout')
    } catch {
      // Sunucuya ulaşılamasa da kullanıcıyı panelden çıkar.
    }

    // onAuthStateChange yok: yönlendirmeyi elle yapıyoruz.
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink-50 lg:flex-row">
      <aside className="flex flex-col border-b border-ink-800 bg-ink-950 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 border-b border-ink-800 px-6 py-5">
          <span className="grid h-9 w-9 place-items-center border border-gold-500 font-display text-lg text-gold-400">
            S
          </span>
          <span className="leading-none">
            <span className="block font-display text-xl text-white">Sky</span>
            <span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-ink-500">
              Yönetim
            </span>
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {adminLinkleri.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `border-l-2 px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] transition ${
                  isActive
                    ? 'border-gold-500 bg-ink-900 text-gold-400'
                    : 'border-transparent text-ink-400 hover:bg-ink-900 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-800 p-4">
          <p className="truncate px-4 text-[11px] text-ink-500" title={email}>
            {email}
          </p>

          <button
            onClick={cikisYap}
            className="mt-3 w-full border border-ink-700 px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] text-ink-300 transition hover:border-gold-500 hover:text-gold-400"
          >
            Çıkış yap
          </button>

          <Link
            to="/"
            className="mt-2 block px-4 py-2 text-center text-[10px] uppercase tracking-[0.15em] text-ink-600 hover:text-ink-400"
          >
            Siteyi görüntüle ↗
          </Link>
        </div>
      </aside>

      <main className="flex-1 px-6 py-8 sm:px-10 sm:py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
