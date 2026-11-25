import { formatPrice, gameById } from "../data"
import { useMarket } from "../market"

export default function Profile({ user }) {
  const { products, balance, removeProduct } = useMarket()
  const mine = products.filter((product) => product.sellerId === user.id)
  const initial = user.name.slice(0, 1).toUpperCase()

  return (
    <section className="px-4 pt-5">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8b7cff]">Аккаунт</p>
      <h1 className="mt-1 text-[28px] font-extrabold leading-none tracking-tight">Профиль</h1>

      <div className="mt-5 flex items-center gap-3.5 rounded-2xl border border-white/8 bg-[#141822] p-4">
        {user.photoUrl ? (
          <img
            src={user.photoUrl}
            alt=""
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#8b7cff] to-[#3ee0b0] text-xl font-extrabold text-[#101218]">
            {initial}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-lg font-extrabold">{user.name}</p>
          <p className="truncate text-sm text-white/45">
            {user.username || "Telegram"}
            {user.isGuest ? " · откройте в Telegram" : ""}
          </p>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#2a2458] via-[#1a1e2e] to-[#12352d] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Баланс</p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight">{formatPrice(balance)}</p>
        <p className="mt-1 text-sm text-white/50">Списывается при покупке на витрине</p>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <h2 className="text-lg font-extrabold">Мои товары</h2>
        <span className="text-sm text-white/40">{mine.length}</span>
      </div>

      <div className="mt-3 flex flex-col gap-2.5">
        {mine.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 px-4 py-8 text-center text-sm text-white/45">
            Вы ещё ничего не продаёте. Добавьте лот на вкладке «Продать».
          </div>
        ) : (
          mine.map((product) => {
            const game = gameById(product.game)
            return (
              <article
                key={product.id}
                className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#141822] px-3.5 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${game.chip}`}>
                    {game.label}
                  </p>
                  <p className="mt-1 truncate font-bold">{product.title}</p>
                  <p className="text-sm font-semibold text-[#3ee0b0]">{formatPrice(product.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeProduct(product.id, user.id)}
                  className="shrink-0 rounded-xl bg-white/8 px-3 py-2 text-xs font-bold text-white/70"
                >
                  Снять
                </button>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}
