export const GAMES = [
  {
    id: "brawl",
    label: "Brawl Stars",
    chip: "bg-amber-400/15 text-amber-200",
    glow: "from-amber-400/25",
  },
  {
    id: "roblox",
    label: "Roblox",
    chip: "bg-rose-400/15 text-rose-200",
    glow: "from-rose-400/25",
  },
  {
    id: "cs2",
    label: "CS2",
    chip: "bg-orange-400/15 text-orange-200",
    glow: "from-orange-400/25",
  },
]

export const STARTING_BALANCE = 4500

export const SEED_PRODUCTS = [
  {
    id: "seed-1",
    title: "1000 гемов",
    game: "brawl",
    price: 690,
    description: "Мгновенная выдача на ваш аккаунт",
    sellerId: "shop-nova",
    sellerName: "NovaDeals",
  },
  {
    id: "seed-2",
    title: "Аккаунт 35 000 кубков",
    game: "brawl",
    price: 2400,
    description: "Почта в комплекте, без привязки",
    sellerId: "shop-nova",
    sellerName: "NovaDeals",
  },
  {
    id: "seed-3",
    title: "800 Robux",
    game: "roblox",
    price: 890,
    description: "Gamepass, выдача до 15 минут",
    sellerId: "shop-pixel",
    sellerName: "PixelBay",
  },
  {
    id: "seed-4",
    title: "Adopt Me — Shadow Dragon",
    game: "roblox",
    price: 1750,
    description: "Трейд в игре, онлайн сейчас",
    sellerId: "shop-pixel",
    sellerName: "PixelBay",
  },
  {
    id: "seed-5",
    title: "AK-47 | Redline FT",
    game: "cs2",
    price: 1280,
    description: "Трейд-ссылка, холд 7 дней",
    sellerId: "shop-aim",
    sellerName: "AimMarket",
  },
  {
    id: "seed-6",
    title: "Prime Status",
    game: "cs2",
    price: 990,
    description: "Апгрейд на ваш Steam",
    sellerId: "shop-aim",
    sellerName: "AimMarket",
  },
]

export function gameById(id) {
  return GAMES.find((game) => game.id === id) ?? GAMES[0]
}

export function formatPrice(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`
}
