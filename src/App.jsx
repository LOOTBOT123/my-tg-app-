import { useEffect, useState } from "react"
import BottomNav from "./components/BottomNav"
import { MarketProvider, useMarket } from "./market"
import Profile from "./screens/Profile"
import Sell from "./screens/Sell"
import Showcase from "./screens/Showcase"
import { initTelegram } from "./telegram"

function Shell() {
  const [tab, setTab] = useState("showcase")
  const { toast, dismissToast, loading } = useMarket()

  useEffect(() => {
    initTelegram()
  }, [])

  return (
    <div className="min-h-dvh bg-[#07080d] text-white">
      <div
        className="relative mx-auto min-h-dvh w-full max-w-[440px] bg-[radial-gradient(120%_50%_at_50%_-10%,rgba(139,124,255,0.22),transparent_55%),#07080d]"
        style={{
          paddingBottom: "calc(6rem + env(safe-area-inset-bottom, 0px) + 28px)",
        }}
      >
        {tab === "showcase" && <Showcase />}
        {tab === "sell" && <Sell onPublished={() => setTab("showcase")} />}
        {tab === "profile" && <Profile />}

        <BottomNav tab={tab} onChange={setTab} />
      </div>

      {toast ? (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
          <button
            type="button"
            onClick={dismissToast}
            className={`pointer-events-auto max-w-full truncate rounded-full px-4 py-2.5 text-sm font-bold shadow-lg ${
              toast.tone === "bad"
                ? "bg-rose-500 text-white"
                : "bg-[#3ee0b0] text-[#06281d]"
            }`}
          >
            {toast.message}
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="pointer-events-none fixed inset-0 z-[55] flex items-center justify-center">
          <div className="rounded-2xl bg-black/70 px-5 py-3 text-sm">Загрузка…</div>
        </div>
      ) : null}
    </div>
  )
}

export default function App() {
  return (
    <MarketProvider>
      <Shell />
    </MarketProvider>
  )
}
