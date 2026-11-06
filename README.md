# PaperCoin – Kripto Alım Satım Simülatörü

**Gerçek fiyatlar, sanal para.** 100.000 $ sanal bakiyeyle Bitcoin, Ethereum ve yüzlerce coini al, sat, stratejini risksiz dene.

🔗 Demo: https://demo-trading-crypto.vercel.app

[English below](#english)

## Özellikler

- CoinGecko'dan canlı fiyatlar, her dakika otomatik yenileme ve kayan fiyat bandı
- Dolar ya da adet olarak **kesirli alım satım** (ör. 0,005 BTC), %25 / %50 / Max kısayolları
- Her işlemde %0,1 komisyon, işlem öncesi fiş önizlemesi
- Portföyde coin başına **ortalama maliyet ve kâr-zarar**
- Tüm alım satımların listelendiği **işlem geçmişi**
- **Türkçe / İngilizce** arayüz (`?lang=tr` / `?lang=en`)
- Giriş ekranı, "Nasıl oynanır" rehberi ve SSS
- SEO: meta etiketleri, Open Graph görseli, JSON-LD (WebApplication + FAQPage), hreflang, sitemap
- Kayıt gerekmez, veriler sadece tarayıcıda (localStorage) tutulur
- Mobil uyumlu, klavyeyle kullanılabilir

## Çalıştırma

```bash
npm install
npm run dev      # geliştirme sunucusu
npm run build    # üretim derlemesi (build/ klasörü)
npm run preview  # derlemeyi yerelde önizle
```

## Teknolojiler

React 18, Vite, Context + useReducer, CoinGecko API. Harici UI kütüphanesi yok.

---

## English

**Real prices, pretend money.** Buy and sell Bitcoin, Ethereum and hundreds of coins with a $100,000 virtual balance and practise without risk.

- Live CoinGecko prices with auto-refresh and a scrolling ticker
- Fractional trades in dollars or coins, quick 25% / 50% / Max buttons, 0.1% fee
- Average cost and profit/loss per coin, full trade history
- Turkish / English UI, onboarding screen, how-to-play guide and FAQ
- SEO-ready: meta tags, Open Graph image, JSON-LD, hreflang, sitemap
- No sign-up; data stays in your browser

Run with `npm install` and `npm run dev`. Built with React 18 and Vite.

*Educational simulation, not investment advice.*

Developed by [@omersut](https://www.linkedin.com/in/omersut/)
