import WebApp from "@twa-dev/sdk"

export function initTelegram() {
  const call = (fn) => {
    try {
      fn()
    } catch {
      // Вне Telegram часть методов недоступна — приложение остаётся рабочим в браузере.
    }
  }
  call(() => WebApp.ready())
  call(() => WebApp.expand())
  call(() => WebApp.setHeaderColor("#07080d"))
  call(() => WebApp.setBackgroundColor("#07080d"))
}

export function getTelegramUser() {
  const user = WebApp.initDataUnsafe?.user
  if (user?.id) {
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ")
    return {
      id: String(user.id),
      name: name || "Пользователь",
      username: user.username ? `@${user.username}` : "",
      photoUrl: user.photo_url || "",
      isGuest: false,
    }
  }

  return {
    id: "guest",
    name: "Гость",
    username: "@guest",
    photoUrl: "",
    isGuest: true,
  }
}

export function haptic(type) {
  try {
    WebApp.HapticFeedback?.notificationOccurred(type)
  } catch {
    // ignore
  }
}
