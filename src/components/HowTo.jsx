import { useEffect, useRef } from "react";
import { useI18n } from "../i18n";

export function Steps({ headingLevel = 2 }) {
  const { t } = useI18n();
  const H = `h${headingLevel}`;
  return (
    <ol className="steps">
      {t.steps.map(([title, body], i) => (
        <li key={i} className="step">
          <span className="step-no" aria-hidden="true">{i + 1}</span>
          <H className="step-title">{title}</H>
          <p>{body}</p>
        </li>
      ))}
    </ol>
  );
}

export function Faq() {
  const { t } = useI18n();
  return (
    <div className="faq">
      {t.faq.map(([q, a], i) => (
        <details key={i}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}

export function HelpDialog({ open, onClose }) {
  const { t } = useI18n();
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="sheet" onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}>
      <div className="sheet-inner">
        <header className="sheet-head">
          <h2>{t.stepsTitle}</h2>
          <button className="icon-btn" onClick={onClose} aria-label={t.close}>✕</button>
        </header>
        <Steps headingLevel={3} />
        <p className="fine">{t.disclaimer}</p>
      </div>
    </dialog>
  );
}
