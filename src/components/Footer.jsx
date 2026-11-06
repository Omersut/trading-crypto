import { useI18n } from "../i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <p>
          {t.footerNote}{" "}
          <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer">CoinGecko</a>
        </p>
        <p>
          {t.developedBy}{" "}
          <a href="https://www.linkedin.com/in/omersut/" target="_blank" rel="noopener noreferrer">@omersut</a>
          {" · "}
          <a href="https://github.com/Omersut/trading-crypto" target="_blank" rel="noopener noreferrer">GitHub</a>
        </p>
      </div>
    </footer>
  );
}
