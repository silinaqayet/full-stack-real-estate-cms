import { useState, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { apiGet } from '../lib/api.js'

function ProtectedRoute() {
  const [kullanici, setKullanici] = useState(null)
  const [kontrolEdiliyor, setKontrolEdiliyor] = useState(true)
  const konum = useLocation()

  useEffect(() => {
    // Çerezi tarayıcı otomatik gönderir; sunucuya "ben kimim" diye soruyoruz.
    async function kontrolEt() {
      try {
        setKullanici(await apiGet('/api/auth/me'))
      } catch {
        setKullanici(null) // 401 = giriş yapılmamış
      } finally {
        setKontrolEdiliyor(false)
      }
    }

    kontrolEt()
  }, [])

  if (kontrolEdiliyor) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-50">
        <p className="text-sm uppercase tracking-[0.2em] text-ink-400">
          Yükleniyor…
        </p>
      </div>
    )
  }

  if (!kullanici) {
    return <Navigate to="/login" replace state={{ from: konum.pathname }} />
  }

  return <Outlet />
}

export default ProtectedRoute
