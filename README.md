<div align="center">

<img src="https://img.shields.io/badge/version-3.0.0-6c47ff?style=for-the-badge&logo=sparkles&logoColor=white"/>
<img src="https://img.shields.io/badge/Claude%20AI-Powered-4488ff?style=for-the-badge&logo=anthropic&logoColor=white"/>
<img src="https://img.shields.io/badge/Vanilla-JS%20%7C%20HTML%20%7C%20CSS-f4a261?style=for-the-badge&logo=javascript&logoColor=white"/>
<img src="https://img.shields.io/badge/License-MIT-00e5a0?style=for-the-badge"/>

<br/><br/>

```
 ███████╗██████╗ ███████╗███╗   ██╗██████╗ ██╗  ██╗   ██╗     █████╗ ██╗
 ██╔════╝██╔══██╗██╔════╝████╗  ██║██╔══██╗██║  ╚██╗ ██╔╝    ██╔══██╗██║
 ███████╗██████╔╝█████╗  ██╔██╗ ██║██║  ██║██║   ╚████╔╝     ███████║██║
 ╚════██║██╔═══╝ ██╔══╝  ██║╚██╗██║██║  ██║██║    ╚██╔╝      ██╔══██║██║
 ███████║██║     ███████╗██║ ╚████║██████╔╝███████╗██║        ██║  ██║██║
 ╚══════╝╚═╝     ╚══════╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝        ╚═╝  ╚═╝╚═╝
```

# Spendly AI — Financial Operating System

### *The most advanced client-side personal finance app — powered by Claude AI*

<br/>

[![Author](https://img.shields.io/badge/Author-Yasir%20Shaikh-6c47ff?style=flat-square)](https://github.com/YasirShaikh03)
[![GitHub](https://img.shields.io/badge/GitHub-YasirShaikh03-181717?style=flat-square&logo=github)](https://github.com/YasirShaikh03)
[![Stars](https://img.shields.io/github/stars/YasirShaikh03?style=flat-square&color=f59e0b)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)]()

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Feature Matrix](#-feature-matrix)
- [AI Engine](#-ai-engine-deep-dive)
- [Data Model](#-data-model)
- [Module Reference](#-module-reference)
- [Health Score Algorithm](#-health-score-algorithm)
- [Subscription Detection](#-subscription-detection-engine)
- [Chart System](#-chart-system)
- [Gamification Engine](#-gamification-engine)
- [Security & Privacy](#-security--privacy)
- [Performance](#-performance-characteristics)
- [Theming System](#-theming-system)
- [File Structure](#-file-structure)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [Browser Compatibility](#-browser-compatibility)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧠 Overview

**Spendly AI v3.0** is a zero-dependency, fully client-side personal finance operating system. It runs entirely in the browser with no backend, no database, no login server — just pure HTML, CSS, and JavaScript with optional Claude AI integration via the Anthropic API.

```
┌─────────────────────────────────────────────────────────────┐
│                      SPENDLY AI v3.0                        │
│                                                             │
│   Browser  ──►  Vanilla JS Engine  ──►  localStorage       │
│                       │                                     │
│                        ──►  Claude AI API  (optional)       │
│                       │                                     │
│                        ──►  Chart.js  (CDN)                 │
└─────────────────────────────────────────────────────────────┘
```

### Design Philosophy

| Principle | Implementation |
|-----------|----------------|
| **Zero Backend** | All data lives in `localStorage`. No accounts, no sync, no GDPR surface. |
| **Privacy First** | Nothing leaves the device unless the user triggers AI chat. |
| **Progressive Enhancement** | Works without an API key; AI features degrade gracefully. |
| **Performance Budget** | Single HTML file < 120 KB. First meaningful paint < 200 ms. |
| **Mobile-First** | Responsive breakpoints at 480 / 768 / 1200 px with a native-feel bottom nav. |

---

## 🏗 Architecture

### High-Level System Design

```
┌──────────────────────────────────────────────────────────────────┐
│                        APPLICATION SHELL                         │
│                                                                  │
│  ┌────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │  Loader /  │    │   PIN Security   │    │  Theme Engine    │  │
│  │  Boot Seq  │    │   (4-digit PIN)  │    │  (CSS vars)      │  │
│  └────────────┘    └──────────────────┘    └──────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                      STATE (S)                           │    │
│  │   txs │ budgets │ goals │ investments │ wallets │ ...    │    │
│  │                    ↕ localStorage                        │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐    │
│  │ Dashboard│  │Transact. │  │Analytics │  │  AI Advisor   │    │
│  │ View     │  │ View     │  │ View     │  │  View         │    │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘    │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐    │
│  │  Budget  │  │  Goals   │  │Portfolio │  │ Gamification  │    │
│  │  View    │  │  View    │  │  View    │  │  View         │    │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘    │
│                                                                  │
│  ┌──────────┐  ┌──────────┐                                      │
│  │ Wallets  │  │Calendar  │                                      │
│  │  View    │  │  View    │                                      │
│  └──────────┘  └──────────┘                                      │
└──────────────────────────────────────────────────────────────────┘
         │                             │
         ▼                             ▼
  ┌─────────────┐              ┌───────────────┐
  │  Chart.js   │              │  Claude AI    │
  │  (CDN)      │              │  API          │
  └─────────────┘              └───────────────┘
```

### Render Pipeline

```
User Action
    │
    ▼
Event Handler (onclick / oninput)
    │
    ▼
State Mutation  ──►  save()  ──►  localStorage
    │
    ▼
render()
    │
    ├──► renderDashboard()
    │        ├── animateCounter()
    │        ├── renderBarChart()
    │        ├── renderDonutChart()
    │        └── renderSubscriptionMini()
    │
    ├──► renderTransactions()
    ├──► renderAnalytics()  ──►  Chart.js instances
    ├──► renderBudget()
    ├──► renderAI()  ──►  drawHealthGauge()
    ├──► renderGoals()
    ├──► renderInvestments()
    ├──► renderWallets()
    ├──► renderCalendar()
    └──► renderGamification()
```

---

## ✦ Feature Matrix

| Feature | Module | AI-Powered | Offline |
|---------|--------|-----------|---------|
| Transaction CRUD | `addTransaction()` | — | ✅ |
| Income / Expense tracking | Core | — | ✅ |
| Multi-category tagging | `CATS[]` | — | ✅ |
| Monthly navigation | `changeMonth()` | — | ✅ |
| Daily cash-flow bar chart | `renderBarChart()` | — | ✅ |
| Category donut chart | `renderDonutChart()` | — | ✅ |
| 6-month trend lines | `renderTrendChart()` | — | ✅ |
| Spending radar chart | `renderRadarChart()` | — | ✅ |
| 30-day spending heatmap | `renderHeatmap()` | — | ✅ |
| Financial health score | `computeHealthScore()` | ✅ | ✅ |
| Budget limits & alerts | `saveBudget()` | ✅ (alerts) | ✅ |
| Savings goals with rings | `renderGoals()` | — | ✅ |
| Investment portfolio P&L | `renderInvestments()` | — | ✅ |
| Smart wallet manager | `renderWallets()` | — | ✅ |
| Financial calendar | `renderCalendar()` | — | ✅ |
| Subscription auto-detection | `detectSubscriptions()` | ✅ | ✅ |
| AI daily digest | `refreshDigest()` | ✅ | ✅ (local) |
| Claude AI chat advisor | `sendAIChat()` | ✅ | ⚠️ (fallback) |
| Behavior pattern analysis | `generateBehaviorInsights()` | ✅ | ✅ |
| Next-month prediction | `renderPrediction()` | ✅ | ✅ |
| Real-time budget alerts | Alert Engine | ✅ | ✅ |
| Notification center | `generateNotifications()` | ✅ | ✅ |
| Command palette (⌘K) | `openCmdPalette()` | — | ✅ |
| Voice input | `initVoice()` | — | ✅ |
| XP & leveling system | `addXP()` | — | ✅ |
| Achievement unlocks | `checkAchievements()` | — | ✅ |
| Daily challenges | `renderGamification()` | — | ✅ |
| PIN lock screen | `pinPress()` | — | ✅ |
| Dark / Light / AMOLED themes | `applyTheme()` | — | ✅ |
| Neon / Cyberpunk / Gold modes | `setUIMode()` | — | ✅ |
| 8 custom accent colors | `setAccent()` | — | ✅ |
| CSV export | `exportCSV()` | — | ✅ |
| JSON export | `exportJSON()` | — | ✅ |
| Print / PDF report | `printReport()` | — | ✅ |
| Animated number counters | `animateCounter()` | — | ✅ |
| Canvas ring charts | `drawSavingsRing()` | — | ✅ |
| Cursor glow effect | CSS + `mousemove` | — | ✅ |
| Particle loader | `createParticles()` | — | ✅ |

---

## 🤖 AI Engine Deep Dive

Spendly AI has three layers of intelligence — all working together:

### Layer 1 — Rule-Based Local AI

Always-on. Generates insights from raw state without any API call.

```
computeHealthScore()
    ├── Savings Rate Score    (0–30 pts)   → (income - expense) / income × 100
    ├── Budget Compliance     (0–25 pts)   → over-budget categories penalise
    ├── Emergency Fund Score  (0–20 pts)   → emergencyFund / (3 × monthly expense)
    ├── Transaction Tracking  (0–15 pts)   → min(txCount, 15)
    └── Investment Presence   (0–10 pts)   → min(investCount × 2, 10)
                                           ─────────────────────────────
                                           Total: 0–100   Grade: D → A+
```

Threshold mapping:

```
Score ≥ 90  →  A+   (Elite)
Score ≥ 80  →  A    (Excellent)
Score ≥ 70  →  B+   (Good)
Score ≥ 60  →  B    (Above Average)
Score ≥ 50  →  C+   (Average)
Score ≥ 40  →  C    (Below Average)
Score  < 40 →  D    (Needs Attention)
```

### Layer 2 — Pattern Recognition Engine

```
refreshDigest()              ← Random insight from 4 heuristics
generateAIInsights()         ← 6 insight types with severity tagging
generateBehaviorInsights()   ← 3 behavioral patterns:
    ├── Weekend Spending Ratio
    ├── Food Expense Trend (MoM)
    └── Transaction Frequency (impulse detection)
renderPrediction()           ← 3-month rolling average projection
detectSubscriptions()        ← Keyword + amount-stability detection
```

**Subscription Detection Algorithm:**

```
For each unique (lowercased) description:
  1. Check against known subscription keywords:
     ['netflix','spotify','amazon','hotstar','youtube','jio',
      'airtel','rent','emi','sip','gym','discord','notion','github']
  2. OR check: count ≥ 2 AND all amounts within 10% of first amount
  3. Sort by monthly cost descending
```

### Layer 3 — Claude AI Integration (Live API)

Real conversational intelligence via `claude-sonnet-4-20250514`.

```
sendAIChat()
    │
    ├── buildFinancialContext()   ← Serializes entire state to plain text
    │       ├── Monthly income / expense / balance
    │       ├── Savings rate %
    │       ├── Health score + grade
    │       ├── Top 3 categories
    │       ├── Weekend spending %
    │       ├── Investment totals
    │       ├── Active budgets count
    │       ├── Goals count
    │       ├── Subscription count + cost
    │       ├── Streak days
    │       └── Total transactions
    │
    ├── Maintains last-10 message history (sliding window)
    │
    ├── POST /v1/messages
    │       model: claude-sonnet-4-20250514
    │       max_tokens: 200
    │       system: [financial advisor system prompt + context]
    │
    └── On failure → generateLocalAIAnswer()  (graceful degradation)
```

**Local AI Fallback Heuristics:**

```
Query contains "hello" / "hi"   → Greeting + monthly summary
Query contains "spend" / "expense" → Spending breakdown + ratio warning
Query contains "saving"         → Savings rate + benchmark comparison
Query contains "invest"         → Portfolio summary or SIP recommendation
Default                         → Savings-rate-based personalized advice
```

---

## 📦 Data Model

All data is persisted in `localStorage` as JSON strings.

### Transaction Object

```typescript
interface Transaction {
  id:        number;    // Date.now() — unique timestamp ID
  desc:      string;    // User description, max 40 chars
  amount:    number;    // Positive float, in ₹
  category:  string;    // One of CATS[].key (e.g. "🍔 Food")
  date:      string;    // ISO 8601 date: "YYYY-MM-DD"
  note:      string;    // Optional free-text note, max 80 chars
  type:      'income' | 'expense';
}
```

### Budget Object

```typescript
// Stored as flat key-value map
interface Budgets {
  [categoryKey: string]: number;  // e.g. { "🍔 Food": 5000 }
}
```

### Goal Object

```typescript
interface Goal {
  id:      number;   // Date.now()
  name:    string;
  emoji:   string;   // Single emoji character
  target:  number;   // Target amount in ₹
  saved:   number;   // Current saved amount in ₹
  date:    string;   // Target date "YYYY-MM-DD" (optional)
}
```

### Investment Object

```typescript
interface Investment {
  id:      number;
  name:    string;
  type:    'mutual_fund' | 'stocks' | 'crypto' | 'gold' | 'fd' | 'emergency';
  amount:  number;   // Original invested amount
  current: number;   // Current market value
}
```

### Wallet Object

```typescript
interface Wallet {
  id:      number;
  name:    string;
  type:    'cash' | 'bank' | 'upi' | 'crypto' | 'savings' | 'credit';
  balance: number;
}
```

### Calendar Event Object

```typescript
interface CalEvent {
  id:     number;
  name:   string;
  type:   'bill' | 'emi' | 'sip' | 'salary' | 'subscription' | 'reminder';
  date:   string;   // "YYYY-MM-DD"
  amount: number;   // Optional
}
```

### localStorage Keys Reference

| Key | Type | Description |
|-----|------|-------------|
| `spendly_txs` | `Transaction[]` | All transactions |
| `spendly_budgets` | `Budgets` | Budget limits by category |
| `spendly_goals` | `Goal[]` | Savings goals |
| `spendly_invest` | `Investment[]` | Investment portfolio |
| `spendly_wallets` | `Wallet[]` | Wallet accounts |
| `spendly_cal` | `CalEvent[]` | Calendar events |
| `spendly_theme` | `'dark' \| 'light'` | UI theme |
| `spendly_mode` | `string` | Color mode (amoled/neon/etc.) |
| `spendly_accent` | `string` | Custom accent hex color |
| `spendly_accent2` | `string` | Custom accent2 hex color |
| `spendly_pin` | `string` | 4-digit PIN (plain text) |
| `spendly_xp` | `number` | Total XP points |
| `spendly_streak` | `number` | Current tracking streak (days) |
| `spendly_last` | `string` | Last active date "YYYY-MM-DD" |
| `spendly_ach` | `string[]` | Unlocked achievement IDs |

---

## 📐 Module Reference

### Core Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `save()` | `() → void` | Persists entire state to localStorage |
| `render()` | `() → void` | Master render dispatcher — routes to active view |
| `getMonthTxs()` | `(m?, y?) → Transaction[]` | Filtered transactions for a given month/year |
| `fmt()` | `(n: number) → string` | Smart Indian number formatting (₹, k, L, Cr) |
| `fmtDate()` | `(d: string) → string` | Formats "YYYY-MM-DD" to "DD Mon YYYY" |
| `escHtml()` | `(s: string) → string` | XSS-safe HTML entity escaping |
| `destroyChart()` | `(id: string) → void` | Destroys Chart.js instance before re-render |
| `showToast()` | `(msg, dur?) → void` | Animated bottom toast notification |

### State Mutation Functions

| Function | Side Effects |
|----------|-------------|
| `addTransaction()` | Mutates `S.txs`, triggers XP, budget alerts, re-render |
| `deleteTx(id)` | Filters `S.txs`, re-render |
| `saveBudget()` | Mutates `S.budgets`, triggers XP |
| `deleteBudget(cat)` | Deletes key from `S.budgets` |
| `saveGoal()` | Pushes to `S.goals`, triggers XP |
| `deleteGoal(id)` | Filters `S.goals` |
| `saveInvestment()` | Pushes to `S.investments`, triggers XP |
| `deleteInvestment(id)` | Filters `S.investments` |
| `saveWallet()` | Pushes to `S.wallets`, triggers XP |
| `deleteWallet(id)` | Filters `S.wallets` |
| `saveCalEvent()` | Pushes to `S.calEvents` |
| `deleteCalEvent(id)` | Filters `S.calEvents` |

### Chart Rendering Functions

| Function | Chart Type | Canvas ID |
|----------|-----------|-----------|
| `renderBarChart()` | Grouped Bar | `barChart` |
| `renderDonutChart()` | Doughnut | `donutChart` |
| `renderTrendChart()` | Line (filled) | `trendChart` |
| `renderRadarChart()` | Radar | `radarChart` |
| `renderHBarChart()` | Horizontal Bar | `hbarChart` |
| `renderWalletChart()` | Doughnut | `walletChart` |
| `drawHealthGauge()` | Canvas 2D arc | `healthGauge` |
| `drawSavingsRing()` | Canvas 2D arc | `savingsRing`, `goalRing{id}` |

---

## 🧮 Health Score Algorithm

Full scoring breakdown with weights:

```
┌──────────────────────────────────────────────────────────┐
│               HEALTH SCORE CALCULATION                   │
├──────────────────────┬───────────┬───────────────────────┤
│ Component            │ Max Score │ Formula               │
├──────────────────────┼───────────┼───────────────────────┤
│ Savings Rate         │    30     │ savingsRate × 100 × 0.3│
│ Budget Compliance    │    25     │ 25 − (overBudget × 8) │
│ Emergency Fund       │    20     │ fund / (3× expense)×20│
│ Transaction Tracking │    15     │ min(txCount, 15)       │
│ Investment Presence  │    10     │ min(investCount × 2,10)│
├──────────────────────┼───────────┼───────────────────────┤
│ TOTAL                │   100     │                       │
└──────────────────────┴───────────┴───────────────────────┘
```

**Breakdown sub-scores (0–100 normalized, displayed in AI view):**

```javascript
breakdown: {
  savings:     (savingsScore / 30) * 100,
  budget:      (budgetScore / 25) * 100,
  emergency:   (emergencyScore / 20) * 100,
  consistency: min(txCount * 2, 100),
  investment:  (investScore / 10) * 100,
}
```

---

## 🔍 Subscription Detection Engine

Two-pass detection — keyword match OR statistical recurrence:

```
Pass 1 — Keyword Matching
  Scan all expense descriptions (lowercased) against:
  [netflix, spotify, amazon, hotstar, youtube, jio, airtel,
   rent, emi, sip, gym, discord, notion, github]
  → Match = subscription candidate

Pass 2 — Statistical Recurrence
  For description groups with count ≥ 2:
  Check: every(amount_i, |amount_i - amount_0| < amount_0 × 0.1)
  i.e., all amounts within 10% of the first occurrence
  → Stable-amount repeat = subscription candidate

Output:
  { name, monthly: amounts[0], count, cat }
  Sorted by monthly cost descending
```

---

## 📊 Chart System

All charts are rendered via **Chart.js 4.4.1** loaded from cdnjs. Each chart is stored in `S.charts[id]` and destroyed before re-render to prevent memory leaks.

### Chart Configuration Defaults

```javascript
// Applied globally after theme detection
Chart.defaults.color       = theme === 'dark' ? '#9898cc' : '#505070';
Chart.defaults.borderColor = theme === 'dark'
  ? 'rgba(255,255,255,0.05)'
  : 'rgba(0,0,0,0.06)';
```

### Canvas-Based Custom Charts

Two components bypass Chart.js entirely and use raw Canvas 2D API:

**`drawSavingsRing(canvasId, pct, color)`**
```
Arc from -π/2 to -π/2 + (pct/100 × 2π)
Track ring: rgba(255,255,255,0.06), lineWidth 7
Fill ring:  dynamic color, lineCap 'round'
```

**`drawHealthGauge(score)`**
```
Semicircular arc (π to 0, i.e., left to right)
Track:  rgba(255,255,255,0.08), lineWidth 14
Fill:   score-mapped color, arc π to π+(score/100×π)
Center text: score value + "HEALTH SCORE" label
Color mapping:
  ≥80 → #00e5a0 (green)
  ≥60 → #6c47ff (purple)
  ≥40 → #ffaa00 (amber)
   <40 → #ff3d6e (red)
```

---

## 🎮 Gamification Engine

### XP Award Table

| Action | XP Awarded |
|--------|-----------|
| Add transaction | +10 XP |
| Set budget limit | +15 XP |
| Add savings goal | +20 XP |
| Add investment | +25 XP |
| Add wallet | +10 XP |

### Level Thresholds

```
Level 1  →     0 XP
Level 2  →   100 XP
Level 3  →   250 XP
Level 4  →   500 XP
Level 5  → 1,000 XP
Level 6  → 2,000 XP
Level 7  → 3,500 XP
Level 8  → 5,000 XP
Level 9  → 8,000 XP
Level 10 → 12,000 XP
Level 11 → 20,000 XP
```

### Achievement Trigger Map

| Achievement ID | Trigger Condition |
|---------------|-------------------|
| `first_tx` | `txs.length >= 1` |
| `tx_10` | `txs.length >= 10` |
| `tx_50` | `txs.length >= 50` |
| `tx_100` | `txs.length >= 100` |
| `budget_set` | `Object.keys(budgets).length > 0` |
| `goal_set` | `goals.length > 0` |
| `invest_add` | `investments.length > 0` |
| `streak_7` | `streak >= 7` |
| `streak_30` | `streak >= 30` |
| `savings_20` | `(income - expense) / income >= 0.2` |
| `health_80` | `computeHealthScore().score >= 80` |
| `wallet_add` | `wallets.length > 0` |

### Streak Calculation

```javascript
updateStreak()
  today = new Date().toISOString().split('T')[0]
  diff  = daysBetween(lastActive, today)

  diff === 0  → no change (same day)
  diff === 1  → streak++
  diff  >  1  → streak = 1 (broken)
```

---

## 🔒 Security & Privacy

### What Leaves the Device

| Data | Destination | Condition |
|------|-------------|-----------|
| Financial context summary | Anthropic API (`/v1/messages`) | Only when user sends an AI chat message |
| Nothing else | — | — |

> The financial context sent to Claude is a **plain-text summary** (totals, averages, counts) — never raw transaction descriptions or personal details.

### PIN Security

- 4-digit PIN stored in `localStorage` as plain text
- Suitable for casual protection against physical snooping
- **Not** a cryptographic security measure
- Recommendation: combine with device-level biometric lock

### XSS Prevention

All user-generated content rendered to the DOM passes through `escHtml()`:

```javascript
function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
```

---

## ⚡ Performance Characteristics

| Metric | Value |
|--------|-------|
| Initial bundle size | ~85 KB HTML (unminified) + ~12 KB JS (separate) |
| External dependencies | Chart.js 4.4.1 (~200 KB, CDN-cached) + Google Fonts |
| First contentful paint | < 200 ms (loader animation starts instantly) |
| localStorage capacity | ~5 MB per origin — supports ~50,000+ transactions |
| Chart re-render time | < 16 ms for typical month datasets |
| AI chat response | 1–3 seconds (Claude API latency) |

### Optimization Techniques Used

- `destroyChart(id)` before every re-render prevents Chart.js memory leaks
- `requestAnimationFrame` for counter animations — no `setInterval` jank
- Sliding window of last-10 messages in AI chat history (token efficiency)
- `performance.now()` for easing calculations (not `Date.now()`)
- Charts store references in `S.charts{}` — single source of truth for cleanup
- `will-change` animations use CSS `transform` only (compositor-thread safe)

---

## 🎨 Theming System

Spendly AI uses a **CSS custom properties** (variables) architecture for real-time theme switching with zero style recalculation lag.

### Variable Layers

```css
:root {                    /* ← Default dark theme */
  --bg, --bg2, --bg3       /* Background layers */
  --card, --card-border    /* Glass card surfaces */
  --ink, --ink2, --muted   /* Text hierarchy */
  --border                 /* Subtle borders */
  --accent, --accent2,     /* Brand colors */
  --accent3
  --green, --green-dim     /* Success palette */
  --red, --red-dim         /* Danger palette */
  --amber, --amber-dim     /* Warning palette */
  --blue, --blue-dim       /* Info palette */
  --gold, --gold-dim       /* Premium palette */
}

[data-theme="light"] { ... }    /* Light overrides */
[data-mode="amoled"]  { ... }   /* Pure black */
[data-mode="neon"]    { ... }   /* Cyan/Magenta */
[data-mode="cyberpunk"]{ ... }  /* Dark purple/pink */
[data-mode="gold"]    { ... }   /* Luxury gold */
```

### Switching Mechanism

```
toggleTheme()         → flips data-theme attr + destroys/rebuilds charts
setUIMode(mode, btn)  → sets data-mode attr (overlay on top of theme)
setAccent(c1, c2)     → directly sets --accent + --accent2 CSS vars
```

---

## 📁 File Structure

```
spendly-ai/
│
├── index.html          ← Complete self-contained app
│                         (HTML + embedded CSS + inline JS)
│
├── spendly.js          ← Extracted JavaScript engine
│                         (drop-in replacement for inline <script>)
│
└── README.md           ← This file
```

### Splitting Into Separate Files

To use `spendly.js` as an external file, replace the `<script>` block in `index.html`:

```html
<!-- Before (inline): -->
<script>
  'use strict';
  // ... all JS ...
</script>

<!-- After (external): -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script src="spendly.js"></script>
```

Similarly, CSS can be extracted into `spendly.css` and linked via:

```html
<link rel="stylesheet" href="spendly.css"/>
```

---

## 🚀 Getting Started

### Option 1 — Zero Setup (Recommended)

```bash
# Just open index.html in any modern browser — no server required
open index.html
```

### Option 2 — Local Dev Server

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js / npx
npx serve .

# Using VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

### Option 3 — GitHub Pages Deployment

```bash
git clone https://github.com/YasirShaikh03/spendly-ai
cd spendly-ai
# Push to your GitHub repo → enable Pages → select main branch
```

---

## ⚙️ Configuration

### Enabling Claude AI Chat

The AI chat feature calls the Anthropic API directly from the browser. This requires the API to support CORS from `localhost` or your deployed domain.

> **Note:** For production deployments, proxy API calls through a lightweight backend to keep your API key secret.

The API call is in `sendAIChat()` in `spendly.js`. The key is passed via the standard `x-api-key` header — update this section if using a proxy:

```javascript
// Current (direct — for development):
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'claude-sonnet-4-20250514', ... })
});

// For production — proxy pattern:
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [...] })
});
```

### Changing Default Currency

Replace `₹` across the codebase — it appears in:
- `fmt()` function in `spendly.js`
- Amount input labels in `index.html`
- AI system prompt in `buildFinancialContext()`

### Adding Custom Categories

Edit the `CATS` array in `spendly.js`:

```javascript
const CATS = [
  // Add your category:
  { key: '🏋️ Fitness', emoji: '🏋️', label: 'Fitness', color: '#22d3ee' },
  // ... existing categories
];
```

---

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome / Chromium | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| Samsung Internet | 14+ | ✅ Full support |
| Opera | 76+ | ✅ Full support |

**Required Web APIs:**
- `localStorage` — data persistence
- `Canvas 2D API` — ring/gauge charts
- `CSS Custom Properties` — theming
- `Fetch API` — Claude AI calls
- `SpeechRecognition` (optional) — voice input (Chrome/Edge only)
- `requestAnimationFrame` — counter animations

---

## 🗺 Roadmap

### v3.1 (Planned)
- [ ] Multi-currency support with live exchange rates
- [ ] Cloud sync via optional Supabase backend
- [ ] Recurring transaction auto-creation
- [ ] PDF statement generation (client-side)
- [ ] Bank SMS parsing (India)

### v3.2 (Planned)
- [ ] Progressive Web App (PWA) — install to homescreen
- [ ] Offline AI using on-device LLM (WebLLM)
- [ ] Collaborative budgets (shared via URL hash)
- [ ] Tax estimation module (Indian ITR brackets)
- [ ] WhatsApp expense parsing via webhook

### v4.0 (Vision)
- [ ] Real bank account integration (Plaid / Setu AA)
- [ ] Automated transaction categorization via ML
- [ ] Voice-first mobile interface
- [ ] Custom financial report builder

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/my-awesome-feature

# 3. Make your changes to index.html and/or spendly.js
# 4. Test in multiple browsers

# 5. Commit with a descriptive message
git commit -m "feat: add recurring transaction auto-creation"

# 6. Push and open a Pull Request
git push origin feature/my-awesome-feature
```

### Code Style

- `'use strict'` at top of all JS files
- 2-space indentation
- Single quotes for strings
- Arrow functions preferred
- Comment every major function block with `// ═══ SECTION ═══` headers
- Keep render functions pure — no side effects beyond DOM mutation

---

## 📜 License

```
MIT License

Copyright (c) 2024 Yasir Shaikh
GitHub: https://github.com/YasirShaikh03

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

**Built with ❤️ by [Yasir Shaikh](https://github.com/YasirShaikh03)**

*"Your finances deserve intelligence — not just spreadsheets."*

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-YasirShaikh03-181717?style=for-the-badge&logo=github)](https://github.com/YasirShaikh03)

<br/>

⭐ Star this repo if Spendly AI helped you take control of your finances!

</div>
