import { formatPrice, gameById } from "../data"

export default function ProductCard({ product, isOwn, onBuy }) {
  const game = gameById(product.game)

  return (
    <article className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#141822] p-4">
      <div className={`pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${game.glow} to-transparent blur-2xl`} />
      <div className="relative flex items-start justify-between gap-3">
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${game.chip}`}>
          {game.label}
        </span>
        <span className="text-lg font-extrabold text-[#3ee0b0]">{formatPrice(product.price)}</span>
      </div>
      <h3 className="relative mt-3 text-[17px] font-bold leading-tight">{product.title}</h3>
      {product.description ? (
        <p className="relative mt-1.5 text-sm leading-snug text-white/55">{product.description}</p>
      ) : null}
      <div className="relative mt-4 flex items-center justify-between gap-3">
        <p className="truncate text-xs text-white/40">Продавец · {product.sellerName}</p>
        <button
          type="button"
          disabled={isOwn}
          onClick={() => onBuy(product.id)}
          className="shrink-0 rounded-xl bg-[#8b7cff] px-3.5 py-2 text-sm font-bold text-white transition enabled:hover:bg-[#9d91ff] enabled:active:scale-[0.98] disabled:cursor-default disabled:bg-white/10 disabled:text-white/45"
        >
          {isOwn ? "Ваш лот" : "Купить"}
        </button>
      </div>
    </article>
  )
}
