import WebApp from '@twa-dev/sdk'

export function initTelegram() {
  const tg = window?.Telegram?.WebApp || WebApp
  if (!tg) return
  try {
    tg.ready()
    tg.expand()
    tg.setHeaderColor?.("#07080d")
    tg.setBackgroundColor?.("#07080d")
  } catch (e) {
    console.warn("[NEXLOT] Telegram init warning", e)
  }
}

export function getTelegramUser() {
  const tg = window?.Telegram?.WebApp || WebApp
  const u = tg?.initDataUnsafe?.user
  if (!u || typeof u.id !== "number") return null
  return {
    id: u.id,
    username: u.username || null,
    firstName: u.first_name || "",
    lastName: u.last_name || "",
    photoUrl: u.photo_url || null,
  }
}

export function openTelegramLink(url) {
  const tg = window?.Telegram?.WebApp || WebApp
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(url)
  } else {
    window.open(url, "_blank", "noopener,noreferrer")
  }
}
