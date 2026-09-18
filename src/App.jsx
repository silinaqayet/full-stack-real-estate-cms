import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Anasayfa from './pages/Anasayfa.jsx'
import Ilanlar from './pages/Ilanlar.jsx'
import IlanDetay from './pages/IlanDetay.jsx'
import Blog from './pages/Blog.jsx'
import BlogDetay from './pages/BlogDetay.jsx'
import Hakkimizda from './pages/Hakkimizda.jsx'
import Hizmetlerimiz from './pages/Hizmetlerimiz.jsx'
import Iletisim from './pages/Iletisim.jsx'
import Login from './pages/Login.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminIlanlar from './pages/admin/AdminIlanlar.jsx'
import AdminIlanForm from './pages/admin/AdminIlanForm.jsx'
import AdminBlog from './pages/admin/AdminBlog.jsx'
import AdminBlogForm from './pages/admin/AdminBlogForm.jsx'
import AdminIletisim from './pages/admin/AdminIletisim.jsx'

function App() {
  return (
    <Routes>
      {/* Public pages: all share Header + Footer via Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Anasayfa />} />
        <Route path="/ilanlar" element={<Ilanlar />} />
        <Route path="/ilanlar/:id" element={<IlanDetay />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetay />} />
        <Route path="/hakkimizda" element={<Hakkimizda />} />
        <Route path="/hizmetlerimiz" element={<Hizmetlerimiz />} />
        <Route path="/iletisim" element={<Iletisim />} />
      </Route>

      {/* No public layout — login has its own full-screen design */}
      <Route path="/login" element={<Login />} />

      {/* Admin: ProtectedRoute is the gate, AdminLayout is the shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/ilanlar" element={<AdminIlanlar />} />
          {/* "yeni" statik olduğu için ":id"den önce eşleşir */}
          <Route path="/admin/ilanlar/yeni" element={<AdminIlanForm />} />
          <Route path="/admin/ilanlar/:id" element={<AdminIlanForm />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/blog/yeni" element={<AdminBlogForm />} />
          <Route path="/admin/blog/:id" element={<AdminBlogForm />} />
          <Route path="/admin/iletisim" element={<AdminIletisim />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
