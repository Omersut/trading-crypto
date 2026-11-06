import { useI18n } from "../i18n";

export function Logo() {
  return (
    <span className="logo" aria-label="PaperCoin">
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
        <path d="M5 4h17l5 5v19H5z" fill="var(--paper-hi)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M22 4v5h5" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M9 22l5-6 4 3 5-7" fill="none" stroke="var(--gain)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="logo-word">PaperCoin</span>
    </span>
  );
}

export default function TopBar({ onHelp, children }) {
  const { t, toggleLang, lang } = useI18n();
  return (
    <header className="topbar">
      <div className="wrap topbar-in">
        <Logo />
        <nav className="topbar-actions" aria-label="Site">
          {children}
          <button className="link-btn help-btn" onClick={onHelp} aria-label={t.howTo}>
            <span className="help-long">{t.howTo}</span>
            <span className="help-short" aria-hidden="true">?</span>
          </button>
          <button
            className="lang-btn"
            onClick={toggleLang}
            lang={lang === "tr" ? "en" : "tr"}
            aria-label={lang === "tr" ? "Switch to English" : "Türkçeye geç"}
          >
            <span className={lang === "tr" ? "on" : ""}>TR</span>
            <span className={lang === "en" ? "on" : ""}>EN</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
