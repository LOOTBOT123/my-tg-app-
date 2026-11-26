import { useState } from "react"
import { useMarket } from "../market"

const GAMES = [
  "CS2", "Dota 2", "Valorant", "GTA V",
  "Minecraft", "Roblox", "Fortnite", "Free Fire",
]

export default function Sell({ onPublished }) {
  const { createItem, showToast, user } = useMarket()
  const [form, setForm] = useState({
    game: GAMES[0],
    title: "",
    price: "",
    description: "",
    autodelivery: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (submitting) return
    if (!user) return showToast("Откройте приложение через Telegram", "bad")
    if (!form.title.trim()) return showToast("Укажите название", "bad")
    const price = Number(form.price)
    if (!Number.isFinite(price) || price <= 0) return showToast("Некорректная цена", "bad")

    try {
      setSubmitting(true)
      await createItem(form)
      showToast("Лот опубликован")
      setForm({ game: GAMES[0], title: "", price: "", description: "", autodelivery: "" })
      onPublished?.()
    } catch (err) {
      showToast(err.message || "Ошибка публикации", "bad")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="px-4 pt-5">
      <h1 className="text-xl font-extrabold tracking-tight">Продать</h1>
      <p className="mt-1 text-sm text-white/50">Новый лот появится на витрине сразу</p>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <label className="block">
          <span className="text-xs text-white/50">Игра</span>
          <select
            value={form.game}
            onChange={set("game")}
            className="mt-1 w-full rounded-xl bg-white/5 px-3 py-3 text-sm ring-1 ring-white/10 outline-none"
          >
            {GAMES.map((g) => (
              <option key={g} value={g} className="bg-[#0f1220]">{g}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs text-white/50">Название</span>
          <input
            value={form.title}
            onChange={set("title")}
            maxLength={120}
            placeholder="Например: Аккаунт CS2 с Prime"
            className="mt-1 w-full rounded-xl bg-white/5 px-3 py-3 text-sm ring-1 ring-white/10 outline-none"
          />
        </label>

        <label className="block">
          <span className="text-xs text-white/50">Цена, USDT</span>
          <input
            value={form.price}
            onChange={set("price")}
            inputMode="decimal"
            placeholder="0.00"
            className="mt-1 w-full rounded-xl bg-white/5 px-3 py-3 text-sm ring-1 ring-white/10 outline-none"
          />
        </label>

        <label className="block">
          <span className="text-xs text-white/50">Описание</span>
          <textarea
            value={form.description}
            onChange={set("description")}
            rows={3}
            className="mt-1 w-full resize-none rounded-xl bg-white/5 px-3 py-3 text-sm ring-1 ring-white/10 outline-none"
          />
        </label>

        <label className="block">
          <span className="text-xs text-white/50">
            Данные автовыдачи (видны только покупателю после оплаты)
          </span>
          <textarea
            value={form.autodelivery}
            onChange={set("autodelivery")}
            rows={2}
            placeholder="Логин:пароль или код"
            className="mt-1 w-full resize-none rounded-xl bg-white/5 px-3 py-3 text-sm ring-1 ring-white/10 outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-[#3ee0b0] px-4 py-3.5 text-sm font-bold text-[#06281d] disabled:opacity-50"
        >
          {submitting ? "Публикуем…" : "Опубликовать лот"}
        </button>
      </form>
    </div>
  )
}
