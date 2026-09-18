function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-gold-300 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center lg:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center border border-gold-400 font-display text-lg text-gold-600">
            S
          </span>
          <span className="font-display text-xl text-ink-900">
            Sky Gayrimenkul
          </span>
        </div>

        <span className="h-px w-16 bg-gold-300" />

        <p className="text-xs uppercase tracking-[0.15em] text-ink-400">
          © {year} Sky Gayrimenkul — Tüm hakları saklıdır
        </p>
      </div>
    </footer>
  )
}

export default Footer
