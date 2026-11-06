import { createContext, useContext, useEffect, useMemo, useState } from "react";

const dict = {
  tr: {
    metaTitle: "PaperCoin – Sanal Parayla Kripto Alım Satım Simülatörü",
    metaDesc:
      "Gerçek kripto fiyatlarıyla, 100.000 $ sanal bakiyeyle risksiz alım satım yap. Bitcoin, Ethereum ve 250+ coinde strateji dene, kâr-zararını takip et.",
    howTo: "Nasıl oynanır",
    langSwitch: "English",
    heroTitle: "Gerçek fiyatlar, sanal para.",
    heroLead:
      "100.000 $ sanal bakiyeyle Bitcoin, Ethereum ve yüzlerce coini al, sat, stratejini dene. Kaybedersen sadece tecrübe kazanırsın.",
    ticketTitle: "Hesap aç",
    ticketNote: "Kayıt yok, e-posta yok. Verilerin sadece bu tarayıcıda tutulur.",
    nameLabel: "Kullanıcı adın",
    namePlaceholder: "ör. satoshi",
    start: "100.000 $ ile başla",
    continueAs: "Devam et",
    balanceLabel: "Başlangıç bakiyesi",
    nameError: "En az 2 karakterlik bir kullanıcı adı yaz.",
    stepsTitle: "Nasıl oynanır",
    steps: [
      ["Hesabını aç", "Bir kullanıcı adı yaz. Hesabına anında 100.000 $ sanal bakiye tanımlanır."],
      ["Coin seç", "Piyasa listesinde fiyatlar CoinGecko'dan canlı gelir ve her dakika yenilenir. İsim ya da sembolle ara."],
      ["Al veya sat", "Tutarı dolar ya da adet olarak gir. Kesirli alım yapabilirsin: 0,005 BTC de olur. Her işlemde %0,1 komisyon kesilir."],
      ["Sonucu izle", "Portföyde her coinin ortalama maliyetini ve kâr-zararını, Geçmiş'te tüm işlemlerini görürsün."],
    ],
    faqTitle: "Sık sorulan sorular",
    faq: [
      ["Gerçek para kullanılıyor mu?", "Hayır. Bakiye tamamen sanaldır, hiçbir ödeme ya da cüzdan bağlantısı yoktur."],
      ["Fiyatlar gerçek mi?", "Evet. Fiyatlar ve 24 saatlik değişimler CoinGecko'nun herkese açık verisinden gelir."],
      ["Verilerim nerede saklanıyor?", "Sadece senin tarayıcında (localStorage). Tarayıcı verilerini silersen ya da Sıfırla'ya basarsan baştan başlarsın."],
      ["Yatırım tavsiyesi mi?", "Hayır. PaperCoin bir eğitim ve oyun aracıdır. Burada iyi giden bir strateji gerçek piyasada kaybettirebilir."],
    ],
    tickerLoading: "Fiyatlar yükleniyor…",
    // app
    market: "Piyasa",
    portfolio: "Portföy",
    history: "Geçmiş",
    totalValue: "Toplam değer",
    cash: "Nakit",
    pnl: "Kâr / zarar",
    search: "Coin ara (ör. btc, solana)",
    coin: "Coin",
    price: "Fiyat",
    change24h: "24s",
    mcap: "Piyasa değeri",
    holding: "Elindeki",
    buy: "Al",
    sell: "Sat",
    loadMore: "Daha fazla coin yükle",
    noResults: "Bu aramayla eşleşen coin yok. Listede değilse aşağıdan daha fazla coin yükle.",
    updated: "Son güncelleme",
    refresh: "Fiyatları yenile",
    apiError: "Fiyatlar alınamadı (CoinGecko istek sınırı olabilir). Son bilinen fiyatlar gösteriliyor, bir dakika içinde tekrar denenecek.",
    emptyPortfolio: "Portföyün boş. Piyasa sekmesinden ilk coinini al.",
    goMarket: "Piyasaya git",
    amount: "Miktar",
    avgCost: "Ort. maliyet",
    value: "Değer",
    emptyHistory: "Henüz işlem yok. Yaptığın her alım ve satım burada listelenir.",
    date: "Tarih",
    side: "İşlem",
    qty: "Adet",
    total: "Tutar",
    fee: "Komisyon",
    inUsd: "Dolar",
    inQty: "Adet",
    youGet: "Alacağın",
    youReceive: "Eline geçecek",
    youPay: "Ödeyeceğin",
    available: "Kullanılabilir",
    confirmBuy: (s) => `${s} satın al`,
    confirmSell: (s) => `${s} sat`,
    disclaimer: "PaperCoin bir eğitim ve oyun aracıdır, yatırım tavsiyesi değildir. Burada işe yarayan bir strateji gerçek piyasada kaybettirebilir.",
    cancel: "Vazgeç",
    insufficientCash: "Nakit bakiyen bu işlem için yetmiyor.",
    insufficientCoin: "Elinde bu kadar coin yok.",
    enterAmount: "Bir miktar gir.",
    bought: "Alındı",
    sold: "Satıldı",
    menu: "Menü",
    reset: "Bakiyeyi sıfırla",
    resetConfirm: "Tüm coinlerin ve işlem geçmişin silinip 100.000 $ ile baştan başlanacak. Emin misin?",
    logout: "Çıkış yap",
    logoutConfirm: "Çıkış yaparsan bu tarayıcıdaki tüm verilerin silinir. Emin misin?",
    close: "Kapat",
    rank: "#",
    feeNote: "%0,1 komisyon dahil",
    best: "En iyi değer",
    footerNote: "Eğitim amaçlı simülasyondur, yatırım tavsiyesi değildir. Fiyat verisi:",
    developedBy: "Geliştiren",
    holdingsCount: (n) => `${n} coin`,
    priceStale: "fiyat bekleniyor",
    backToTop: "Başa dön",
    showing: (n) => `${n} coin listeleniyor`,
    updatedShort: "Güncellendi",
  },
  en: {
    metaTitle: "PaperCoin – Crypto Paper Trading Simulator with Real Prices",
    metaDesc:
      "Trade crypto risk-free with real market prices and a $100,000 virtual balance. Practice on Bitcoin, Ethereum and 250+ coins and track your profit and loss.",
    howTo: "How to play",
    langSwitch: "Türkçe",
    heroTitle: "Real prices, pretend money.",
    heroLead:
      "Buy and sell Bitcoin, Ethereum and hundreds of other coins with a $100,000 virtual balance. If you lose, all you lose is a lesson.",
    ticketTitle: "Open an account",
    ticketNote: "No sign-up, no email. Your data stays in this browser only.",
    nameLabel: "Your username",
    namePlaceholder: "e.g. satoshi",
    start: "Start with $100,000",
    continueAs: "Continue",
    balanceLabel: "Starting balance",
    nameError: "Enter a username of at least 2 characters.",
    stepsTitle: "How to play",
    steps: [
      ["Open your account", "Pick a username. You instantly get a $100,000 virtual balance."],
      ["Pick a coin", "Market prices come live from CoinGecko and refresh every minute. Search by name or symbol."],
      ["Buy or sell", "Enter an amount in dollars or coins. Fractions are fine: 0.005 BTC works. Each trade has a 0.1% fee."],
      ["Watch the result", "Portfolio shows your average cost and profit or loss per coin. History lists every trade."],
    ],
    faqTitle: "FAQ",
    faq: [
      ["Is real money involved?", "No. The balance is entirely virtual. There are no payments and no wallet connections."],
      ["Are the prices real?", "Yes. Prices and 24-hour changes come from CoinGecko's public market data."],
      ["Where is my data stored?", "Only in your browser (localStorage). Clearing browser data or pressing Reset starts you over."],
      ["Is this investment advice?", "No. PaperCoin is a learning game. A strategy that works here can still lose money in a real market."],
    ],
    tickerLoading: "Loading prices…",
    market: "Market",
    portfolio: "Portfolio",
    history: "History",
    totalValue: "Total value",
    cash: "Cash",
    pnl: "Profit / loss",
    search: "Search coins (e.g. btc, solana)",
    coin: "Coin",
    price: "Price",
    change24h: "24h",
    mcap: "Market cap",
    holding: "Holding",
    buy: "Buy",
    sell: "Sell",
    loadMore: "Load more coins",
    noResults: "No coin matches this search. If it isn't listed yet, load more coins below.",
    updated: "Last updated",
    refresh: "Refresh prices",
    apiError: "Couldn't fetch prices (likely CoinGecko's rate limit). Showing last known prices; retrying within a minute.",
    emptyPortfolio: "Your portfolio is empty. Buy your first coin from the Market tab.",
    goMarket: "Go to market",
    amount: "Amount",
    avgCost: "Avg. cost",
    value: "Value",
    emptyHistory: "No trades yet. Every buy and sell you make shows up here.",
    date: "Date",
    side: "Side",
    qty: "Quantity",
    total: "Total",
    fee: "Fee",
    inUsd: "Dollars",
    inQty: "Coins",
    youGet: "You get",
    youReceive: "You receive",
    youPay: "You pay",
    available: "Available",
    confirmBuy: (s) => `Buy ${s}`,
    confirmSell: (s) => `Sell ${s}`,
    disclaimer: "PaperCoin is a learning game, not investment advice. A strategy that works here can still lose money in a real market.",
    cancel: "Cancel",
    insufficientCash: "Not enough cash for this trade.",
    insufficientCoin: "You don't hold that many coins.",
    enterAmount: "Enter an amount.",
    bought: "Bought",
    sold: "Sold",
    menu: "Menu",
    reset: "Reset balance",
    resetConfirm: "All your coins and trade history will be deleted and you'll restart with $100,000. Continue?",
    logout: "Log out",
    logoutConfirm: "Logging out deletes all your data in this browser. Continue?",
    close: "Close",
    rank: "#",
    feeNote: "includes 0.1% fee",
    best: "Best value",
    footerNote: "Educational simulation, not investment advice. Price data:",
    developedBy: "Built by",
    holdingsCount: (n) => `${n} coin${n === 1 ? "" : "s"}`,
    priceStale: "waiting for price",
    backToTop: "Back to top",
    showing: (n) => `Showing ${n} coins`,
    updatedShort: "Updated",
  },
};

const I18nCtx = createContext(null);

function initialLang() {
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "tr" || q === "en") return q;
    const s = localStorage.getItem("pc:lang");
    if (s === "tr" || s === "en") return s;
  } catch (e) {}
  return (navigator.language || "tr").toLowerCase().startsWith("tr") ? "tr" : "en";
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    const t = dict[lang];
    document.documentElement.lang = lang;
    document.title = t.metaTitle;
    const d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute("content", t.metaDesc);
    try {
      localStorage.setItem("pc:lang", lang);
    } catch (e) {}
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      t: dict[lang],
      locale: lang === "tr" ? "tr-TR" : "en-US",
      toggleLang: () => setLang((l) => (l === "tr" ? "en" : "tr")),
    }),
    [lang]
  );
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);
