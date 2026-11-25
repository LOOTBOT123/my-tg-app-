import { useState } from "react"
import { GAMES } from "../data"
import { useMarket } from "../market"

const EMPTY = { title: "", game: "brawl", price: "", description: "" }

export default function Sell({ user, onPublished }) {
  const { addProduct } = useMarket()
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState("")

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setError("")
  }

  function submit(event) {
    event.preventDefault()
    const price = Number(form.price)
    if (form.title.trim().length < 3) {
      setError("Название должно быть не короче 3 символов")
      return
    }
    if (!Number.isFinite(price) || price <= 0) {
      setError("Укажите цену больше нуля")
      return
    }
    addProduct({ ...form, price }, user)
    setForm(EMPTY)
    onPublished()
  }

  return (
    <section className="px-4 pt-5">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8b7cff]">Новый лот</p>
      <h1 className="mt-1 text-[28px] font-extrabold leading-none tracking-tight">Продать</h1>
      <p className="mt-2 text-sm text-white/50">Лот сразу появится на витрине и в вашем профиле</p>

      <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-white/70">
          Название
          <input
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            placeholder="Например, 500 гемов"
            className="rounded-xl border border-white/10 bg-[#141822] px-3.5 py-3 text-base font-medium text-white outline-none placeholder:text-white/30 focus:border-[#8b7cff]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold text-white/70">
          Игра
          <select
            value={form.game}
            onChange={(event) => update("game", event.target.value)}
            className="rounded-xl border border-white/10 bg-[#141822] px-3.5 py-3 text-base font-medium text-white outline-none focus:border-[#8b7cff]"
          >
            {GAMES.map((game) => (
              <option key={game.id} value={game.id}>
                {game.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold text-white/70">
          Цена, ₽
          <input
            inputMode="numeric"
            value={form.price}
            onChange={(event) => update("price", event.target.value.replace(/[^\d]/g, ""))}
            placeholder="990"
            className="rounded-xl border border-white/10 bg-[#141822] px-3.5 py-3 text-base font-medium text-white outline-none placeholder:text-white/30 focus:border-[#8b7cff]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold text-white/70">
          Описание
          <textarea
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            rows={3}
            placeholder="Как передаёте товар"
            className="resize-none rounded-xl border border-white/10 bg-[#141822] px-3.5 py-3 text-base font-medium text-white outline-none placeholder:text-white/30 focus:border-[#8b7cff]"
          />
        </label>

        {error ? <p className="text-sm font-semibold text-rose-300">{error}</p> : null}

        <button
          type="submit"
          className="mt-1 rounded-xl bg-[#8b7cff] py-3.5 text-base font-bold text-white transition hover:bg-[#9d91ff] active:scale-[0.99]"
        >
          Выставить на продажу
        </button>
      </form>
    </section>
  )
}
