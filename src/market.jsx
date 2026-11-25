import { createContext, useContext, useMemo, useState } from "react"
import { SEED_PRODUCTS, STARTING_BALANCE } from "./data"
import { haptic } from "./telegram"

const STORAGE_KEY = "nexlot-market-v1"
const MarketContext = createContext(null)

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.products) || typeof parsed.balance !== "number") {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function persist(products, balance) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ products, balance }))
}

export function MarketProvider({ children }) {
  const saved = useMemo(() => loadSaved(), [])
  const [products, setProducts] = useState(saved?.products ?? SEED_PRODUCTS)
  const [balance, setBalance] = useState(saved?.balance ?? STARTING_BALANCE)
  const [toast, setToast] = useState(null)

  function notify(message, tone = "ok") {
    setToast({ id: Date.now(), message, tone })
    haptic(tone === "ok" ? "success" : "error")
    window.setTimeout(() => {
      setToast((current) => (current && current.message === message ? null : current))
    }, 2400)
  }

  function update(nextProducts, nextBalance) {
    setProducts(nextProducts)
    setBalance(nextBalance)
    persist(nextProducts, nextBalance)
  }

  function addProduct(draft, seller) {
    const product = {
      id: crypto.randomUUID(),
      title: draft.title.trim(),
      game: draft.game,
      price: Number(draft.price),
      description: draft.description.trim(),
      sellerId: seller.id,
      sellerName: seller.name,
    }
    const next = [product, ...products]
    update(next, balance)
    notify("Лот опубликован")
    return product
  }

  function buyProduct(productId, buyerId) {
    const product = products.find((item) => item.id === productId)
    if (!product) return { ok: false }
    if (product.sellerId === buyerId) {
      notify("Это ваш лот", "bad")
      return { ok: false }
    }
    if (balance < product.price) {
      notify("Недостаточно средств", "bad")
      return { ok: false }
    }
    update(
      products.filter((item) => item.id !== productId),
      balance - product.price,
    )
    notify(`Куплено: ${product.title}`)
    return { ok: true }
  }

  function removeProduct(productId, sellerId) {
    const product = products.find((item) => item.id === productId)
    if (!product || product.sellerId !== sellerId) return
    update(
      products.filter((item) => item.id !== productId),
      balance,
    )
    notify("Лот снят с продажи")
  }

  const value = {
    products,
    balance,
    toast,
    dismissToast: () => setToast(null),
    addProduct,
    buyProduct,
    removeProduct,
  }

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
}

export function useMarket() {
  const context = useContext(MarketContext)
  if (!context) throw new Error("useMarket must be used within MarketProvider")
  return context
}
