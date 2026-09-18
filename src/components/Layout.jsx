import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-gold-50">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-14 sm:py-24 lg:px-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Layout
