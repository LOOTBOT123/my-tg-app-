import { useState } from "react"
import ProductCard from "../components/ProductCard"
import { GAMES } from "../data"
import { useMarket } from "../market"

const FILTERS = [{ id: "all", label: "Все" }, ...GAMES.map((game) => ({ id: game.id, label: game.label }))]

export default function Showcase({ user }) {
  const { products, buyProduct } = useMarket()
  const [filter, setFilter] = useState("all")
  const visible = products.filter((product) => filter === "all" || product.game === filter)

  return (
    <section>
      <header className="px-4 pt-5">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8b7cff]">NexLot</p>
        <h1 className="mt-1 text-[28px] font-extrabold leading-none tracking-tight">Витрина</h1>
        <p className="mt-2 text-sm text-white/50">Игровая биржа: аккаунты, валюта и предметы</p>
      </header>

      <div className="mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {FILTERS.map((item) => {
          const active = filter === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                active ? "bg-white text-[#12131a]" : "bg-white/6 text-white/70"
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-col gap-3 px-4">
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center text-sm text-white/45">
            В этой игре пока нет лотов
          </div>
        ) : (
          visible.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isOwn={product.sellerId === user.id}
              onBuy={(id) => buyProduct(id, user.id)}
            />
          ))
        )}
      </div>
    </section>
  )
}
