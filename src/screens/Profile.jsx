import { useMarket } from "../market"

export default function Profile() {
  const { user } = useMarket()

  if (!user) {
    return (
      <div className="px-4 pt-5 text-sm text-white/60">
        Откройте приложение через Telegram — тогда создастся профиль.
      </div>
    )
  }

  const fullName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || "Игрок"

  return (
    <div className="px-4 pt-5">
      <h1 className="text-xl font-extrabold tracking-tight">Профиль</h1>

      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/5">
        {user.photo_url ? (
          <img
            src={user.photo_url}
            alt=""
            className="h-12 w-12 rounded-full object-cover"
            onError={(e) => { e.currentTarget.style.display = "none" }}
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-[#8b7cff]/30" />
        )}
        <div className="min-w-0">
          <div className="truncate text-sm font-bold">{fullName}</div>
          <div className="truncate text-xs text-white/50">
            @{user.username || "—"}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/5">
        <div className="text-xs text-white/50">Баланс</div>
        <div className="text-2xl font-extrabold text-[#3ee0b0]">
          {Number(user.balance || 0).toFixed(2)} USDT
        </div>
      </div>
    </div>
  )
}
