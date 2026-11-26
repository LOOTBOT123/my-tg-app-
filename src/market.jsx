
import {
createContext,
useCallback,
useContext,
useEffect,
useRef,
useState,
} from "react"
import { supabase } from "./supabase"
import { getTelegramUser, initTelegram } from "./telegram"

const MarketContext = createContext(null)

export function MarketProvider({ children }) {
const [user, setUser] = useState(null)
const [items, setItems] = useState([])
const [loading, setLoading] = useState(true)
const [toast, setToast] = useState(null)
const toastTimer = useRef(null)

const showToast = useCallback((message, tone = "good") => {
setToast({ message, tone })
if (toastTimer.current) clearTimeout(toastTimer.current)
toastTimer.current = setTimeout(() => setToast(null), 10000)
}, [])

const dismissToast = useCallback(() => {
if (toastTimer.current) clearTimeout(toastTimer.current)
setToast(null)
}, [])

const ensureUser = useCallback(async (tgUser) => {
if (!tgUser) return null
try {
const { data: existing, error: selErr } = await supabase
.from("users")
.select("*")
.eq("id", tgUser.id)
.maybeSingle()

  if (selErr) {
    showToast("БД select: " + JSON.stringify(selErr), "bad")
    return {
      id: tgUser.id,
      username: tgUser.username,
      first_name: tgUser.firstName,
      last_name: tgUser.lastName,
      photo_url: tgUser.photoUrl,
      balance: 0,
    }
  }

  if (existing) return existing

  const { data: created, error: insErr } = await supabase
    .from("users")
    .insert({
      id: tgUser.id,
      username: tgUser.username,
      first_name: tgUser.firstName,
      last_name: tgUser.lastName,
      photo_url: tgUser.photoUrl,
      balance: 0,
    })
    .select()
    .single()

  if (insErr) {
    showToast("БД insert: " + JSON.stringify(insErr), "bad")
    return {
      id: tgUser.id,
      username: tgUser.username,
      first_name: tgUser.firstName,
      last_name: tgUser.lastName,
      photo_url: tgUser.photoUrl,
      balance: 0,
    }
  }
  return created
} catch (err) {
  showToast("Сеть БД: " + (err?.message || String(err)), "bad")
  return {
    id: tgUser.id,
    username: tgUser.username,
    first_name: tgUser.firstName,
    last_name: tgUser.lastName,
    photo_url: tgUser.photoUrl,
    balance: 0,
  }
}
}, [showToast])

const loadItems = useCallback(async () => {
try {
const { data, error } = await supabase
.from("items")
.select(
"id, seller_id, seller_username, game, title, price, description, status, created_at"
)
.eq("status", "active")
.order("created_at", { ascending: false })
if (error) {
showToast("Лоты БД: " + JSON.stringify(error), "bad")
return
}
setItems(data || [])
} catch (err) {
showToast("Сеть лоты: " + (err?.message || String(err)), "bad")
}
}, [showToast])

useEffect(() => {
let cancelled = false
initTelegram()

const boot = async () => {
  try {
    let tgUser = getTelegramUser()
    for (let i = 0; i < 8 && !tgUser; i++) {
      await new Promise((r) => setTimeout(r, 200))
      tgUser = getTelegramUser()
    }
    if (!tgUser) {
      showToast("Telegram не передал ID пользователя", "bad")
    }
    const u = await ensureUser(tgUser)
    if (cancelled) return
    setUser(u)
    await loadItems()
  } catch (e) {
    showToast("Запуск: " + (e?.message || String(e)), "bad")
  } finally {
    if (!cancelled) setLoading(false)
  }
}

boot()
return () => {
  cancelled = true
}
}, [ensureUser, loadItems, showToast])

const createItem = useCallback(
async (payload) => {
if (!user) throw new Error("Откройте приложение через Telegram")
const title = (payload.title || "").trim()
if (!title) throw new Error("Укажите название лота")
const price = Number(payload.price)
if (!Number.isFinite(price) || price <= 0)
throw new Error("Некорректная цена")

  const { data, error } = await supabase
    .from("items")
    .insert({
      seller_id: user.id,
      seller_username: user.username,
      game: payload.game,
      title,
      price,
      description: payload.description?.trim() || null,
      autodelivery: payload.autodelivery?.trim() || null,
      status: "active",
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
