## Author

Yasir Shaikh
GitHub: https://github.com/YasirShaikh03


# 💸 Spendly — Expense Tracker

A clean, minimal expense tracker built with vanilla HTML, CSS, and JavaScript. No frameworks, no dependencies — just open and use!

---

## 🖥️ Live Demo

> Host for free on GitHub Pages — see [Deployment](#-deployment) below.

---

## ✨ Features

- ➕ Add **income** and **expense** transactions
- 🗂️ **10 categories** — Food, Transport, Shopping, Health, Entertainment, Education, Housing, Salary, and more
- 📅 **Month-by-month navigation** — browse past and future months
- 🍩 **Donut chart** showing spending breakdown by category
- 🔍 **Filter** transactions by All / Expenses / Income
- 🗑️ **Delete** any transaction
- 💾 **LocalStorage** — your data persists between sessions
- 📱 **Fully responsive** — works on mobile and desktop
- ⌨️ **Enter key** shortcut to add transactions quickly

---

## 📁 Project Structure

```
spendly/
├── index.html   → App structure & layout
├── style.css    → All styling and animations
├── script.js    → App logic, state, chart rendering
└── README.md    → You are here!
```

---

## 🚀 Deployment

### Option 1 — GitHub Pages (Recommended)

1. Create a new repository on [github.com](https://github.com)
2. Upload all four files (`index.html`, `style.css`, `script.js`, `README.md`)
3. Go to **Settings → Pages**
4. Under **Branch**, select `main` → click **Save**
5. Your app will be live at:
   
   https://yasirshaikh03.github.io/Spendly/
   

### Option 2 — Run Locally

No setup needed! Just:
```bash
# Clone or download the repo
git clone https://github.com/your-username/spendly.git

# Open in browser
open index.html
```
Or simply double-click `index.html` in your file explorer.

---

## 🛠️ How It Works

| File | Responsibility |
|------|---------------|
| `index.html` | Page structure, form inputs, list container, chart canvas |
| `style.css` | CSS variables, layout, animations, responsive breakpoints |
| `script.js` | State management, CRUD operations, chart drawing, localStorage |

### Data Storage
Transactions are saved in the browser's `localStorage` under the key `spendly_txs` as a JSON array. Data persists until the user clears browser storage.

### Chart
The donut chart is drawn using the native **HTML5 Canvas API** — no external chart library required.

---

## 🎨 Customization

### Change Currency Symbol
In `script.js`, find the `fmt()` function and replace `₹` with your currency:
```js
function fmt(n) {
  return '$' + n.toLocaleString(...); // ← change ₹ to $, €, £, etc.
}
```

### Add a New Category
In `index.html`, add an `<option>` inside the `#category` select:
```html
<option value="✈️ Travel">✈️ Travel</option>
```
Then in `script.js`, add a color for it in `CAT_COLORS`:
```js
'✈️ Travel': '#0077b6',
```

### Change Theme Colors
Edit the CSS variables at the top of `style.css`:
```css
:root {
  --bg:    #f5f0e8;  /* Page background */
  --ink:   #1a1712;  /* Primary dark color */
  --green: #2d6a4f;  /* Income color */
  --red:   #c1121f;  /* Expense color */
}
```

---

## 📸 Screenshots

<img width="1894" height="905" alt="image" src="https://github.com/user-attachments/assets/da9d273b-05e0-46e7-a966-6dcab1898924" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/df7c83c1-df37-4bf1-9357-50db3a55814f" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ea670b4d-ae87-4fd1-9a4d-6d92e80b14e0" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/0e35e1c2-ba54-4b67-ab91-5e2b98d95fd5" />





---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙌 Credits

## Author

Yasir Shaikh
GitHub: https://github.com/YasirShaikh03


Built with:
- [Syne](https://fonts.google.com/specimen/Syne) & [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) — Google Fonts
- HTML5 Canvas API — for the donut chart
- No other dependencies!
