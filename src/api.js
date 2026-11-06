const BASE = "https://api.coingecko.com/api/v3/coins/markets";
const PER_PAGE = 100;

function mapCoin(c) {
  return {
    id: c.id,
    symbol: (c.symbol || "").toUpperCase(),
    name: c.name,
    image: c.image,
    price: c.current_price,
    change24h: c.price_change_percentage_24h,
    marketCap: c.market_cap,
    rank: c.market_cap_rank,
  };
}

async function get(params) {
  const url = `${BASE}?vs_currency=usd&sparkline=false&${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Unexpected response");
  return data.map(mapCoin);
}

/** Top coins by market cap, pages 1..pages. */
export async function fetchTop(pages = 1) {
  const all = [];
  for (let p = 1; p <= pages; p++) {
    all.push(...(await get(`order=market_cap_desc&per_page=${PER_PAGE}&page=${p}`)));
  }
  return all;
}

/** Specific coins by id, so held coins always have a price even if not in the top list. */
export async function fetchByIds(ids) {
  if (!ids.length) return [];
  return get(`ids=${encodeURIComponent(ids.join(","))}&per_page=250`);
}
