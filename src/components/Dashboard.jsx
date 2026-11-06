import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { useStore } from "../store";
import { clock, compactUsd, pct, qty as fmtQty, signedUsd, time, trend, usd } from "../format";
import TopBar from "./TopBar";
import Footer from "./Footer";
import Ticker from "./Ticker";
import TradeDialog from "./TradeDialog";
import ScrollTop from "./ScrollTop";
import { HelpDialog } from "./HowTo";

function UserMenu() {
  const { t } = useI18n();
  const { account, reset, logout } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  return (
    <div className="menu" ref={ref}>
      <button className="user-btn" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        @{account.username}
      </button>
      {open && (
        <div className="menu-pop" role="menu">
          <button role="menuitem" onClick={() => { setOpen(false); if (window.confirm(t.resetConfirm)) reset(); }}>{t.reset}</button>
          <button role="menuitem" className="danger" onClick={() => { setOpen(false); if (window.confirm(t.logoutConfirm)) logout(); }}>{t.logout}</button>
        </div>
      )}
    </div>
  );
}

const pnlDir = (pnl) => trend(Math.abs(pnl) < 0.005 ? 0 : pnl);

/** Compact summary that hangs under the top bar once the big one scrolls away. */
function MiniBar({ show }) {
  const { t, locale } = useI18n();
  const { summary, account } = useStore();
  return (
    <div className={`mini-bar ${show ? "show" : ""}`} aria-hidden={!show}>
      <div className="wrap mini-in">
        <span className="mini-item">
          <span className="mini-label">{t.totalValue}</span>
          <strong className="num">{usd(summary.total, locale)}</strong>
          <span className={`num chg ${pnlDir(summary.pnl)}`}>{pct(summary.pnlPct, locale)}</span>
        </span>
        <span className="mini-item">
          <span className="mini-label">{t.cash}</span>
          <strong className="num">{usd(account.cash, locale)}</strong>
        </span>
      </div>
    </div>
  );
}

function Summary({ innerRef }) {
  const { t, locale } = useI18n();
  const { summary, account } = useStore();
  const dir = pnlDir(summary.pnl);
  return (
    <section className="summary wrap" aria-label={t.totalValue} ref={innerRef}>
      <div className="sum-main">
        <span className="sum-label">{t.totalValue}</span>
        <strong className="sum-total num">{usd(summary.total, locale)}</strong>
        <span className={`stamp ${dir}`}>
          <span className="num">{signedUsd(summary.pnl, locale)}</span>
          <span className="num">{pct(summary.pnlPct, locale)}</span>
        </span>
      </div>
      <dl className="sum-side">
        <div>
          <dt>{t.cash}</dt>
          <dd className="num">{usd(account.cash, locale)}</dd>
        </div>
        <div>
          <dt>{t.portfolio}</dt>
          <dd className="num">{usd(summary.holdingsValue, locale)} <small>· {t.holdingsCount(summary.count)}</small></dd>
        </div>
      </dl>
    </section>
  );
}

function CoinCell({ c }) {
  return (
    <span className="coin-cell">
      <img src={c.image} alt="" width="28" height="28" loading="lazy" />
      <span>
        <span className="coin-name">{c.name}</span>
        <span className="coin-sym">{c.symbol}</span>
      </span>
    </span>
  );
}

function Market({ onTrade }) {
  const { t, locale } = useI18n();
  const { coins, order, account, status, refresh, loadMore, canLoadMore } = useStore();
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLocaleLowerCase(locale);
    return order
      .map((id) => coins[id])
      .filter(Boolean)
      .filter((c) => !s || c.name.toLocaleLowerCase(locale).includes(s) || c.symbol.toLocaleLowerCase(locale).includes(s));
  }, [q, order, coins, locale]);

  return (
    <>
      <div className="toolbar">
        <input
          type="search"
          className="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.search}
          aria-label={t.search}
        />
        <span className="muted status">
          {status.updatedAt && (
            <span className="upd">
              <span className="upd-label">{t.updated}: </span>
              <span className="num">{clock(status.updatedAt, locale)}</span>
            </span>
          )}
          <button
            className={`icon-btn refresh ${status.loading ? "spin" : ""}`}
            onClick={refresh}
            disabled={status.loading}
            aria-label={t.refresh}
            title={t.refresh}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </span>
      </div>
      {status.error && <p className="banner" role="status">{t.apiError}</p>}

      <div className="ledger" role="table" aria-label={t.market}>
        <div className="row head" role="row">
          <span role="columnheader" className="c-rank">{t.rank}</span>
          <span role="columnheader">{t.coin}</span>
          <span role="columnheader" className="r">{t.price}</span>
          <span role="columnheader" className="r c-chg">{t.change24h}</span>
          <span role="columnheader" className="r c-mcap">{t.mcap}</span>
          <span role="columnheader" className="r c-hold">{t.holding}</span>
          <span role="columnheader" className="sr-only">{t.buy} / {t.sell}</span>
        </div>
        {list.map((c) => {
          const h = account.holdings[c.id];
          return (
            <div className="row" role="row" key={c.id}>
              <span role="cell" className="c-rank num muted">{c.rank ?? "—"}</span>
              <span role="cell"><CoinCell c={c} /></span>
              <span role="cell" className="r num">
                {usd(c.price, locale)}
                <span className={`m-only chg ${trend(c.change24h)}`}>{pct(c.change24h, locale)}</span>
              </span>
              <span role="cell" className={`r num chg c-chg ${trend(c.change24h)}`}>{pct(c.change24h, locale)}</span>
              <span role="cell" className="r num c-mcap muted">{compactUsd(c.marketCap, locale)}</span>
              <span role="cell" className="r num c-hold">{h ? fmtQty(h.qty, locale) : <span className="muted">—</span>}</span>
              <span role="cell" className="actions">
                <button className="mini buy" onClick={() => onTrade(c.id, "buy")}>{t.buy}</button>
                <button className="mini sell" onClick={() => onTrade(c.id, "sell")} disabled={!h} aria-label={`${t.sell} ${c.symbol}`}>{t.sell}</button>
              </span>
            </div>
          );
        })}
        {!list.length && order.length > 0 && <p className="empty">{t.noResults}</p>}
        {!order.length && <p className="empty">{status.error ? t.apiError : t.tickerLoading}</p>}
      </div>
      {order.length > 0 && !q && (
        <div className="list-end">
          <span className="muted">{t.showing(order.length)}</span>
          {canLoadMore && (
            <button className="btn-ghost" onClick={loadMore} disabled={status.loading}>{t.loadMore}</button>
          )}
        </div>
      )}
    </>
  );
}

function Portfolio({ onTrade, goMarket }) {
  const { t, locale } = useI18n();
  const { account, coins } = useStore();
  const rows = Object.entries(account.holdings)
    .map(([id, h]) => {
      const c = coins[id];
      const price = c?.price;
      const value = price != null ? h.qty * price : null;
      const pnl = value != null ? value - h.cost : null;
      return { id, h, c, price, value, pnl, pnlPct: pnl != null && h.cost ? (pnl / h.cost) * 100 : null };
    })
    .sort((a, b) => (b.value ?? b.h.cost) - (a.value ?? a.h.cost));

  if (!rows.length)
    return (
      <div className="empty-state">
        <p>{t.emptyPortfolio}</p>
        <button className="btn-primary" onClick={goMarket}>{t.goMarket}</button>
      </div>
    );

  return (
    <div className="ledger pf" role="table" aria-label={t.portfolio}>
      <div className="row head" role="row">
        <span role="columnheader">{t.coin}</span>
        <span role="columnheader" className="r">{t.qty}</span>
        <span role="columnheader" className="r c-avg">{t.avgCost}</span>
        <span role="columnheader" className="r">{t.value}</span>
        <span role="columnheader" className="r">{t.pnl}</span>
        <span role="columnheader" className="sr-only">{t.buy} / {t.sell}</span>
      </div>
      {rows.map(({ id, h, c, value, pnl, pnlPct }) => (
        <div className="row" role="row" key={id}>
          <span role="cell"><CoinCell c={c || { ...h, image: h.image }} /></span>
          <span role="cell" className="r num">{fmtQty(h.qty, locale)}</span>
          <span role="cell" className="r num c-avg muted">{usd(h.cost / h.qty, locale)}</span>
          <span role="cell" className="r num">{value != null ? usd(value, locale) : <span className="muted">{t.priceStale}</span>}</span>
          <span role="cell" className={`r num chg ${trend(pnl)}`}>
            {pnl != null ? <>{signedUsd(pnl, locale)}<small>{pct(pnlPct, locale)}</small></> : "—"}
          </span>
          <span role="cell" className="actions">
            <button className="mini buy" onClick={() => onTrade(id, "buy")} disabled={!c}>{t.buy}</button>
            <button className="mini sell" onClick={() => onTrade(id, "sell")} disabled={!c}>{t.sell}</button>
          </span>
        </div>
      ))}
    </div>
  );
}

function History() {
  const { t, locale } = useI18n();
  const { account } = useStore();
  if (!account.trades.length) return <div className="empty-state"><p>{t.emptyHistory}</p></div>;
  return (
    <ol className="tape-log">
      {account.trades.map((x) => (
        <li key={x.id} className={x.side}>
          <span className="tl-side">{x.side === "buy" ? t.buy : t.sell}</span>
          <span className="tl-main">
            <strong className="num">{fmtQty(x.qty, locale)} {x.symbol}</strong>
            <span className="muted num">@ {usd(x.price, locale)}</span>
          </span>
          <span className="tl-total num">{x.side === "buy" ? "−" : "+"}{usd(x.total, locale)}</span>
          <time className="muted num" dateTime={new Date(x.ts).toISOString()}>{time(x.ts, locale)}</time>
        </li>
      ))}
    </ol>
  );
}

export default function Dashboard() {
  const { t, locale } = useI18n();
  const [tab, setTab] = useState("market");
  const [tradeFor, setTradeFor] = useState(null);
  const [help, setHelp] = useState(false);
  const [toast, setToast] = useState(null);
  const { account } = useStore();
  const summaryRef = useRef(null);
  const tabsRef = useRef(null);
  const [mini, setMini] = useState(false);

  // Show the mini summary once the big summary has scrolled out of view.
  useEffect(() => {
    const el = summaryRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setMini(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("mini-on", mini);
    return () => document.documentElement.classList.remove("mini-on");
  }, [mini]);

  // Switching tabs deep in a long list: bring the tabs back to the top of the view.
  const switchTab = (k) => {
    setTab(k);
    const el = tabsRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start" });
  };

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (!account.trades.length) setHelp(sessionStorage.getItem("pc:helpSeen") !== "1");
    sessionStorage.setItem("pc:helpSeen", "1");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs = [
    ["market", t.market],
    ["portfolio", t.portfolio],
    ["history", t.history],
  ];

  return (
    <>
      <TopBar onHelp={() => setHelp(true)} below={<MiniBar show={mini} />}>
        <UserMenu />
      </TopBar>
      <Ticker />
      <main>
        <h1 className="sr-only">PaperCoin – {t.market}</h1>
        <Summary innerRef={summaryRef} />
        <div className="wrap">
          <div className="tabs" role="tablist" ref={tabsRef}>
            {tabs.map(([k, label]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => switchTab(k)}>
                {label}
                {k === "history" && account.trades.length > 0 && <span className="count num">{account.trades.length}</span>}
              </button>
            ))}
          </div>
          <div role="tabpanel">
            {tab === "market" && <Market onTrade={(id, side) => setTradeFor({ id, side })} />}
            {tab === "portfolio" && <Portfolio onTrade={(id, side) => setTradeFor({ id, side })} goMarket={() => switchTab("market")} />}
            {tab === "history" && <History />}
          </div>
        </div>
      </main>
      <Footer />
      {tradeFor && (
        <TradeDialog
          key={tradeFor.id + tradeFor.side}
          coinId={tradeFor.id}
          initialSide={tradeFor.side}
          onClose={() => setTradeFor(null)}
          onDone={(r) => setToast(r)}
        />
      )}
      <ScrollTop />
      <HelpDialog open={help} onClose={() => setHelp(false)} />
      <div className="toast-zone" aria-live="polite">
        {toast && (
          <div className={`toast ${toast.side}`}>
            <strong>{toast.side === "buy" ? t.bought : t.sold}</strong>{" "}
            <span className="num">{fmtQty(toast.q, locale)} {toast.symbol}</span>{" "}
            <span className="num muted">· {usd(toast.total, locale)}</span>
          </div>
        )}
      </div>
    </>
  );
}
