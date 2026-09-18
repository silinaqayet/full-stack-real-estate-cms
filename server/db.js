import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL eksik. server/.env dosyasını doldurun.')
}

// Tüm uygulama tek bir havuzu paylaşır (varsayılan 10 bağlantı).
export const pool = new Pool({ connectionString: process.env.DATABASE_URL })
