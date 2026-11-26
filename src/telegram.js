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
  let u = tg?.initDataUnsafe?.user

  // Запасной способ: достаем user напрямую из хэша ссылки Telegram
  if (!u && window.location.hash) {
    try {
      const hashParams = new URLSearchParams(window.location.hash.slice(1))
      const webAppData = hashParams.get("tgWebAppData")
      if (webAppData) {
        const dataParams = new URLSearchParams(webAppData)
        const userStr = dataParams.get("user")
        if (userStr) u = JSON.parse(userStr)
      }
    } catch (e) {
      console.warn("[NEXLOT] Hash parse error", e)
    }
  }

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
