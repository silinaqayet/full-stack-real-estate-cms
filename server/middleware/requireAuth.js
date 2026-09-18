// Oturum yoksa isteği burada kes. Adım 7'de yazma route'larına takılacak.
export function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Bu işlem için giriş yapmalısınız.' })
  }

  next()
}
