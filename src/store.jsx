import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { fetchByIds, fetchTop } from "./api";

export const START_BALANCE = 100000;
export const FEE = 0.001; // 0.1%
const EPS = 1e-10;
const STATE_KEY = "pc:state:v2";
const PRICES_KEY = "pc:prices:v2";
const REFRESH_MS = 60000;

const emptyAccount = (username = "") => ({
  username,
  cash: START_BALANCE,
  holdings: {}, // id -> { qty, cost, symbol, name, image }
  trades: [], // newest first
  startedAt: Date.now(),
});

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/** Bring over data saved by the first version of the app (wallet/items/usd keys). */
function migrateV1() {
  const loggedin = read("loggedin");
  const username = read("username");
  if (!loggedin || !username) return null;
  const acc = emptyAccount(String(username));
  const usd = read("usd");
  if (typeof usd === "number" && isFinite(usd)) acc.cash = usd;
  const wallet = read("wallet") || [];
  const items = read("items") || [];
  wallet.forEach((w) => {
    const it = items.find((i) => i && i.id === w.id);
    if (!it || !(w.amount > 0)) return;
    acc.holdings[w.id] = {
      qty: w.amount,
      cost: w.amount * (it.current_price || 0),
      symbol: (it.symbol || "").toUpperCase(),
      name: it.name,
      image: it.image,
    };
  });
  ["loggedin", "username", "usd", "wallet", "items", "total", "t"].forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch (e) {}
  });
  return acc;
}

function loadAccount() {
  const s = read(STATE_KEY);
  if (s && typeof s.cash === "number" && s.holdings) return s;
  return migrateV1();
}

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return emptyAccount(action.username);
    case "logout":
      return null;
    case "reset":
      return emptyAccount(state.username);
    case "trade": {
      const { coin, side, qty } = action;
      const price = coin.price;
      const h = state.holdings[coin.id] || { qty: 0, cost: 0 };
      const gross = qty * price;
      const fee = gross * FEE;
      const holdings = { ...state.holdings };
      let cash = state.cash;
      if (side === "buy") {
        const total = gross + fee;
        if (total > cash + EPS) return state;
        cash -= total;
        holdings[coin.id] = {
          qty: h.qty + qty,
          cost: h.cost + total,
          symbol: coin.symbol,
          name: coin.name,
          image: coin.image,
        };
      } else {
        if (qty > h.qty + EPS) return state;
        cash += gross - fee;
        const left = h.qty - qty;
        if (left <= EPS * Math.max(1, h.qty)) delete holdings[coin.id];
        else holdings[coin.id] = { ...h, qty: left, cost: h.cost * (left / h.qty) };
      }
      const trade = {
        id: Date.now() + Math.random().toString(36).slice(2, 7),
        ts: Date.now(),
        coinId: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        side,
        qty,
        price,
        fee,
        total: side === "buy" ? gross + fee : gross - fee,
      };
      return { ...state, cash: Math.max(0, cash), holdings, trades: [trade, ...state.trades].slice(0, 500) };
    }
    default:
      return state;
  }
}

const StoreCtx = createContext(null);

export function StoreProvider({ children }) {
  const [account, dispatch] = useReducer(reducer, undefined, loadAccount);

  // --- prices ---
  const cached = read(PRICES_KEY);
  const [coins, setCoins] = useState(cached?.coins || {}); // id -> coin
  const [order, setOrder] = useState(cached?.order || []); // ids by market cap
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState({ loading: false, error: false, updatedAt: cached?.updatedAt || null });
  const heldIdsRef = useRef([]);
  heldIdsRef.current = account ? Object.keys(account.holdings) : [];

  const refresh = useCallback(async () => {
    setStatus((s) => ({ ...s, loading: true }));
    try {
      const top = await fetchTop(pages);
      const topIds = new Set(top.map((c) => c.id));
      const missing = heldIdsRef.current.filter((id) => !topIds.has(id));
      const extra = missing.length ? await fetchByIds(missing) : [];
      const map = {};
      [...top, ...extra].forEach((c) => (map[c.id] = c));
      const ord = top.map((c) => c.id);
      setCoins((prev) => ({ ...prev, ...map }));
      setOrder(ord);
      const updatedAt = Date.now();
      setStatus({ loading: false, error: false, updatedAt });
      try {
        localStorage.setItem(PRICES_KEY, JSON.stringify({ coins: map, order: ord, updatedAt }));
      } catch (e) {}
    } catch (e) {
      setStatus((s) => ({ ...s, loading: false, error: true }));
    }
  }, [pages]);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(t);
  }, [refresh]);

  // --- persistence ---
  useEffect(() => {
    try {
      if (account) localStorage.setItem(STATE_KEY, JSON.stringify(account));
      else localStorage.removeItem(STATE_KEY);
    } catch (e) {}
  }, [account]);

  const summary = useMemo(() => {
    if (!account) return null;
    let invested = 0;
    let holdingsValue = 0;
    Object.entries(account.holdings).forEach(([id, h]) => {
      const p = coins[id]?.price;
      invested += h.cost;
      holdingsValue += p != null ? h.qty * p : h.cost;
    });
    const total = account.cash + holdingsValue;
    return {
      total,
      holdingsValue,
      invested,
      pnl: total - START_BALANCE,
      pnlPct: ((total - START_BALANCE) / START_BALANCE) * 100,
      count: Object.keys(account.holdings).length,
    };
  }, [account, coins]);

  const value = {
    account,
    summary,
    coins,
    order,
    status,
    refresh,
    loadMore: () => setPages((p) => Math.min(p + 1, 5)),
    canLoadMore: pages < 5,
    login: (username) => dispatch({ type: "login", username }),
    logout: () => dispatch({ type: "logout" }),
    reset: () => dispatch({ type: "reset" }),
    trade: (coin, side, qty) => dispatch({ type: "trade", coin, side, qty }),
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export const useStore = () => useContext(StoreCtx);
