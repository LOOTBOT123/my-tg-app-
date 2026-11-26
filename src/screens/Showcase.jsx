import { useState } from "react"
import { useMarket } from "../market"
import { openTelegramLink } from "../telegram"

export default function Showcase() {
  const { items, loading, buyItem, showToast, user } = useMarket()
  const [selected, setSelected] = useState(null)
  const [busy, setBusy] = useState(false)

  const handleWrite = (username) => {
    if (!username) return showToast("У продавца нет username", "bad")
    openTelegramLink(`https://t.me/${username}`)
  }

  const handleBuy = async () => {
    if (!selected || busy) return
    try {
      setBusy(true)
      await buyItem(selected)
      showToast("Заказ создан — свяжитесь с продавцом")
      setSelected(null)
    } catch (e) {
      showToast(e.message || "Ошибка заказа", "bad")
    } finally {
      setBusy(false)
    }
  }

  const isOwn = selected && user && selected.seller_id === user.id

  return (
    <div className="px-4 pt-5">
      <h1 className="text-xl font-extrabold tracking-tight">Витрина</h1>
      <p className="mt-1 text-sm text-white/50">Игровые лоты от игроков</p>

      {loading ? (
        <div className="mt-6 text-sm text-white/50">Загружаем лоты…</div>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white/5 p-4 text-sm text-white/60">
          Пока пусто. Зайдите в «Продать», чтобы выставить первый лот.
        </div>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3">
          {items.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => setSelected(it)}
                className="w-full rounded-2xl bg-white/5 p-3 text-left ring-1 ring-white/5 transition active:scale-[0.99]"
              >
                <div className="text-[11px] uppercase tracking-wide text-[#8b7cff]">
                  {it.game}
                </div>
                <div className="mt-1 line-clamp-2 text-sm font-bold">{it.title}</div>
                <div className="mt-2 text-base font-extrabold text-[#3ee0b0]">
                  {Number(it.price).toFixed(2)} USDT
                </div>
                <div className="mt-1 truncate text-[11px] text-white/40">
                  @{it.seller_username || "—"}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-3"
          onClick={() => !busy && setSelected(null)}
        >
          <div
            className="w-full max-w-[440px] rounded-3xl bg-[#0f1220] p-5 ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[11px] uppercase tracking-wide text-[#8b7cff]">
              {selected.game}
            </div>
            <div className="mt-1 text-lg font-extrabold">{selected.title}</div>
            <div className="mt-1 text-2xl font-extrabold text-[#3ee0b0]">
              {Number(selected.price).toFixed(2)} USDT
            </div>

            {selected.description ? (
              <p className="mt-3 whitespace-pre-wrap break-words text-sm text-white/70">
                {selected.description}
              </p>
            ) : null}

            <div className="mt-2 truncate text-[12px] text-white/40">
              Продавец: @{selected.seller_username || "—"}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => handleWrite(selected.seller_username)}
                className="flex-1 rounded-xl bg-white/10 px-3 py-3 text-sm font-bold"
              >
                Написать
              </button>
              <button
                type="button"
                onClick={handleBuy}
                disabled={busy || isOwn || !user}
                className="flex-1 rounded-xl bg-[#3ee0b0] px-3 py-3 text-sm font-bold text-[#06281d] disabled:opacity-40"
              >
                {busy ? "…" : isOwn ? "Ваш лот" : "Купить"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => !busy && setSelected(null)}
              className="mt-2 w-full rounded-xl px-3 py-2 text-xs text-white/50"
            >
              Закрыть
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
