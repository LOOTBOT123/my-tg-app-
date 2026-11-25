const TABS = [
  {
    id: "showcase",
    label: "Витрина",
    icon: (
      <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
    ),
  },
  {
    id: "sell",
    label: "Продать",
    icon: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
  },
  {
    id: "profile",
    label: "Профиль",
    icon: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 19.2c1.4-2.8 3.7-4.2 6.5-4.2s5.1 1.4 6.5 4.2" />
      </>
    ),
  },
]

export default function BottomNav({ tab, onChange }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[440px] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-3 rounded-2xl border border-white/10 bg-[#10131acc] p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        {TABS.map((item) => {
          const active = tab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold tracking-wide transition ${
                active ? "bg-white text-[#12131a]" : "text-white/55 hover:text-white"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {item.icon}
              </svg>
              {item.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
