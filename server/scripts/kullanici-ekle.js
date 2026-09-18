// Kullanım:
//   node scripts/kullanici-ekle.js ornek@site.com sifreniz
// Aynı e-posta ile tekrar çalıştırılırsa şifreyi günceller.
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { pool } from '../db.js'

const [email, sifre] = process.argv.slice(2)

if (!email || !sifre) {
  console.error('Kullanım: node scripts/kullanici-ekle.js <email> <sifre>')
  process.exit(1)
}

if (sifre.length < 8) {
  console.error('Şifre en az 8 karakter olmalı.')
  process.exit(1)
}

const hash = await bcrypt.hash(sifre, 12)

await pool.query(
  `insert into users (email, password_hash)
   values ($1, $2)
   on conflict (email) do update set password_hash = excluded.password_hash`,
  [email.toLowerCase().trim(), hash]
)

console.log(`Kullanıcı hazır: ${email.toLowerCase().trim()}`)
await pool.end()
