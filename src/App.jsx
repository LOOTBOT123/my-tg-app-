import { useEffect, useState } from "react"
import BottomNav from "./components/BottomNav"
import { MarketProvider, useMarket } from "./market"
import Profile from "./screens/Profile"
import Sell from "./screens/Sell"
import Showcase from "./screens/Showcase"
import { getTelegramUser, initTelegram } from "./telegram"

function Shell() {
  const user = useState(() => getTelegramUser())[0]
  const [tab, setTab] = useState("showcase")
  const { toast, dismissToast } = useMarket()

  useEffect(() => {
    initTelegram()
  }, [])

  return (
    <div className="min-h-dvh bg-[#07080d] text-white">
      <div className="relative mx-auto min-h-dvh w-full max-w-[440px] bg-[radial-gradient(120%_50%_at_50%_-10%,rgba(139,124,255,0.22),transparent_55%),#07080d] pb-28">
        {tab === "showcase" ? <Showcase user={user} /> : null}
        {tab === "sell" ? <Sell user={user} onPublished={() => setTab("showcase")} /> : null}
        {tab === "profile" ? <Profile user={user} /> : null}
        <BottomNav tab={tab} onChange={setTab} />
      </div>

      {toast ? (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4">
          <button
            type="button"
            onClick={dismissToast}
            className={`pointer-events-auto rounded-full px-4 py-2.5 text-sm font-bold shadow-lg ${
              toast.tone === "bad" ? "bg-rose-500 text-white" : "bg-[#3ee0b0] text-[#06281d]"
            }`}
          >
            {toast.message}
          </button>
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
