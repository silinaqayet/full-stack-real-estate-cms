import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { apiPost } from '../lib/api.js'

function Login() {
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [hata, setHata] = useState('')
  const [gonderiliyor, setGonderiliyor] = useState(false)

  const navigate = useNavigate()
  const konum = useLocation()
  const hedef = konum.state?.from || '/admin'

  async function gonder(olay) {
    olay.preventDefault()
    setHata('')

    if (!email.trim() || !sifre) {
      setHata('E-posta ve şifre alanları boş bırakılamaz.')
      return
    }

    setGonderiliyor(true)

    try {
      // Sunucu Set-Cookie ile oturum çerezini yollar; ayrıca saklanacak bir şey yok.
      await apiPost('/api/auth/login', { email: email.trim(), sifre })
      navigate(hedef, { replace: true })
    } catch (e) {
      // Backend zaten Türkçe mesaj döndürüyor.
      setHata(e.message)
      setGonderiliyor(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink-950 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center border border-gold-500 font-display text-2xl text-gold-400">
            S
          </span>
          <h1 className="mt-6 font-display text-3xl text-white">
            Yönetim Paneli
          </h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-ink-400">
            Sky Gayrimenkul
          </p>
        </div>

        <form onSubmit={gonder} noValidate className="mt-10 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] uppercase tracking-[0.2em] text-ink-400"
            >
              E-posta
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="mt-2 w-full border border-ink-700 bg-ink-900 px-4 py-3 text-white placeholder-ink-500 focus:border-gold-500 focus:outline-none"
              placeholder="ornek@site.com"
            />
          </div>

          <div>
            <label
              htmlFor="sifre"
              className="block text-[11px] uppercase tracking-[0.2em] text-ink-400"
            >
              Şifre
            </label>
            <input
              id="sifre"
              type="password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              autoComplete="current-password"
              className="mt-2 w-full border border-ink-700 bg-ink-900 px-4 py-3 text-white placeholder-ink-500 focus:border-gold-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {hata && (
            <p
              role="alert"
              className="border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300"
            >
              {hata}
            </p>
          )}

          <button
            type="submit"
            disabled={gonderiliyor}
            className="w-full bg-gold-500 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-ink-950 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {gonderiliyor ? 'Giriş yapılıyor…' : 'Giriş yap'}
          </button>
        </form>

        <p className="mt-8 text-center">
          <Link
            to="/"
            className="text-[11px] uppercase tracking-[0.2em] text-ink-500 hover:text-gold-400"
          >
            ← Siteye dön
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
