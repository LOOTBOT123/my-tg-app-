const tabs = [
  { id: "showcase", label: "Витрина", icon: "🛒" },
  { id: "sell",     label: "Продать", icon: "➕" },
  { id: "profile",  label: "Профиль", icon: "👤" },
]

export default function BottomNav({ tab, onChange }) {
  return (
    <nav
      className="fixed inset-x-0 z-50 mx-auto w-full max-w-[440px] px-3"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 28px)" }}
    >
      <div className="flex items-center justify-around rounded-2xl bg-[#10131c]/95 px-2 py-2 shadow-2xl ring-1 ring-white/10 backdrop-blur">
        {tabs.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-xs font-semibold transition-colors ${
                active ? "text-[#8b7cff]" : "text-white/55 hover:text-white/80"
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              {t.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
