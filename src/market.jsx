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
toastTimer.current = setTimeout(() => setToast(null), 3500)
}, [])

const dismissToast = useCallback(() => {
if (toastTimer.current) clearTimeout(toastTimer.current)
setToast(null)
}, [])

const ensureUser = useCallback(async (tgUser) => {
if (!tgUser) return null
const { data: existing, error: selErr } = await supabase
.from("users")
.select("*")
.eq("id", tgUser.id)
.maybeSingle()
if (selErr) {
console.error("[users.select]", selErr)
return null
}

if (existing) {
  const patch = {}
  if (existing.username !== tgUser.username) patch.username = tgUser.username
  if (existing.first_name !== tgUser.firstName) patch.first_name = tgUser.firstName
  if (existing.last_name !== tgUser.lastName) patch.last_name = tgUser.lastName
  if (existing.photo_url !== tgUser.photoUrl) patch.photo_url = tgUser.photoUrl
  if (Object.keys(patch).length) {
    const { data: updated, error: upErr } = await supabase
      .from("users")
      .update(patch)
      .eq("id", tgUser.id)
      .select()
      .single()
    if (upErr) console.error("[users.update]", upErr)
    return updated || existing
  }
  return existing
}

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
  console.error("[users.insert]", insErr)
  return null
}
return created
}, [])

const loadItems = useCallback(async () => {
const { data, error } = await supabase
.from("items")
.select(
"id, seller_id, seller_username, game, title, price, description, status, created_at"
)
.eq("status", "active")
.order("created_at", { ascending: false })
if (error) {
console.error("[items.select]", error)
return
}
setItems(data || [])
}, [])

useEffect(() => {
let cancelled = false
initTelegram()

const boot = async () => {
  try {
    let tgUser = getTelegramUser()
    // Ждем до 2 секунд, если Telegram еще не успел передать initData
    for (let i = 0; i < 10 && !tgUser; i++) {
      await new Promise((r) => setTimeout(r, 200))
      tgUser = getTelegramUser()
    }
    const u = await ensureUser(tgUser)
    if (cancelled) return
    setUser(u)
    await loadItems()
  } catch (e) {
    console.error("[boot]", e)
  } finally {
    if (!cancelled) setLoading(false)
  }
}

boot()
return () => {
  cancelled = true
}
}, [ensureUser, loadItems])

useEffect(() => {
const channel = supabase
.channel("nexlot-items")
.on(
"postgres_changes",
{ event: "*", schema: "public", table: "items" },
() => {
loadItems()
}
)
.subscribe()
return () => {
supabase.removeChannel(channel)
}
}, [loadItems])

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
  setItems((prev) => [data, ...prev])
  showToast("Лот опубликован!")
  return data
},
[user, showToast]
)

return (
<MarketContext.Provider
value={{
user,
items,
loading,
toast,
showToast,
dismissToast,
createItem,
loadItems,
}}
>
{children}
</MarketContext.Provider>
)
}

export function useMarket() {
const ctx = useContext(MarketContext)
if (!ctx) throw new Error("useMarket must be used inside MarketProvider")
return ctx
}
