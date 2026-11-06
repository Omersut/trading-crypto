import { useStore } from "../store";
import { useI18n } from "../i18n";
import { pct, trend, usd } from "../format";

export default function Ticker() {
  const { coins, order } = useStore();
  const { t, locale } = useI18n();
  const list = order.slice(0, 24).map((id) => coins[id]).filter(Boolean);

  if (!list.length) {
    return (
      <div className="tape" aria-hidden="true">
        <div className="tape-track tape-static">
          <span className="tape-item">{t.tickerLoading}</span>
        </div>
      </div>
    );
  }

  const items = (keyPrefix) =>
    list.map((c) => (
      <span className="tape-item" key={keyPrefix + c.id}>
        <b>{c.symbol}</b>
        <span className="num">{usd(c.price, locale)}</span>
        <span className={`num chg ${trend(c.change24h)}`}>{pct(c.change24h, locale)}</span>
      </span>
    ));

  return (
    <div className="tape" role="marquee" aria-label="Live prices">
      <div className="tape-track">
        <div className="tape-run">{items("a")}</div>
        <div className="tape-run" aria-hidden="true">{items("b")}</div>
      </div>
    </div>
  );
}
