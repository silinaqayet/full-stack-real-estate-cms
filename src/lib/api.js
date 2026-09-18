// Dev'de VITE_API_URL=http://localhost:3000
// Prod'da boş bırakılırsa yollar aynı sunucuya göreli gider.
const TABAN = import.meta.env.VITE_API_URL ?? ''

async function istek(yol, secenekler = {}) {
  const res = await fetch(`${TABAN}${yol}`, {
    // Oturum çerezi farklı porta da gitsin diye şart.
    credentials: 'include',
    ...secenekler,
  })

  // DİKKAT: fetch 404/500'de hata fırlatmaz. Elle kontrol şart.
  if (!res.ok) {
    // Oturum düşmüşse girişe at. /api/auth/* hariç: login'in kendi 401'i
    // "şifre yanlış" demektir, formda gösterilmeli.
    if (res.status === 401 && !yol.startsWith('/api/auth/')) {
      window.location.href = '/login'
    }

    let mesaj = `İstek başarısız (${res.status})`

    try {
      const govde = await res.json()
      if (govde?.error) mesaj = govde.error
    } catch {
      // Gövde JSON değilse varsayılan mesajla devam et.
    }

    const hata = new Error(mesaj)
    hata.status = res.status
    throw hata
  }

  return res.json()
}

export function apiGet(yol) {
  return istek(yol)
}

function govdeliIstek(yontem) {
  return (yol, govde) =>
    istek(yol, {
      method: yontem,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(govde ?? {}),
    })
}

export const apiPost = govdeliIstek('POST')
export const apiPut = govdeliIstek('PUT')

export function apiDelete(yol) {
  return istek(yol, { method: 'DELETE' })
}

// FormData için Content-Type ELLE AYARLANMAZ; tarayıcı multipart
// sınırlayıcısını (boundary) kendisi eklemek zorundadır.
export function apiUpload(yol, formData) {
  return istek(yol, { method: 'POST', body: formData })
}
