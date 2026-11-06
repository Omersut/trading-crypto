import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { FEE, useStore } from "../store";
import { parseNum, pct, qty as fmtQty, trend, usd } from "../format";

const CHIPS = [0.25, 0.5, 1];

export default function TradeDialog({ coinId, initialSide, onClose, onDone }) {
  const { t, locale } = useI18n();
  const { coins, account, trade } = useStore();
  const coin = coins[coinId];
  const held = account.holdings[coinId]?.qty || 0;
  const [side, setSide] = useState(initialSide);
  const [mode, setMode] = useState("usd");
  const [text, setText] = useState("");
  const [exactQty, setExactQty] = useState(null);
  const ref = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    ref.current?.showModal();
    setTimeout(() => inputRef.current?.focus(), 30);
  }, []);

  useEffect(() => {
    setText("");
    setExactQty(null);
  }, [side, mode]);

  const price = coin?.price;
  const calc = useMemo(() => {
    if (!price) return null;
    let q;
    if (exactQty != null) q = exactQty;
    else {
      const n = parseNum(text);
      if (!(n > 0)) return { q: 0 };
      if (mode === "qty") q = n;
      else q = side === "buy" ? n / (price * (1 + FEE)) : n / price;
    }
    const gross = q * price;
    const fee = gross * FEE;
    const total = side === "buy" ? gross + fee : gross - fee;
    let error = "";
    if (side === "buy" && total > account.cash + 1e-6) error = t.insufficientCash;
    if (side === "sell" && q > held * (1 + 1e-9)) error = t.insufficientCoin;
    return { q, gross, fee, total, error };
  }, [text, exactQty, mode, side, price, account.cash, held, t]);

  const chip = (p) => {
    let q;
    if (side === "buy") q = (account.cash * p) / (price * (1 + FEE));
    else q = p === 1 ? held : held * p;
    if (!(q > 0)) return;
    setExactQty(q);
    const display = mode === "qty" ? q : side === "buy" ? account.cash * p : q * price;
    setText(new Intl.NumberFormat(locale, { maximumFractionDigits: mode === "qty" ? 8 : 2, useGrouping: false }).format(display));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!calc || !(calc.q > 0) || calc.error) return;
    trade(coin, side, calc.q);
    onDone({ side, symbol: coin.symbol, q: calc.q, total: calc.total });
    ref.current?.close();
  };

  if (!coin) return null;
  const canSell = held > 0;

  return (
    <dialog ref={ref} className="sheet trade" onClose={onClose} onClick={(e) => e.target === ref.current && ref.current.close()} aria-labelledby="trade-h">
      <form className="sheet-inner" onSubmit={submit}>
        <header className="sheet-head">
          <div className="coin-id">
            <img src={coin.image} alt="" width="36" height="36" />
            <div>
              <h2 id="trade-h">{coin.name}</h2>
              <span className="muted">
                <span className="num">{usd(price, locale)}</span>{" "}
                <span className={`num chg ${trend(coin.change24h)}`}>{pct(coin.change24h, locale)}</span>
              </span>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={() => ref.current.close()} aria-label={t.close}>✕</button>
        </header>

        <div className="seg side-seg" role="tablist">
          <button type="button" role="tab" aria-selected={side === "buy"} className={side === "buy" ? "on buy" : ""} onClick={() => setSide("buy")}>{t.buy}</button>
          <button type="button" role="tab" aria-selected={side === "sell"} className={side === "sell" ? "on sell" : ""} disabled={!canSell} onClick={() => setSide("sell")}>{t.sell}</button>
        </div>

        <p className="avail">
          {t.available}:{" "}
          <strong className="num">
            {side === "buy" ? usd(account.cash, locale) : `${fmtQty(held, locale)} ${coin.symbol}`}
          </strong>
        </p>

        <label className="field-label" htmlFor="amt">{t.amount}</label>
        <div className="amount-row">
          <input
            id="amt"
            ref={inputRef}
            className="num"
            inputMode="decimal"
            autoComplete="off"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setExactQty(null);
            }}
            placeholder="0"
            aria-invalid={!!calc?.error}
          />
          <div className="seg unit-seg">
            <button type="button" className={mode === "usd" ? "on" : ""} onClick={() => setMode("usd")} aria-pressed={mode === "usd"}>USD</button>
            <button type="button" className={mode === "qty" ? "on" : ""} onClick={() => setMode("qty")} aria-pressed={mode === "qty"}>{coin.symbol}</button>
          </div>
        </div>
        <div className="chips">
          {CHIPS.map((p) => (
            <button type="button" key={p} onClick={() => chip(p)}>{p === 1 ? "Max" : pct(p * 100, locale, false).replace(/[.,]00/, "")}</button>
          ))}
        </div>

        <dl className="receipt">
          <div>
            <dt>{side === "buy" ? t.youGet : t.qty}</dt>
            <dd className="num">{calc?.q > 0 ? `${fmtQty(calc.q, locale)} ${coin.symbol}` : "—"}</dd>
          </div>
          <div>
            <dt>{t.fee} ({locale === "tr-TR" ? "%0,1" : "0.1%"})</dt>
            <dd className="num">{calc?.q > 0 ? usd(calc.fee, locale) : "—"}</dd>
          </div>
          <div className="receipt-total">
            <dt>{side === "buy" ? t.youPay : t.youReceive}</dt>
            <dd className="num">{calc?.q > 0 ? usd(calc.total, locale) : "—"}</dd>
          </div>
        </dl>

        {calc?.error && <p className="err" role="alert">{calc.error}</p>}

        <button className={`btn-primary ${side}`} type="submit" disabled={!calc || !(calc.q > 0) || !!calc.error}>
          {side === "buy" ? t.confirmBuy(coin.symbol) : t.confirmSell(coin.symbol)}
        </button>
      </form>
    </dialog>
  );
}
