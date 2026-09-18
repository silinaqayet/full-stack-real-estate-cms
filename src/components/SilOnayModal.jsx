// İlan ve blog listelerinin ikisi de bunu kullanır.
function SilOnayModal({ baslik, ad, calisiyor, onOnayla, onVazgec }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md border border-ink-200 bg-white p-8"
      >
        <h2 className="font-display text-2xl text-ink-900">{baslik}</h2>

        <p className="mt-4 text-sm leading-relaxed text-ink-500">
          <strong className="text-ink-900">{ad}</strong> kalıcı olarak
          silinecek. Bu işlem geri alınamaz.
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onVazgec}
            disabled={calisiyor}
            className="border border-ink-300 px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] text-ink-600 hover:bg-ink-50 disabled:opacity-50"
          >
            Vazgeç
          </button>

          <button
            onClick={onOnayla}
            disabled={calisiyor}
            className="bg-red-700 px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] text-white hover:bg-red-800 disabled:opacity-50"
          >
            {calisiyor ? 'Siliniyor…' : 'Evet, sil'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SilOnayModal
