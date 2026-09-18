import { NavLink, Link } from 'react-router-dom'

const navLinks = [
  { path: '/', label: 'Anasayfa' },
  { path: '/ilanlar', label: 'İlanlar' },
  { path: '/blog', label: 'Blog' },
  { path: '/hakkimizda', label: 'Hakkımızda' },
  { path: '/hizmetlerimiz', label: 'Hizmetlerimiz' },
  { path: '/iletisim', label: 'İletişim' },
]

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:h-20 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-0 lg:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-gold-400 font-display text-xl text-gold-600">
            S
          </span>
          <span className="leading-none">
            <span className="block font-display text-2xl text-ink-900">Sky</span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.25em] text-ink-400">
              Gayrimenkul
            </span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.15em] lg:gap-x-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `border-b pb-1 ${
                  isActive
                    ? 'border-gold-500 text-gold-700'
                    : 'border-transparent text-ink-600 hover:border-gold-300 hover:text-gold-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
