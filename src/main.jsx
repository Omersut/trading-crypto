import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/bricolage-grotesque/500.css";
import "@fontsource/bricolage-grotesque/700.css";
import "@fontsource/bricolage-grotesque/800.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "./styles.css";
import { I18nProvider } from "./i18n";
import { StoreProvider, useStore } from "./store";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";

function App() {
  const { account } = useStore();
  return account ? <Dashboard /> : <Landing />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <I18nProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </I18nProvider>
  </StrictMode>
);
