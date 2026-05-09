# Spendly AI 💸✨
### Financial Operating System v3.0 — Ultra Premium AI Edition

> **Author:** Shaikh Yasir  
> **GitHub:** [github.com/YasirShaikh03](https://github.com/YasirShaikh03)  
> **Version:** 3.0.0  
> **Powered by:** Claude AI (Anthropic)

---

## 📁 Project Structure

```
spendly-ai/
├── index.html       ← Main HTML structure & markup
├── styles.css       ← All CSS styles, animations, themes
├── app.js           ← Full JavaScript engine & logic
└── README.md        ← You are here
```

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🤖 **AI Financial Advisor** | Real-time Claude-powered chat for personalized advice |
| 📊 **Smart Analytics** | 6-month trends, radar charts, spending heatmaps |
| 💰 **Budget Manager** | Set & track monthly spending limits per category |
| 🎯 **Savings Goals** | Visual goal tracking with ring progress charts |
| 📈 **Portfolio Tracker** | Investments — SIPs, stocks, crypto, gold, FD |
| 👜 **Multi-Wallet** | Manage bank, cash, UPI, and crypto accounts |
| 📅 **Financial Calendar** | Bills, EMIs, SIPs, and reminders |
| 🏆 **Gamification** | XP, levels, achievements & daily challenges |
| 🔔 **Smart Alerts** | Real-time budget breach & balance alerts |
| 🎨 **Themes** | Dark, AMOLED, Neon, Cyberpunk, Luxury Gold + Light mode |
| 🔒 **PIN Lock** | 4-digit PIN security screen |
| 🎙️ **Voice Input** | Add transactions using voice |
| ⌘ **Command Palette** | Ctrl+K for fast navigation |
| 📤 **Export** | CSV, JSON, and Print/PDF export |

---

## 🛠️ How to Run

1. Clone or download the project files
2. Place all files in the **same folder**
3. Open `index.html` in any modern browser

> ⚠️ No build tools, no npm, no backend required — runs 100% in browser.

---

## 📦 Dependencies (CDN)

- **Chart.js v4.4.1** — All data visualizations
- **Google Fonts** — Outfit + DM Mono
- **Anthropic Claude API** — AI chat (requires API key passed via headers)

---

## 🧠 AI Chat Setup

The AI Advisor chat connects to `api.anthropic.com/v1/messages`.  
When running inside Claude.ai, the API key is injected automatically.  
For standalone use, you may need to add your own key in `app.js`:

```js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'YOUR_API_KEY_HERE',          // add this line
  'anthropic-version': '2023-06-01'           // add this line
}
```

---

## 🎨 Customization

All design tokens are CSS variables in `styles.css`:

```css
:root {
  --accent: #6c47ff;    /* Primary accent */
  --accent2: #4488ff;   /* Secondary accent */
  --green: #00e5a0;     /* Positive/income */
  --red: #ff3d6e;       /* Negative/expense */
  ...
}
```

Switch themes at runtime via the 🎨 button in the sidebar.

---

## 📄 License

MIT — Free to use, modify, and distribute.

---

<div align="center">

Made with ❤️ by **Shaikh Yasir**  
[github.com/YasirShaikh03](https://github.com/YasirShaikh03)

</div>
