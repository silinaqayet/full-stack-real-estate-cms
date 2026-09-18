# Full-Stack Real Estate CMS

A full-stack real estate website and content management system built with **React, Express, and PostgreSQL**.

## Tech Stack
- React
- Vite
- Tailwind CSS
- Node.js
- Express
- PostgreSQL
- REST API
- bcrypt
- express-session
- Multer

## Features
- Property listing and detail pages
- Multi-image galleries
- Blog management
- Contact/settings management
- Admin authentication
- Protected admin routes
- Property CRUD
- Blog CRUD
- Image uploads with file type and size validation
- PostgreSQL-backed sessions

## Architecture
```
React Frontend
      ↓
REST API
      ↓
Express Backend
      ↓
PostgreSQL
```

## Setup
Create a frontend `.env` from `.env.example` and a backend `server/.env` from `server/.env.example`.

Backend variables:
```
DATABASE_URL
PORT
CLIENT_URL
SESSION_SECRET
```

Frontend:
```bash
npm install
npm run dev
```

Backend:
```bash
cd server
npm install
npm run dev
```

A local PostgreSQL database is required.

## Security
- Passwords are hashed with bcrypt
- Admin routes require authenticated sessions
- Sessions are stored in PostgreSQL
- Secrets are stored in environment variables
- Uploaded files are restricted by type, size, and count

## Purpose
Built during a software engineering internship to demonstrate full-stack development, REST API design, database integration, authentication, CMS functionality, and file upload handling.

## Author
**Silina Qayet**
