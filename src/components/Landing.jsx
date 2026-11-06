import { useState } from "react";
import { useI18n } from "../i18n";
import { useStore, START_BALANCE } from "../store";
import { usd } from "../format";
import Ticker from "./Ticker";
import { Faq, Steps } from "./HowTo";
import TopBar from "./TopBar";
import Footer from "./Footer";

export default function Landing() {
  const { t, locale } = useI18n();
  const { login } = useStore();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const n = name.trim();
    if (n.length < 2) return setError(t.nameError);
    login(n.slice(0, 24));
  };

  return (
    <>
      <TopBar onHelp={() => document.getElementById("nasil")?.scrollIntoView({ behavior: "smooth" })} />
      <Ticker />
      <main>
        <section className="hero wrap">
          <div className="hero-copy">
            <h1>{t.heroTitle}</h1>
            <p className="lead">{t.heroLead}</p>
          </div>

          <form className="ticket" onSubmit={submit} noValidate>
            <div className="ticket-top">
              <h2>{t.ticketTitle}</h2>
              <div className="ticket-amount">
                <span>{t.balanceLabel}</span>
                <strong className="num">{usd(START_BALANCE, locale, { compact: true })}</strong>
              </div>
            </div>
            <div className="ticket-body">
              <label htmlFor="username">{t.nameLabel}</label>
              <div className="ticket-input">
                <span aria-hidden="true">@</span>
                <input
                  id="username"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder={t.namePlaceholder}
                  autoComplete="nickname"
                  maxLength={24}
                  aria-invalid={!!error}
                  aria-describedby={error ? "name-err" : "name-note"}
                />
              </div>
              {error && (
                <p className="err" id="name-err" role="alert">{error}</p>
              )}
              <button className="btn-primary" type="submit">{t.start}</button>
              <p className="fine" id="name-note">{t.ticketNote}</p>
            </div>
          </form>
        </section>

        <section className="wrap section" id="nasil" aria-labelledby="how-h">
          <h2 id="how-h" className="section-title">{t.stepsTitle}</h2>
          <Steps headingLevel={3} />
        </section>

        <section className="wrap section" aria-labelledby="faq-h">
          <h2 id="faq-h" className="section-title">{t.faqTitle}</h2>
          <Faq />
        </section>
      </main>
      <Footer />
    </>
  );
}
