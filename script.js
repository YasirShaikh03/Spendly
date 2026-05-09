/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║       SPENDLY AI v3.0 — app.js                             ║
 * ║       Author: Shaikh Yasir                                  ║
 * ║       GitHub: https://github.com/YasirShaikh03             ║
 * ║       Powered by Claude AI (Anthropic)                     ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

'use strict';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS & LOOKUP TABLES
// ═══════════════════════════════════════════════════════════════

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const CATS = [
  {key:'🍔 Food',      emoji:'🍔', label:'Food',         color:'#f4a261'},
  {key:'🚌 Transport', emoji:'🚌', label:'Transport',    color:'#4d9fff'},
  {key:'🛍️ Shopping',  emoji:'🛍️', label:'Shopping',     color:'#ff4d6a'},
  {key:'🏥 Health',    emoji:'🏥', label:'Health',       color:'#00d48c'},
  {key:'🎬 Entertainment',emoji:'🎬',label:'Entertainment',color:'#c77dff'},
  {key:'📚 Education', emoji:'📚', label:'Education',    color:'#5b8def'},
  {key:'🏠 Housing',   emoji:'🏠', label:'Housing',      color:'#ffb340'},
  {key:'💼 Salary',    emoji:'💼', label:'Salary',       color:'#00d48c'},
  {key:'💰 Other Income',emoji:'💰',label:'Other Income', color:'#7c5cfc'},
  {key:'📦 Other',     emoji:'📦', label:'Other',        color:'#a0a0c0'},
];

const CAT_COLOR = Object.fromEntries(CATS.map(c => [c.key, c.color]));
const CAT_EMOJI = Object.fromEntries(CATS.map(c => [c.key, c.emoji]));

const INVEST_ICONS  = {mutual_fund:'📈',stocks:'📊',crypto:'🪙',gold:'🥇',fd:'🏦',emergency:'🛡️'};
const INVEST_LABELS = {mutual_fund:'Mutual Fund/SIP',stocks:'Stocks',crypto:'Crypto',gold:'Gold',fd:'Fixed Deposit',emergency:'Emergency Fund'};
const WALLET_ICONS  = {cash:'💵',bank:'🏦',upi:'📲',crypto:'🪙',savings:'💰',credit:'💳'};
const WALLET_COLORS = {
  cash:'linear-gradient(135deg,#16a34a,#15803d)',
  bank:'linear-gradient(135deg,#1d4ed8,#1e40af)',
  upi:'linear-gradient(135deg,#7c3aed,#6d28d9)',
  crypto:'linear-gradient(135deg,#b45309,#92400e)',
  savings:'linear-gradient(135deg,#0f766e,#0d9488)',
  credit:'linear-gradient(135deg,#be123c,#9f1239)',
};
const CAL_ICONS = {bill:'💡',emi:'🏠',sip:'📈',salary:'💼',subscription:'🔄',reminder:'🔔'};

const ALL_ACHIEVEMENTS = [
  {id:'first_tx',   emoji:'🌱', name:'First Step',       desc:'Log your first transaction',       xp:50},
  {id:'tx_10',      emoji:'📊', name:'Tracker',          desc:'Log 10 transactions',              xp:100},
  {id:'tx_50',      emoji:'🔥', name:'On Fire',          desc:'Log 50 transactions',              xp:250},
  {id:'tx_100',     emoji:'💎', name:'Diamond Tracker',  desc:'Log 100 transactions',             xp:500},
  {id:'budget_set', emoji:'🎯', name:'Budget Master',    desc:'Set your first budget',            xp:75},
  {id:'goal_set',   emoji:'🏆', name:'Goal Setter',      desc:'Set your first savings goal',      xp:100},
  {id:'invest_add', emoji:'📈', name:'Investor',         desc:'Add your first investment',        xp:150},
  {id:'streak_7',   emoji:'🔥', name:'Week Warrior',     desc:'7-day tracking streak',            xp:200},
  {id:'streak_30',  emoji:'⚡', name:'Monthly Champion', desc:'30-day tracking streak',           xp:500},
  {id:'savings_20', emoji:'💰', name:'Saver Pro',        desc:'Achieve 20% savings rate',         xp:300},
  {id:'health_80',  emoji:'🌟', name:'Financial Fit',    desc:'Reach health score 80+',           xp:400},
  {id:'wallet_add', emoji:'👜', name:'Multi-Wallet',     desc:'Add your first wallet',            xp:75},
];

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════

const ls = (k) => localStorage.getItem(k);

let S = {
  txs:           JSON.parse(ls('spendly_txs')     || '[]'),
  budgets:       JSON.parse(ls('spendly_budgets') || '{}'),
  goals:         JSON.parse(ls('spendly_goals')   || '[]'),
  investments:   JSON.parse(ls('spendly_invest')  || '[]'),
  wallets:       JSON.parse(ls('spendly_wallets') || '[]'),
  calEvents:     JSON.parse(ls('spendly_cal')     || '[]'),
  theme:         ls('spendly_theme')  || 'dark',
  uiMode:        ls('spendly_mode')   || 'default',
  pin:           ls('spendly_pin')    || '',
  xp:            parseInt(ls('spendly_xp')     || '0'),
  streak:        parseInt(ls('spendly_streak') || '0'),
  lastActive:    ls('spendly_last') || '',
  achievements:  JSON.parse(ls('spendly_ach') || '[]'),
  notifications: [],
  currentType:   'expense',
  currentFilter: 'All',
  currentMonth:  new Date().getMonth(),
  currentYear:   new Date().getFullYear(),
  currentView:   'dashboard',
  selectedCat:   CATS[0].key,
  editingId:     null,
  charts:        {},
  pinBuffer:     '',
  calDisplayMonth: new Date().getMonth(),
  calDisplayYear:  new Date().getFullYear(),
  aiChatHistory: [],
};

function save() {
  localStorage.setItem('spendly_txs',     JSON.stringify(S.txs));
  localStorage.setItem('spendly_budgets', JSON.stringify(S.budgets));
  localStorage.setItem('spendly_goals',   JSON.stringify(S.goals));
  localStorage.setItem('spendly_invest',  JSON.stringify(S.investments));
  localStorage.setItem('spendly_wallets', JSON.stringify(S.wallets));
  localStorage.setItem('spendly_cal',     JSON.stringify(S.calEvents));
  localStorage.setItem('spendly_xp',      S.xp);
  localStorage.setItem('spendly_streak',  S.streak);
  localStorage.setItem('spendly_last',    S.lastActive);
  localStorage.setItem('spendly_ach',     JSON.stringify(S.achievements));
}

// ═══════════════════════════════════════════════════════════════
// UTILITY HELPERS
// ═══════════════════════════════════════════════════════════════

function fmt(n) {
  if (!n && n !== 0) return '₹0';
  const abs  = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 10000000) return sign + '₹' + (abs / 10000000).toFixed(2) + 'Cr';
  if (abs >= 100000)   return sign + '₹' + (abs / 100000).toFixed(1) + 'L';
  if (abs >= 1000)     return sign + '₹' + (abs / 1000).toFixed(1) + 'k';
  return sign + '₹' + abs.toFixed(0);
}
function fmtFull(n) { if (!n && n !== 0) return '₹0'; return '₹' + Math.abs(n).toLocaleString('en-IN'); }
function fmtDate(d) { if (!d) return ''; const dt = new Date(d + 'T00:00:00'); return dt.toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'}); }
function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function destroyChart(id) { if (S.charts[id]) { S.charts[id].destroy(); delete S.charts[id]; } }
function getMonthTxs(m = S.currentMonth, y = S.currentYear) {
  return S.txs.filter(t => { const d = new Date(t.date + 'T00:00:00'); return d.getMonth() === m && d.getFullYear() === y; });
}
function showToast(msg, dur = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

// ═══════════════════════════════════════════════════════════════
// BOOT & LOADER
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('mousemove', e => {
    const g = document.getElementById('cursorGlow');
    if (g) { g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; }
  });
  bootLoader();
});

function bootLoader() {
  const steps = ['Initializing AI engine…','Loading financial data…','Calibrating health score…','Building neural analytics…','Activating premium UI…','Ready!'];
  const bar = document.getElementById('loaderBar');
  const text = document.getElementById('loaderText');
  createParticles();
  let i = 0;
  const iv = setInterval(() => {
    if (i >= steps.length) { clearInterval(iv); setTimeout(finishBoot, 300); return; }
    bar.style.width = ((i + 1) / steps.length * 100) + '%';
    text.textContent = steps[i]; i++;
  }, 380);
}

function createParticles() {
  const wrap = document.getElementById('loaderParticles'); if (!wrap) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div'); p.className = 'particle';
    p.style.cssText = `left:${Math.random()*100}%;top:${40+Math.random()*60}%;animation-delay:${Math.random()*4}s;animation-duration:${2+Math.random()*3}s;width:${2+Math.random()*4}px;height:${2+Math.random()*4}px;background:${['#6c47ff','#4488ff','#00e5a0','#a855f7','#ff3d6e'][Math.floor(Math.random()*5)]};`;
    wrap.appendChild(p);
  }
}

function finishBoot() {
  const loader = document.getElementById('loaderScreen');
  loader.style.opacity = '0';
  setTimeout(() => { loader.style.display = 'none'; checkPin(); }, 600);
}

// ═══════════════════════════════════════════════════════════════
// PIN LOCK
// ═══════════════════════════════════════════════════════════════

function checkPin() { if (S.pin) { document.getElementById('pinScreen').style.display = 'flex'; } else { launchApp(); } }

function launchApp() {
  document.getElementById('pinScreen').style.display = 'none';
  document.getElementById('appShell').style.display = 'flex';
  applyTheme(); applyUIMode(S.uiMode);
  buildCatGrid(); buildBudgetCatSelect(); setDateDefault();
  updateMonthLabels(); updateStreak(); generateNotifications();
  buildAchievements(); render(); initVoice(); refreshDigest();
  buildCmdPalette(); initAlertEngine();
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openCmdPalette(); }
    if (e.key === 'Escape') { closeModal(); closeBudgetModal(); closeGoalModal(); closeInvestModal(); closeAllPanels(); closeCmdPalette(); }
  });
}

function pinPress(val) {
  if (val === 'del') { S.pinBuffer = S.pinBuffer.slice(0, -1); updatePinDots(); return; }
  if (val === 'ok') { if (S.pinBuffer === S.pin) { launchApp(); S.pinBuffer = ''; updatePinDots(); } else { showPinError(); } return; }
  if (S.pinBuffer.length < 4) S.pinBuffer += val;
  updatePinDots();
  if (S.pinBuffer.length === 4) {
    if (S.pinBuffer === S.pin) { setTimeout(() => { launchApp(); S.pinBuffer = ''; updatePinDots(); }, 200); }
    else { setTimeout(showPinError, 200); }
  }
}
function updatePinDots() { document.querySelectorAll('#pinDots span').forEach((d, i) => d.classList.toggle('filled', i < S.pinBuffer.length)); }
function showPinError() { const el = document.getElementById('pinDots'); el.style.animation = 'shake 0.4s ease'; setTimeout(() => { el.style.animation = ''; S.pinBuffer = ''; updatePinDots(); }, 400); }
function skipPin() { launchApp(); }
function togglePin() {
  const cur = ls('spendly_pin') || '';
  if (cur) { S.pin = ''; localStorage.removeItem('spendly_pin'); showToast('PIN lock disabled 🔓'); }
  else {
    const p = prompt('Set a 4-digit PIN (blank to cancel):');
    if (p && /^\d{4}$/.test(p)) { S.pin = p; localStorage.setItem('spendly_pin', p); showToast('PIN lock enabled 🔒'); }
    else if (p) showToast('PIN must be exactly 4 digits');
  }
}

// ═══════════════════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════════════════

function applyTheme() {
  document.documentElement.setAttribute('data-theme', S.theme);
  const btn = document.getElementById('themeBtn'); if (btn) btn.textContent = S.theme === 'dark' ? '☀️' : '🌙';
  if (window.Chart) { Chart.defaults.color = S.theme === 'dark' ? '#9898cc' : '#505070'; Chart.defaults.borderColor = S.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'; }
}
function toggleTheme() {
  S.theme = S.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('spendly_theme', S.theme); applyTheme();
  Object.keys(S.charts).forEach(k => { S.charts[k]?.destroy?.(); delete S.charts[k]; }); render();
}
function applyUIMode(mode) { S.uiMode = mode; document.documentElement.setAttribute('data-mode', mode); localStorage.setItem('spendly_mode', mode); }
function setUIMode(mode, btn) {
  applyUIMode(mode);
  document.querySelectorAll('.tm-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  showToast('Theme applied ✨');
}
function setAccent(c1, c2, btn) {
  document.documentElement.style.setProperty('--accent', c1);
  document.documentElement.style.setProperty('--accent2', c2);
  localStorage.setItem('spendly_accent', c1); localStorage.setItem('spendly_accent2', c2);
  document.querySelectorAll('.ac-swatch').forEach(s => s.classList.remove('active'));
  if (btn) btn.classList.add('active');
  showToast('Accent updated 🎨');
}

// ═══════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════

function switchView(view, el) {
  S.currentView = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('view-' + view)?.classList.add('active');
  if (el) el.classList.add('active');
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay').style.display = 'none';
  render();
}
function switchViewMobile(view, btn) {
  switchView(view, document.querySelector('[data-view=' + view + ']'));
  document.querySelectorAll('.bn-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebarOverlay');
  const open = sb.classList.toggle('open');
  ov.style.display = open ? 'block' : 'none';
}
function changeMonth(dir) {
  S.currentMonth += dir;
  if (S.currentMonth > 11) { S.currentMonth = 0; S.currentYear++; }
  if (S.currentMonth < 0)  { S.currentMonth = 11; S.currentYear--; }
  updateMonthLabels(); render();
}
function updateMonthLabels() {
  const label = MONTHS[S.currentMonth] + ' ' + S.currentYear;
  const el = document.getElementById('monthLabel'); if (el) el.textContent = label;
}

// ═══════════════════════════════════════════════════════════════
// MODALS — OPEN / CLOSE
// ═══════════════════════════════════════════════════════════════

function openModal(defaultType) {
  if (defaultType) setType(defaultType, document.querySelector(`.tt-btn.${defaultType}-btn`));
  S.editingId = null;
  document.querySelector('.modal-title').textContent = 'New Transaction';
  document.getElementById('submitBtn').textContent = 'Add Transaction';
  ['desc','note'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const amtEl = document.getElementById('amount'); if (amtEl) amtEl.value = '';
  setDateDefault();
  document.getElementById('modalOverlay').classList.add('open');
  setTimeout(() => document.getElementById('desc')?.focus(), 300);
}
function openEditModal(id) {
  const tx = S.txs.find(t => t.id === id); if (!tx) return;
  S.editingId = id;
  document.querySelector('.modal-title').textContent = 'Edit Transaction';
  document.getElementById('submitBtn').textContent = 'Update Transaction';
  document.getElementById('desc').value = tx.desc;
  document.getElementById('amount').value = tx.amount;
  document.getElementById('date').value = tx.date;
  document.getElementById('note').value = tx.note || '';
  setType(tx.type, null); selectCat(tx.category);
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal(e) {
  if (e && e.target !== document.getElementById('modalOverlay')) return;
  document.getElementById('modalOverlay').classList.remove('open'); S.editingId = null;
}
function openBudgetModal()    { document.getElementById('budgetModalOverlay').classList.add('open'); document.getElementById('budgetAmt').value = ''; }
function closeBudgetModal(e)  { if (e && e.target !== document.getElementById('budgetModalOverlay')) return; document.getElementById('budgetModalOverlay').classList.remove('open'); }
function openGoalModal()      { ['goalName','goalTarget','goalSaved','goalDate'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; }); document.getElementById('goalModalOverlay').classList.add('open'); }
function closeGoalModal(e)    { if (e && e.target !== document.getElementById('goalModalOverlay')) return; document.getElementById('goalModalOverlay').classList.remove('open'); }
function openInvestModal()    { ['investName','investAmount','investCurrent'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; }); document.getElementById('investModalOverlay').classList.add('open'); }
function closeInvestModal(e)  { if (e && e.target !== document.getElementById('investModalOverlay')) return; document.getElementById('investModalOverlay').classList.remove('open'); }
function openWalletModal()    { ['walletName','walletBalance'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; }); document.getElementById('walletModalOverlay').classList.add('open'); }
function closeWalletModal(e)  { if (e && e.target !== document.getElementById('walletModalOverlay')) return; document.getElementById('walletModalOverlay').classList.remove('open'); }
function openCalEventModal()  { ['calEventName','calEventAmount'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; }); document.getElementById('calEventModalOverlay').classList.add('open'); }
function closeCalEventModal(e){ if (e && e.target !== document.getElementById('calEventModalOverlay')) return; document.getElementById('calEventModalOverlay').classList.remove('open'); }

// ═══════════════════════════════════════════════════════════════
// SIDE PANELS
// ═══════════════════════════════════════════════════════════════

function openNotifications()  { document.getElementById('notifPanel').classList.add('open');  document.getElementById('overlayBg').classList.add('show'); buildNotificationsPanel(); }
function closeNotifications() { document.getElementById('notifPanel').classList.remove('open'); document.getElementById('overlayBg').classList.remove('show'); }
function openThemePanel()     { document.getElementById('themePanel').classList.add('open'); document.getElementById('overlayBg').classList.add('show'); }
function closeThemePanel()    { document.getElementById('themePanel').classList.remove('open'); document.getElementById('overlayBg').classList.remove('show'); }
function closeAllPanels() {
  ['notifPanel','themePanel'].forEach(id => document.getElementById(id).classList.remove('open'));
  document.getElementById('overlayBg').classList.remove('show');
  document.getElementById('exportMenu').classList.remove('open');
}

// ═══════════════════════════════════════════════════════════════
// TYPE & CATEGORY
// ═══════════════════════════════════════════════════════════════

function setType(type, el) {
  S.currentType = type;
  document.querySelectorAll('.tt-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  else document.querySelector(`.tt-btn.${type}-btn`)?.classList.add('active');
}
function buildCatGrid() {
  const grid = document.getElementById('catGrid'); if (!grid) return;
  grid.innerHTML = CATS.map(c => `<button class="cat-btn ${c.key === S.selectedCat ? 'selected' : ''}" onclick="selectCat('${c.key.replace(/'/g, "\\'")}')" data-cat="${escHtml(c.key)}"><span class="cat-emoji">${c.emoji}</span><span>${c.label}</span></button>`).join('');
}
function selectCat(catKey) {
  S.selectedCat = catKey;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('selected', b.dataset.cat === catKey));
}
function setDateDefault() { const d = document.getElementById('date'); if (d) d.value = new Date().toISOString().split('T')[0]; }
function buildBudgetCatSelect() {
  const sel = document.getElementById('budgetCat'); if (!sel) return;
  sel.innerHTML = CATS.filter(c => !['💼 Salary','💰 Other Income'].includes(c.key)).map(c => `<option value="${c.key}">${c.emoji} ${c.label}</option>`).join('');
}

// ═══════════════════════════════════════════════════════════════
// CRUD — TRANSACTIONS / BUDGET / GOALS / INVESTMENTS / WALLETS / CALENDAR
// ═══════════════════════════════════════════════════════════════

function addTransaction() {
  const desc   = document.getElementById('desc').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const date   = document.getElementById('date').value;
  const note   = document.getElementById('note').value.trim();
  if (!desc)              { showToast('Enter a description ✏️'); return; }
  if (!amount || amount <= 0) { showToast('Enter a valid amount 💸'); return; }
  if (!date)              { showToast('Pick a date 📅'); return; }
  if (S.editingId) {
    const idx = S.txs.findIndex(t => t.id === S.editingId);
    if (idx !== -1) S.txs[idx] = { ...S.txs[idx], desc, amount, category: S.selectedCat, date, note, type: S.currentType };
    showToast('Updated ✅');
  } else {
    S.txs.unshift({ id: Date.now(), desc, amount, category: S.selectedCat, date, note, type: S.currentType });
    addXP(10); checkAchievements();
    showToast(S.currentType === 'expense' ? 'Expense added 💸' : 'Income added 💰');
    checkBudgetAlerts(S.selectedCat); checkBalanceAlerts();
  }
  save(); closeModal(); render();
}
function deleteTx(id) {
  if (!confirm('Delete this transaction?')) return;
  S.txs = S.txs.filter(t => t.id !== id); save(); render(); showToast('Deleted 🗑️');
}
function saveBudget() {
  const cat = document.getElementById('budgetCat').value;
  const amt = parseFloat(document.getElementById('budgetAmt').value);
  if (!amt || amt <= 0) { showToast('Enter a valid limit'); return; }
  S.budgets[cat] = amt; save(); closeBudgetModal(); render(); addXP(15); checkAchievements(); showToast('Budget set ✅');
}
function deleteBudget(cat) { delete S.budgets[cat]; save(); render(); showToast('Budget removed'); }
function saveGoal() {
  const name   = document.getElementById('goalName').value.trim();
  const emoji  = document.getElementById('goalEmoji').value;
  const target = parseFloat(document.getElementById('goalTarget').value);
  const saved  = parseFloat(document.getElementById('goalSaved').value) || 0;
  const date   = document.getElementById('goalDate').value;
  if (!name || !target) { showToast('Fill required fields ✏️'); return; }
  S.goals.push({ id: Date.now(), name, emoji, target, saved, date });
  save(); closeGoalModal(); render(); addXP(20); checkAchievements(); showToast('Goal added 🎯');
}
function deleteGoal(id) { S.goals = S.goals.filter(g => g.id !== id); save(); render(); showToast('Goal removed'); }
function saveInvestment() {
  const name    = document.getElementById('investName').value.trim();
  const type    = document.getElementById('investType').value;
  const amount  = parseFloat(document.getElementById('investAmount').value);
  const current = parseFloat(document.getElementById('investCurrent').value) || amount;
  if (!name || !amount) { showToast('Fill required fields ✏️'); return; }
  S.investments.push({ id: Date.now(), name, type, amount, current });
  save(); closeInvestModal(); render(); addXP(25); checkAchievements(); showToast('Investment added 📈');
}
function deleteInvestment(id) { S.investments = S.investments.filter(i => i.id !== id); save(); render(); showToast('Removed'); }
function saveWallet() {
  const name    = document.getElementById('walletName').value.trim();
  const type    = document.getElementById('walletType').value;
  const balance = parseFloat(document.getElementById('walletBalance').value) || 0;
  if (!name) { showToast('Enter wallet name ✏️'); return; }
  S.wallets.push({ id: Date.now(), name, type, balance });
  save(); closeWalletModal(); renderWallets(); addXP(10); checkAchievements(); showToast('Wallet added 👜');
}
function deleteWallet(id) { if (!confirm('Delete wallet?')) return; S.wallets = S.wallets.filter(w => w.id !== id); save(); renderWallets(); }
function saveCalEvent() {
  const name   = document.getElementById('calEventName').value.trim();
  const type   = document.getElementById('calEventType').value;
  const date   = document.getElementById('calEventDate').value;
  const amount = parseFloat(document.getElementById('calEventAmount').value) || 0;
  if (!name || !date) { showToast('Fill required fields ✏️'); return; }
  S.calEvents.push({ id: Date.now(), name, type, date, amount });
  save(); closeCalEventModal(); renderCalendar(); showToast('Event added 📅');
}
function deleteCalEvent(id) { S.calEvents = S.calEvents.filter(e => e.id !== id); save(); renderCalendar(); }

// ═══════════════════════════════════════════════════════════════
// HEALTH SCORE
// ═══════════════════════════════════════════════════════════════

function computeHealthScore() {
  if (S.txs.length === 0) return { score: 50, grade: 'C', breakdown: { savings: 50, stability: 50, budget: 50, emergency: 50, efficiency: 50 } };
  const monthTxs = getMonthTxs();
  const income  = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate  = income > 0 ? (income - expense) / income : 0;
  const savingsScore = Math.min(30, Math.round(savingsRate * 100 * 0.3));
  const hasBudgets   = Object.keys(S.budgets).length > 0;
  const spent = {};
  monthTxs.filter(t => t.type === 'expense').forEach(t => spent[t.category] = (spent[t.category] || 0) + t.amount);
  const overBudget   = hasBudgets ? Object.entries(S.budgets).filter(([c, b]) => (spent[c] || 0) > b).length : 0;
  const budgetScore  = hasBudgets ? Math.max(0, 25 - overBudget * 8) : 12;
  const emergencyFund = S.investments.filter(i => i.type === 'emergency').reduce((s, i) => s + i.current, 0);
  const emergencyScore = Math.min(20, Math.round((emergencyFund / (Math.max(expense, 1) * 3)) * 20));
  const txScore      = Math.min(15, S.txs.length);
  const investScore  = Math.min(10, S.investments.length * 2);
  const score = Math.min(100, Math.max(0, savingsScore + budgetScore + emergencyScore + txScore + investScore));
  const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : score >= 50 ? 'C+' : score >= 40 ? 'C' : 'D';
  return { score, grade, breakdown: { savings: Math.round(savingsScore / 30 * 100), budget: Math.round(budgetScore / 25 * 100), emergency: Math.round(emergencyScore / 20 * 100), consistency: Math.min(100, S.txs.length * 2), investment: Math.round(investScore / 10 * 100) } };
}

// ═══════════════════════════════════════════════════════════════
// SUBSCRIPTION DETECTION
// ═══════════════════════════════════════════════════════════════

function detectSubscriptions() {
  const descMap = {};
  S.txs.filter(t => t.type === 'expense').forEach(t => {
    const k = t.desc.toLowerCase().trim();
    if (!descMap[k]) descMap[k] = { count: 0, amounts: [], cat: t.category };
    descMap[k].count++; descMap[k].amounts.push(t.amount);
  });
  const knownSubs = ['netflix','spotify','amazon','hotstar','youtube','jio','airtel','rent','emi','sip','gym','discord','notion','github'];
  return Object.entries(descMap).filter(([name, { count, amounts }]) => {
    const isKnown     = knownSubs.some(s => name.includes(s));
    const isRecurring = count >= 2 && amounts.every(a => Math.abs(a - amounts[0]) < amounts[0] * 0.1);
    return isKnown || isRecurring;
  }).map(([name, { count, amounts, cat }]) => ({ name, monthly: amounts[0], count, cat })).sort((a, b) => b.monthly - a.monthly);
}

// ═══════════════════════════════════════════════════════════════
// AI DAILY DIGEST
// ═══════════════════════════════════════════════════════════════

function refreshDigest() {
  const el = document.getElementById('aiDigestText'); if (!el) return;
  const monthTxs = getMonthTxs();
  const income  = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savings = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
  const cats = {};
  monthTxs.filter(t => t.type === 'expense').forEach(t => cats[t.category] = (cats[t.category] || 0) + t.amount);
  const topCat   = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];
  const wkndExp  = monthTxs.filter(t => { const d = new Date(t.date + 'T00:00:00'); return (d.getDay() === 0 || d.getDay() === 6) && t.type === 'expense'; }).reduce((s, t) => s + t.amount, 0);
  const insights = [
    income === 0 ? 'No income recorded this month. Add your salary to start getting AI insights.' : `Income ${fmt(income)} with ${savings}% savings rate — ${savings >= 20 ? '🌟 Excellent discipline!' : savings >= 10 ? 'On track! Push for 20%.' : '⚠️ Consider cutting expenses.'}`,
    expense === 0 ? 'No expenses yet. Start logging for personalized insights.' : topCat ? `Top spend: ${topCat[0]} at ${fmt(topCat[1])}. ${topCat[1] > income * 0.35 ? 'This seems high — consider a budget limit.' : 'Looking balanced.'}` : 'Log more transactions for deeper insights.',
    S.txs.length > 5 && wkndExp > expense * 0.45 ? `⚠️ Weekend spending is ${Math.round(wkndExp / expense * 100)}% of expenses — plan weekends with a budget!` : `🔥 ${S.streak}-day streak — consistency is the key to financial mastery!`,
    S.investments.length === 0 ? '💡 No investments tracked. Starting a SIP even at ₹500/month grows wealth significantly.' : '📈 Keep tracking your portfolio consistently!',
  ];
  el.textContent = insights[Math.floor(Math.random() * insights.length)];
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════

function generateNotifications() {
  const monthTxs = getMonthTxs();
  const income  = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const health  = computeHealthScore();
  S.notifications = [];
  if (income > 0 && (income - expense) / income < 0.1) S.notifications.push({ title: 'Savings Alert', text: `Savings rate is only ${Math.round((income - expense) / income * 100)}%. Target 20%+.`, tag: 'alert' });
  if (health.score < 50) S.notifications.push({ title: 'Health Score Low', text: `Your score is ${health.score}. Review budget and savings.`, tag: 'alert' });
  if (S.streak >= 7) S.notifications.push({ title: `🔥 ${S.streak}-Day Streak!`, text: 'Amazing consistency! Keep it up.', tag: 'win' });
  if (S.investments.length === 0) S.notifications.push({ title: 'Start Investing', text: 'No investments tracked yet. Even ₹500/month SIP grows significantly.', tag: 'tip' });
  const overBudget = Object.entries(S.budgets).filter(([c, b]) => { const s = monthTxs.filter(t => t.type === 'expense' && t.category === c).reduce((s, t) => s + t.amount, 0); return s > b; });
  if (overBudget.length) S.notifications.push({ title: `${overBudget.length} Budget${overBudget.length > 1 ? 's' : ''} Over Limit`, text: `${overBudget.map(([c]) => c.split(' ').slice(1).join(' ')).join(', ')} exceeded.`, tag: 'alert' });
  S.notifications.push({ title: 'AI Tip 💡', text: '50/30/20 rule: 50% needs, 30% wants, 20% savings. How close are you?', tag: 'tip' });
  const dot = document.getElementById('notifDot');
  if (dot) dot.classList.toggle('show', S.notifications.length > 0);
}
function buildNotificationsPanel() {
  const list = document.getElementById('npList'); if (!list) return;
  if (!S.notifications.length) { list.innerHTML = '<div style="font-size:14px;color:var(--muted);padding:20px;text-align:center">All clear! 🎉</div>'; return; }
  list.innerHTML = S.notifications.map(n => `<div class="np-item"><div class="np-item-title">${n.title}</div><div class="np-item-text">${n.text}</div><span class="np-item-tag ${n.tag}">${n.tag.toUpperCase()}</span></div>`).join('');
}

// ═══════════════════════════════════════════════════════════════
// ALERT ENGINE
// ═══════════════════════════════════════════════════════════════

let alertQueue = [], alertActive = false, alertTimeout = null;
function initAlertEngine() { setTimeout(runAlertChecks, 2500); }
function runAlertChecks() {
  const monthTxs = getMonthTxs();
  const income  = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  if (income > 0 && balance < 5000) queueAlert('💸', 'Low Balance Warning', `Balance is ${fmt(balance)} — below ₹5,000 safety threshold!`);
  if (income > 0 && expense > income * 0.9) queueAlert('🚨', 'Overspending Alert', `You've spent ${Math.round(expense / income * 100)}% of income this month.`);
  const budgetViolations = Object.entries(S.budgets).filter(([cat, limit]) => {
    const spent = monthTxs.filter(t => t.type === 'expense' && t.category === cat).reduce((s, t) => s + t.amount, 0);
    return spent > limit * 0.85;
  });
  if (budgetViolations.length) queueAlert('⚠️', 'Budget Alert', `${budgetViolations[0][0].split(' ').slice(1).join(' ')} budget is almost exhausted!`);
}
function queueAlert(icon, title, body) { alertQueue.push({ icon, title, body }); if (!alertActive) showNextAlert(); }
function showNextAlert() {
  if (!alertQueue.length) { alertActive = false; return; }
  alertActive = true;
  const { icon, title, body } = alertQueue.shift();
  document.getElementById('alertIcon').textContent = icon;
  document.getElementById('alertTitle').textContent = title;
  document.getElementById('alertBody').textContent  = body;
  document.getElementById('alertPopup').classList.add('show');
  if (alertTimeout) clearTimeout(alertTimeout);
  alertTimeout = setTimeout(() => { closeAlert(); }, 5000);
}
function closeAlert() { document.getElementById('alertPopup').classList.remove('show'); alertActive = false; setTimeout(showNextAlert, 400); }
function checkBudgetAlerts(cat) {
  const monthTxs = getMonthTxs();
  const spent = monthTxs.filter(t => t.type === 'expense' && t.category === cat).reduce((s, t) => s + t.amount, 0);
  const limit = S.budgets[cat];
  if (limit && spent > limit * 0.8) queueAlert('⚠️', 'Budget Warning', `${cat.split(' ').slice(1).join(' ')} is ${Math.round(spent / limit * 100)}% used (${fmt(spent)} / ${fmt(limit)})`);
}
function checkBalanceAlerts() {
  const monthTxs = getMonthTxs();
  const balance = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) - monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  if (balance < 5000 && balance >= 0) queueAlert('💸', 'Balance Warning', `Your balance has dropped to ${fmt(balance)}.`);
}

// ═══════════════════════════════════════════════════════════════
// COMMAND PALETTE
// ═══════════════════════════════════════════════════════════════

const CMD_COMMANDS = [
  { icon:'➕', name:'Add Expense',    desc:'Log a new expense',            action:() => { closeCmdPalette(); openModal('expense'); } },
  { icon:'💰', name:'Add Income',     desc:'Log new income',               action:() => { closeCmdPalette(); openModal('income'); } },
  { icon:'⬡',  name:'Dashboard',      desc:'Go to overview',               action:() => { closeCmdPalette(); switchView('dashboard', document.querySelector('[data-view=dashboard]')); } },
  { icon:'⇄',  name:'Transactions',   desc:'View all transactions',        action:() => { closeCmdPalette(); switchView('transactions', document.querySelector('[data-view=transactions]')); } },
  { icon:'◎',  name:'Analytics',      desc:'Deep financial insights',      action:() => { closeCmdPalette(); switchView('analytics', document.querySelector('[data-view=analytics]')); } },
  { icon:'✦',  name:'AI Advisor',     desc:'AI-powered financial brain',   action:() => { closeCmdPalette(); switchView('ai', document.querySelector('[data-view=ai]')); } },
  { icon:'◐',  name:'Budget',         desc:'Set spending limits',          action:() => { closeCmdPalette(); switchView('budget', document.querySelector('[data-view=budget]')); } },
  { icon:'◎',  name:'Goals',          desc:'Savings goals tracker',        action:() => { closeCmdPalette(); switchView('goals', document.querySelector('[data-view=goals]')); } },
  { icon:'△',  name:'Portfolio',      desc:'Investment tracker',           action:() => { closeCmdPalette(); switchView('investments', document.querySelector('[data-view=investments]')); } },
  { icon:'◈',  name:'Wallets',        desc:'Multi-wallet manager',         action:() => { closeCmdPalette(); switchView('wallets', document.querySelector('[data-view=wallets]')); } },
  { icon:'◷',  name:'Calendar',       desc:'Bills and reminders',          action:() => { closeCmdPalette(); switchView('calendar', document.querySelector('[data-view=calendar]')); } },
  { icon:'★',  name:'Achievements',   desc:'Gamification & XP',           action:() => { closeCmdPalette(); switchView('gamification', document.querySelector('[data-view=gamification]')); } },
  { icon:'🌙', name:'Toggle Theme',   desc:'Switch dark/light mode',       action:() => { closeCmdPalette(); toggleTheme(); } },
  { icon:'🎨', name:'Customize',      desc:'Themes and accent colors',     action:() => { closeCmdPalette(); openThemePanel(); } },
  { icon:'📊', name:'Export CSV',     desc:'Download your data',           action:() => { closeCmdPalette(); exportCSV(); } },
  { icon:'🔒', name:'Lock App',       desc:'Enable/disable PIN lock',      action:() => { closeCmdPalette(); togglePin(); } },
  { icon:'✦',  name:'Open AI Chat',   desc:'Talk to your financial AI',    action:() => { closeCmdPalette(); toggleAIChat(); } },
];

let filteredCmds = [...CMD_COMMANDS], selectedCmdIdx = 0;
function buildCmdPalette() { filterCmd(); }
function openCmdPalette() {
  document.getElementById('cmdOverlay').classList.add('open');
  document.getElementById('cmdInput').value = ''; filterCmd();
  setTimeout(() => document.getElementById('cmdInput')?.focus(), 100);
}
function closeCmdPalette(e) {
  if (e && e.target !== document.getElementById('cmdOverlay')) return;
  document.getElementById('cmdOverlay').classList.remove('open');
}
function filterCmd() {
  const q = document.getElementById('cmdInput')?.value.toLowerCase() || '';
  filteredCmds = q ? CMD_COMMANDS.filter(c => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)) : CMD_COMMANDS;
  selectedCmdIdx = 0; renderCmdList();
}
function renderCmdList() {
  const list = document.getElementById('cmdList'); if (!list) return;
  if (!filteredCmds.length) { list.innerHTML = '<div style="padding:24px;text-align:center;color:var(--muted);font-size:13px">No commands found</div>'; return; }
  list.innerHTML = `<div class="cmd-section-label">Commands</div>` + filteredCmds.map((c, i) => `<div class="cmd-item${i === selectedCmdIdx ? ' selected' : ''}" onclick="execCmd(${i})"><div class="cmd-item-icon">${c.icon}</div><div class="cmd-item-text"><div class="cmd-item-name">${c.name}</div><div class="cmd-item-desc">${c.desc}</div></div></div>`).join('');
}
function execCmd(idx) { if (filteredCmds[idx]) filteredCmds[idx].action(); }
function handleCmdKey(e) {
  if (e.key === 'ArrowDown')  { selectedCmdIdx = Math.min(selectedCmdIdx + 1, filteredCmds.length - 1); renderCmdList(); }
  else if (e.key === 'ArrowUp')   { selectedCmdIdx = Math.max(selectedCmdIdx - 1, 0); renderCmdList(); }
  else if (e.key === 'Enter')     { execCmd(selectedCmdIdx); }
  else if (e.key === 'Escape')    { document.getElementById('cmdOverlay').classList.remove('open'); }
}

// ═══════════════════════════════════════════════════════════════
// CLAUDE AI CHAT
// ═══════════════════════════════════════════════════════════════

function toggleAIChat() {
  const panel = document.getElementById('aiChatPanel');
  const fab   = document.getElementById('aiChatFab');
  const isOpen = panel.classList.toggle('open');
  fab.classList.toggle('open', isOpen);
}

function buildFinancialContext() {
  const monthTxs = getMonthTxs();
  const income  = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const savings = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
  const cats = {};
  monthTxs.filter(t => t.type === 'expense').forEach(t => cats[t.category] = (cats[t.category] || 0) + t.amount);
  const topCats = Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c, a]) => `${c}: ₹${a.toFixed(0)}`).join(', ');
  const health  = computeHealthScore();
  const subs    = detectSubscriptions();
  const wkndExp = monthTxs.filter(t => { const d = new Date(t.date + 'T00:00:00'); return (d.getDay() === 0 || d.getDay() === 6) && t.type === 'expense'; }).reduce((s, t) => s + t.amount, 0);
  const investTotal = S.investments.reduce((s, i) => s + i.current, 0);
  return `SPENDLY AI — USER FINANCIAL DATA (${MONTHS[S.currentMonth]} ${S.currentYear}):
- Monthly Income: ₹${income.toFixed(0)}
- Monthly Expenses: ₹${expense.toFixed(0)}
- Balance: ₹${balance.toFixed(0)}
- Savings Rate: ${savings}%
- Financial Health Score: ${health.score}/100 (Grade: ${health.grade})
- Top Expense Categories: ${topCats || 'None yet'}
- Weekend Spending: ₹${wkndExp.toFixed(0)} (${expense > 0 ? Math.round(wkndExp / expense * 100) : 0}% of expenses)
- Total Investments: ₹${investTotal.toFixed(0)} across ${S.investments.length} assets
- Active Budgets: ${Object.keys(S.budgets).length}
- Savings Goals: ${S.goals.length}
- Recurring Subscriptions: ${subs.length} (₹${subs.reduce((s, sub) => s + sub.monthly, 0).toFixed(0)}/month)
- Tracking Streak: ${S.streak} days
- Total Transactions: ${S.txs.length}`;
}

async function sendAIChat() {
  const input   = document.getElementById('acpInput');
  const q       = input.value.trim(); if (!q) return;
  input.value   = '';
  const sendBtn = document.getElementById('acpSendBtn');
  sendBtn.disabled = true;
  appendChatMsg(q, 'user');
  const thinkDiv = appendThinking();
  S.aiChatHistory.push({ role: 'user', content: q });
  if (S.aiChatHistory.length > 10) S.aiChatHistory = S.aiChatHistory.slice(-10);
  try {
    const systemPrompt = `You are Spendly AI, an expert personal financial advisor embedded in a fintech app. You are friendly, concise, and data-driven. You have access to the user's real financial data below. Give personalized, actionable advice. Keep responses under 120 words. Use ₹ for currency. Be encouraging but honest.\n\n${buildFinancialContext()}`;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        system: systemPrompt,
        messages: S.aiChatHistory.map(m => ({ role: m.role, content: m.content })),
      }),
    });
    const data  = await response.json();
    thinkDiv.remove();
    const reply = data.content?.[0]?.text || 'Sorry, I had trouble generating a response. Please try again.';
    S.aiChatHistory.push({ role: 'assistant', content: reply });
    appendChatMsg(reply, 'ai');
  } catch (err) {
    thinkDiv.remove();
    const fallback = generateLocalAIAnswer(q);
    S.aiChatHistory.push({ role: 'assistant', content: fallback });
    appendChatMsg(fallback, 'ai');
  }
  sendBtn.disabled = false;
}

function appendChatMsg(text, role) {
  const msgs = document.getElementById('acpMessages');
  const div  = document.createElement('div'); div.className = `acp-msg ${role}-msg`;
  div.innerHTML = `<div class="acp-bubble">${escHtml(text)}</div>`;
  msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight; return div;
}
function appendThinking() {
  const msgs = document.getElementById('acpMessages');
  const div  = document.createElement('div'); div.className = 'acp-msg ai-msg';
  div.innerHTML = '<div class="acp-bubble"><div class="acp-thinking"><span></span><span></span><span></span></div></div>';
  msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight; return div;
}
function generateLocalAIAnswer(q) {
  const ql      = q.toLowerCase();
  const monthTxs = getMonthTxs();
  const income  = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savings = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
  if (ql.includes('hello') || ql.includes('hi')) return `Hello! I'm Spendly AI. This month: income ${fmt(income)}, expenses ${fmt(expense)}, savings ${savings}%. What would you like to explore?`;
  if (ql.includes('spend') || ql.includes('expense')) return `This month you've spent ${fmt(expense)} across ${monthTxs.filter(t => t.type === 'expense').length} transactions. ${expense > income * 0.8 ? '⚠️ High spending ratio.' : '✅ Looks reasonable.'}`;
  if (ql.includes('saving')) return `Your savings rate is ${savings}%. ${savings >= 20 ? '🎉 Excellent! Above the 20% benchmark.' : savings >= 10 ? 'Good start, aim for 20%.' : '⚠️ Try saving at least 10-20% of income.'}`;
  if (ql.includes('invest')) return S.investments.length ? `You have ${S.investments.length} investments worth ${fmt(S.investments.reduce((s, i) => s + i.current, 0))}. Keep it growing consistently!` : `No investments tracked yet. Consider starting a SIP — even ₹500/month grows to ₹23L+ in 20 years!`;
  return `Based on your data — income ${fmt(income)}, expenses ${fmt(expense)}, ${savings}% savings — ${savings < 20 ? `you could save ${fmt(Math.round(income * 0.2 - Math.max(0, income - expense)))} more by trimming discretionary spending.` : 'excellent financial discipline! Keep building your wealth.'}`;
}

// ═══════════════════════════════════════════════════════════════
// AI INSIGHTS & PREDICTIONS
// ═══════════════════════════════════════════════════════════════

function generateAIInsights() {
  const monthTxs = getMonthTxs();
  const income  = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savings = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
  let pm = S.currentMonth - 1, py = S.currentYear; if (pm < 0) { pm = 11; py--; }
  const prevExpense  = getMonthTxs(pm, py).filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const expenseChange = prevExpense > 0 ? Math.round(((expense - prevExpense) / prevExpense) * 100) : 0;
  const cats = {};
  monthTxs.filter(t => t.type === 'expense').forEach(t => cats[t.category] = (cats[t.category] || 0) + t.amount);
  const topCat  = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];
  const subs    = detectSubscriptions(); const subTotal = subs.reduce((s, s2) => s + s2.monthly, 0);
  const wkndExp = monthTxs.filter(t => { const d = new Date(t.date + 'T00:00:00'); return (d.getDay() === 0 || d.getDay() === 6) && t.type === 'expense'; }).reduce((s, t) => s + t.amount, 0);
  const wkndPct = expense > 0 ? Math.round(wkndExp / expense * 100) : 0;
  const insights = [];
  if (expenseChange > 15)  insights.push({ icon: '📈', type: 'warning', text: `Expenses up ${expenseChange}% vs last month. Review where the increase is coming from.`, tag: 'warning' });
  else if (expenseChange < -10) insights.push({ icon: '📉', type: 'good', text: `Expenses down ${Math.abs(expenseChange)}% vs last month. Excellent progress!`, tag: 'good' });
  if (topCat) insights.push({ icon: CAT_EMOJI[topCat[0]] || '💸', type: 'info', text: `Top category: ${topCat[0]} at ${fmt(topCat[1])} (${income > 0 ? Math.round(topCat[1] / income * 100) : 0}% of income).`, tag: 'info' });
  if (savings < 20 && income > 0) insights.push({ icon: '💡', type: 'warning', text: `Savings rate is ${savings}%. Experts recommend 20%+. Need ${fmt(Math.round(income * 0.2 - (income - expense)))} more in savings.`, tag: 'warning' });
  else if (savings >= 30) insights.push({ icon: '🌟', type: 'good', text: `Outstanding ${savings}% savings rate! You're building wealth faster than 80% of people.`, tag: 'good' });
  if (wkndPct > 50) insights.push({ icon: '📅', type: 'warning', text: `${wkndPct}% of expenses happen on weekends. Plan ahead with a weekend budget.`, tag: 'warning' });
  if (subs.length > 0) insights.push({ icon: '🔄', type: 'info', text: `${subs.length} subscriptions totaling ${fmt(subTotal)}/month (${fmt(subTotal * 12)}/year). Review regularly.`, tag: 'info' });
  if (S.investments.length === 0) insights.push({ icon: '📊', type: 'warning', text: 'No investments tracked. ₹1,000/month SIP could grow to ₹23+ lakhs in 20 years.', tag: 'warning' });
  if (!insights.length) insights.push({ icon: '✨', type: 'good', text: 'Your finances look balanced! Keep tracking consistently for deeper insights.', tag: 'good' });
  const grid = document.getElementById('aiInsightsGrid'); if (!grid) return;
  grid.innerHTML = insights.map(i => `<div class="ai-insight-card"><div class="aic-icon">${i.icon}</div><div class="aic-type">${i.type.toUpperCase()}</div><div class="aic-text">${escHtml(i.text)}</div><span class="aic-tag ${i.tag}">${i.tag.charAt(0).toUpperCase() + i.tag.slice(1)}</span></div>`).join('');
}

function generateBehaviorInsights() {
  const grid = document.getElementById('behaviorGrid'); if (!grid) return;
  const monthTxs = getMonthTxs();
  const wkndExp  = monthTxs.filter(t => { const d = new Date(t.date + 'T00:00:00'); return (d.getDay() === 0 || d.getDay() === 6) && t.type === 'expense'; }).reduce((s, t) => s + t.amount, 0);
  const totalExp = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const income   = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  let pm = S.currentMonth - 1, py = S.currentYear; if (pm < 0) { pm = 11; py--; }
  const prevMonthTxs = getMonthTxs(pm, py);
  const curFood  = monthTxs.filter(t => t.type === 'expense' && t.category === '🍔 Food').reduce((s, t) => s + t.amount, 0);
  const prevFood = prevMonthTxs.filter(t => t.type === 'expense' && t.category === '🍔 Food').reduce((s, t) => s + t.amount, 0);
  const foodTrend = prevFood > 0 ? Math.round((curFood - prevFood) / prevFood * 100) : 0;
  const txCount  = monthTxs.filter(t => t.type === 'expense').length;
  const behaviors = [
    { icon: '📅', text: wkndExp > totalExp * 0.4 ? `You spend ${Math.round(wkndExp / Math.max(totalExp, 1) * 100)}% of budget on weekends. Consider weekend budget planning.` : `Weekend spending is ${Math.round(wkndExp / Math.max(totalExp, 1) * 100)}% of total — well-managed.`, tag: wkndExp > totalExp * 0.4 ? 'warning' : 'good' },
    { icon: '🍔', text: foodTrend > 20 ? `Food expenses rose ${foodTrend}% from last month. Track meals to cut costs.` : foodTrend < -15 ? `Great! Food spending down ${Math.abs(foodTrend)}% vs last month.` : `Food spending is ${curFood > income * 0.2 ? 'high' : 'moderate'} at ${fmt(curFood)} this month.`, tag: foodTrend > 20 ? 'warning' : foodTrend < -15 ? 'good' : 'info' },
    { icon: '🧠', text: txCount > 30 ? `High transaction frequency (${txCount} expenses). Review for impulse purchases.` : `Transaction frequency is healthy at ${txCount} expenses this month.`, tag: txCount > 30 ? 'warning' : 'good' },
  ];
  grid.innerHTML = behaviors.map(b => `<div class="ai-insight-card"><div class="aic-icon">${b.icon}</div><div class="aic-type">BEHAVIOR</div><div class="aic-text">${b.text}</div><span class="aic-tag ${b.tag}">${b.tag.charAt(0).toUpperCase() + b.tag.slice(1)}</span></div>`).join('');
}

function renderPrediction() {
  const card = document.getElementById('predictionCard'); if (!card) return;
  const months = [];
  for (let i = 1; i <= 3; i++) { let m = S.currentMonth - i, y = S.currentYear; if (m < 0) { m += 12; y--; } months.push(getMonthTxs(m, y)); }
  const avgIncome  = months.reduce((s, m) => s + m.filter(t => t.type === 'income').reduce((ss, t) => ss + t.amount, 0), 0) / 3;
  const avgExpense = months.reduce((s, m) => s + m.filter(t => t.type === 'expense').reduce((ss, t) => ss + t.amount, 0), 0) / 3;
  const curExpense = getMonthTxs().filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const trend      = avgExpense > 0 ? ((curExpense - avgExpense) / avgExpense * 100) : 0;
  card.innerHTML = `
    <div class="pred-item"><div class="pred-label">Predicted Income</div><div class="pred-value" style="color:var(--green)">${fmt(avgIncome)}</div><div class="pred-change">3-month avg</div></div>
    <div class="pred-item"><div class="pred-label">Predicted Expense</div><div class="pred-value" style="color:var(--red)">${fmt(avgExpense)}</div><div class="pred-change ${trend > 0 ? 'up' : 'down'}">${trend > 0 ? '▲' : '▼'} ${Math.abs(Math.round(trend))}% vs current</div></div>
    <div class="pred-item"><div class="pred-label">Est. Savings</div><div class="pred-value" style="color:var(--accent)">${fmt(Math.max(0, avgIncome - avgExpense))}</div><div class="pred-change">${avgIncome > 0 ? Math.round((avgIncome - avgExpense) / avgIncome * 100) : 0}% rate</div></div>
  `;
}

// ═══════════════════════════════════════════════════════════════
// MASTER RENDER
// ═══════════════════════════════════════════════════════════════

function render() {
  const v = S.currentView;
  if (v === 'dashboard')     renderDashboard();
  if (v === 'transactions')  renderTransactions();
  if (v === 'analytics')     renderAnalytics();
  if (v === 'budget')        renderBudget();
  if (v === 'ai')            renderAI();
  if (v === 'goals')         renderGoals();
  if (v === 'investments')   renderInvestments();
  if (v === 'wallets')       renderWallets();
  if (v === 'calendar')      renderCalendar();
  if (v === 'gamification')  renderGamification();
  updateSidebarScore(); generateNotifications();
}

function updateSidebarScore() {
  const h  = computeHealthScore();
  const ss = document.getElementById('ssScore'); const sg = document.getElementById('ssGrade');
  if (ss) ss.textContent = h.score; if (sg) sg.textContent = h.grade;
}

// ── Animated counter ──
function animateCounter(elId, target) {
  const elem = document.getElementById(elId); if (!elem) return;
  const dur = 700, st = performance.now(); const neg = target < 0, abs = Math.abs(target);
  function step(now) {
    const p = Math.min((now - st) / dur, 1); const e = 1 - Math.pow(1 - p, 3);
    elem.textContent = (neg ? '-' : '') + fmt(Math.round(e * abs));
    if (p < 1) requestAnimationFrame(step); else elem.textContent = (neg ? '-' : '') + fmt(abs);
  }
  requestAnimationFrame(step);
}

// ── Ring canvas ──
function drawSavingsRing(canvasId, pct, color = '#6c47ff') {
  const canvas = document.getElementById(canvasId); if (!canvas) return;
  const ctx = canvas.getContext('2d'); const sz = canvas.width; const cx = sz / 2, cy = sz / 2, r = sz / 2 - 5;
  ctx.clearRect(0, 0, sz, sz);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 7; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, (-Math.PI / 2) + (pct / 100) * Math.PI * 2);
  ctx.strokeStyle = color; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.stroke();
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════

function renderDashboard() {
  const monthTxs = getMonthTxs();
  const income  = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const health  = computeHealthScore();
  animateCounter('kpiIncome', income); animateCounter('kpiExpense', expense); animateCounter('kpiBalance', balance);
  document.getElementById('kpiIncomeSub').textContent  = `${monthTxs.filter(t => t.type === 'income').length} transactions`;
  document.getElementById('kpiExpenseSub').textContent = `${monthTxs.filter(t => t.type === 'expense').length} transactions`;
  document.getElementById('kpiHealthScore').textContent = health.score;
  document.getElementById('kpiGrade').textContent = `Grade: ${health.grade}`;
  const maxAmt = Math.max(income, expense, 1);
  document.getElementById('incomeBar').style.width  = `${income / maxAmt * 100}%`;
  document.getElementById('expenseBar').style.width = `${expense / maxAmt * 100}%`;
  const tag = document.getElementById('balTag');
  if (balance > 0)       { tag.textContent = '▲ Surplus';    tag.style.background = 'var(--green-dim)'; tag.style.color = 'var(--green)'; }
  else if (balance < 0)  { tag.textContent = '▼ Deficit';    tag.style.background = 'var(--red-dim)';   tag.style.color = 'var(--red)'; }
  else                   { tag.textContent = '— Break-even'; tag.style.background = 'rgba(255,255,255,0.06)'; tag.style.color = 'var(--muted)'; }
  drawSavingsRing('savingsRing', health.score, health.score >= 70 ? '#00e5a0' : health.score >= 50 ? '#ffaa00' : '#ff3d6e');
  renderBarChart(monthTxs); renderDonutChart(monthTxs); renderSubscriptionMini();
  renderTxList('recentList', monthTxs.slice(0, 5));
}

function renderBarChart(monthTxs) {
  const canvas = document.getElementById('barChart'); if (!canvas) return;
  const days = new Date(S.currentYear, S.currentMonth + 1, 0).getDate();
  const incD = Array(days).fill(0), expD = Array(days).fill(0);
  monthTxs.forEach(t => { const day = new Date(t.date + 'T00:00:00').getDate() - 1; if (t.type === 'income') incD[day] += t.amount; else expD[day] += t.amount; });
  document.getElementById('barLegend').innerHTML = `<div class="cli-item"><div class="cli-dot" style="background:#00e5a0"></div>Income</div><div class="cli-item"><div class="cli-dot" style="background:#ff3d6e"></div>Expense</div>`;
  destroyChart('barChart');
  S.charts.barChart = new Chart(canvas, {
    type: 'bar', data: { labels: Array.from({ length: days }, (_, i) => i + 1), datasets: [{ label: 'Income', data: incD, backgroundColor: 'rgba(0,229,160,0.55)', borderRadius: 5, borderSkipped: false }, { label: 'Expense', data: expD, backgroundColor: 'rgba(255,61,110,0.55)', borderRadius: 5, borderSkipped: false }] },
    options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${fmt(ctx.raw)}` } } }, scales: { x: { grid: { display: false }, ticks: { font: { family: 'Outfit', size: 10 }, maxTicksLimit: 10 } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { font: { family: 'Outfit', size: 10 }, callback: v => '₹' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v) } } } },
  });
}

function renderDonutChart(monthTxs) {
  const canvas = document.getElementById('donutChart'); if (!canvas) return;
  const cats = {};
  monthTxs.filter(t => t.type === 'expense').forEach(t => cats[t.category] = (cats[t.category] || 0) + t.amount);
  const entries = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  const total   = entries.reduce((s, e) => s + e[1], 0);
  const dc = document.getElementById('donutCenter'); if (dc) dc.querySelector('.dc-val').textContent = fmt(total);
  const legend = document.getElementById('donutLegend');
  if (legend) legend.innerHTML = entries.slice(0, 5).map(([cat, amt]) => `<div class="dl-item"><div class="dl-dot" style="background:${CAT_COLOR[cat] || '#888'}"></div>${cat.replace(/^\S+\s/, '')} (${total > 0 ? Math.round(amt / total * 100) : 0}%)</div>`).join('');
  destroyChart('donutChart'); if (!entries.length) return;
  S.charts.donutChart = new Chart(canvas, {
    type: 'doughnut', data: { labels: entries.map(e => e[0].replace(/^\S+\s/, '')), datasets: [{ data: entries.map(e => e[1]), backgroundColor: entries.map(e => CAT_COLOR[e[0]] || '#888'), borderWidth: 0, hoverOffset: 10 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `${ctx.label}: ${fmt(ctx.raw)}` } } } },
  });
}

function renderSubscriptionMini() {
  const subs  = detectSubscriptions();
  const el    = document.getElementById('subList');
  const count = document.getElementById('subCount');
  if (count) count.textContent = subs.length; if (!el) return;
  if (!subs.length) { el.innerHTML = '<div style="font-size:13px;color:var(--muted);padding:8px 0">No recurring payments detected yet.</div>'; return; }
  el.innerHTML = subs.slice(0, 5).map(s => `<div class="sub-card"><div class="sub-icon">${CAT_EMOJI[s.cat] || '🔄'}</div><div><div class="sub-name">${escHtml(s.name.charAt(0).toUpperCase() + s.name.slice(1))}</div><div class="sub-amt">${fmt(s.monthly)}/mo</div><div class="sub-period">${s.count}x detected</div></div></div>`).join('');
}

// ═══════════════════════════════════════════════════════════════
// TRANSACTIONS
// ═══════════════════════════════════════════════════════════════

function renderTransactions() {
  let txs = [...S.txs];
  const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const sort   = document.getElementById('sortSelect')?.value || 'date-desc';
  if (S.currentFilter === 'income')  txs = txs.filter(t => t.type === 'income');
  if (S.currentFilter === 'expense') txs = txs.filter(t => t.type === 'expense');
  if (search) txs = txs.filter(t => t.desc.toLowerCase().includes(search) || t.category.toLowerCase().includes(search));
  if (sort === 'date-desc')     txs.sort((a, b) => new Date(b.date) - new Date(a.date));
  else if (sort === 'date-asc') txs.sort((a, b) => new Date(a.date) - new Date(b.date));
  else if (sort === 'amount-desc') txs.sort((a, b) => b.amount - a.amount);
  else txs.sort((a, b) => a.amount - b.amount);
  const countEl = document.getElementById('txCount'); if (countEl) countEl.textContent = `${txs.length} record${txs.length !== 1 ? 's' : ''}`;
  renderTxList('txList', txs);
}

function renderTxList(containerId, txs) {
  const c = document.getElementById(containerId); if (!c) return;
  if (!txs.length) { c.innerHTML = `<div class="empty-state"><div class="es-icon">💸</div><div class="es-title">No transactions</div><div class="es-sub">Add your first transaction to get started.</div></div>`; return; }
  c.innerHTML = txs.map(t => {
    const bg = t.type === 'income' ? 'rgba(0,229,160,0.12)' : 'rgba(255,61,110,0.12)';
    return `<div class="tx-item"><div class="tx-icon" style="background:${bg}">${CAT_EMOJI[t.category] || '💸'}</div><div class="tx-details"><div class="tx-desc">${escHtml(t.desc)}</div><div class="tx-cat">${t.category.replace(/^\S+\s/, '')}${t.note ? ` · ${escHtml(t.note)}` : ''}</div></div><div class="tx-right"><div class="tx-amount ${t.type}">${t.type === 'income' ? '+' : '-'}${fmt(t.amount)}</div><div class="tx-date">${fmtDate(t.date)}</div></div><div class="tx-actions"><button class="tx-act-btn edit" onclick="openEditModal(${t.id})">✏️</button><button class="tx-act-btn" onclick="deleteTx(${t.id})">🗑️</button></div></div>`;
  }).join('');
}
function setFilter(f, el) { S.currentFilter = f; document.querySelectorAll('.fpill').forEach(p => p.classList.remove('active')); el.classList.add('active'); renderTransactions(); }

// ═══════════════════════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════════════════════

function renderAnalytics() { renderTrendChart(); renderRadarChart(); renderHBarChart(); renderStatsTable(); renderHeatmap(); }

function renderTrendChart() {
  const canvas = document.getElementById('trendChart'); if (!canvas) return;
  const labels = [], incData = [], expData = [];
  for (let i = 5; i >= 0; i--) { let m = S.currentMonth - i, y = S.currentYear; if (m < 0) { m += 12; y--; } const txs = getMonthTxs(m, y); labels.push(SHORT_MONTHS[m] + " '" + String(y).slice(2)); incData.push(txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)); expData.push(txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)); }
  destroyChart('trendChart');
  S.charts.trendChart = new Chart(canvas, {
    type: 'line', data: { labels, datasets: [{ label: 'Income', data: incData, borderColor: '#00e5a0', backgroundColor: 'rgba(0,229,160,0.08)', tension: 0.4, fill: true, pointRadius: 4, pointHoverRadius: 6 }, { label: 'Expense', data: expData, borderColor: '#ff3d6e', backgroundColor: 'rgba(255,61,110,0.08)', tension: 0.4, fill: true, pointRadius: 4, pointHoverRadius: 6 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${fmt(ctx.raw)}` } } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: v => '₹' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v) } } } },
  });
}

function renderRadarChart() {
  const canvas = document.getElementById('radarChart'); if (!canvas) return;
  const monthTxs = getMonthTxs();
  const catAmounts = CATS.filter(c => !['💼 Salary','💰 Other Income'].includes(c.key)).map(c => ({ cat: c, amt: monthTxs.filter(t => t.type === 'expense' && t.category === c.key).reduce((s, t) => s + t.amount, 0) }));
  const maxAmt = Math.max(...catAmounts.map(c => c.amt), 1);
  destroyChart('radarChart');
  S.charts.radarChart = new Chart(canvas, {
    type: 'radar', data: { labels: catAmounts.map(c => c.cat.label), datasets: [{ label: 'Spending', data: catAmounts.map(c => Math.round(c.amt / maxAmt * 100)), backgroundColor: 'rgba(108,71,255,0.15)', borderColor: '#6c47ff', pointBackgroundColor: '#6c47ff', borderWidth: 2 }] },
    options: { responsive: true, maintainAspectRatio: false, scales: { r: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { display: false } } }, plugins: { legend: { display: false } } },
  });
}

function renderHBarChart() {
  const canvas = document.getElementById('hbarChart'); if (!canvas) return;
  const cats = {};
  getMonthTxs().filter(t => t.type === 'expense').forEach(t => cats[t.category] = (cats[t.category] || 0) + t.amount);
  const entries = Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 6);
  destroyChart('hbarChart'); if (!entries.length) return;
  S.charts.hbarChart = new Chart(canvas, {
    type: 'bar', data: { labels: entries.map(e => e[0].replace(/^\S+\s/, '')), datasets: [{ label: 'Spending', data: entries.map(e => e[1]), backgroundColor: entries.map(e => CAT_COLOR[e[0]] || '#888'), borderRadius: 6, borderSkipped: false }] },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => fmt(ctx.raw) } } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: v => '₹' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v) } }, y: { grid: { display: false } } } },
  });
}

function renderStatsTable() {
  const el = document.getElementById('statsTable'); if (!el) return;
  const cats = {}; const monthTxs = getMonthTxs();
  monthTxs.filter(t => t.type === 'expense').forEach(t => cats[t.category] = (cats[t.category] || 0) + t.amount);
  const total   = Object.values(cats).reduce((s, v) => s + v, 0) || 1;
  const entries = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  if (!entries.length) { el.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:16px">No expense data for this month.</div>'; return; }
  el.innerHTML = entries.map(([cat, amt]) => `<div class="stat-row"><span class="sr-emoji">${CAT_EMOJI[cat] || '💸'}</span><span class="sr-label">${cat.replace(/^\S+\s/, '')}</span><div class="sr-bar-wrap"><div class="sr-bar" style="width:${amt / total * 100}%;background:${CAT_COLOR[cat] || '#888'}"></div></div><span class="sr-amount">${fmt(amt)}</span><span class="sr-pct">${Math.round(amt / total * 100)}%</span></div>`).join('');
}

function renderHeatmap() {
  const el = document.getElementById('heatmapWrap'); if (!el) return;
  const today = new Date(); const dailySpend = {};
  S.txs.filter(t => t.type === 'expense').forEach(t => dailySpend[t.date] = (dailySpend[t.date] || 0) + t.amount);
  const maxSpend = Math.max(...Object.values(dailySpend), 1);
  let html = '<div style="font-size:11px;color:var(--muted);margin-bottom:8px;font-family:var(--font-mono)">Last 12 weeks spending intensity</div><div class="heatmap-grid">';
  for (let w = 11; w >= 0; w--) {
    html += '<div class="heatmap-week">';
    for (let d = 0; d < 7; d++) {
      const date = new Date(today); date.setDate(today.getDate() - (w * 7 + d));
      const ds = date.toISOString().split('T')[0]; const spend = dailySpend[ds] || 0;
      const ins = spend / maxSpend; const cls = ins > 0.7 ? 'extreme' : ins > 0.4 ? 'high' : ins > 0.15 ? 'med' : ins > 0 ? 'low' : '';
      html += `<div class="heatmap-day${cls ? ' ' + cls : ''}" title="${ds}: ${fmt(spend)}"></div>`;
    }
    html += '</div>';
  }
  html += '</div><div style="display:flex;align-items:center;gap:6px;margin-top:10px;font-size:11px;color:var(--muted)">Less <div class="heatmap-day"></div><div class="heatmap-day low"></div><div class="heatmap-day med"></div><div class="heatmap-day high"></div><div class="heatmap-day extreme"></div> More</div>';
  el.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════
// BUDGET
// ═══════════════════════════════════════════════════════════════

function renderBudget() {
  const grid = document.getElementById('budgetGrid'); if (!grid) return;
  const monthTxs = getMonthTxs();
  if (!Object.keys(S.budgets).length) { grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="es-icon">◐</div><div class="es-title">No budgets set</div><div class="es-sub">Set monthly limits to control spending.</div></div>`; return; }
  grid.innerHTML = Object.entries(S.budgets).map(([cat, limit]) => {
    const spent = monthTxs.filter(t => t.type === 'expense' && t.category === cat).reduce((s, t) => s + t.amount, 0);
    const pct   = Math.min(Math.round(spent / limit * 100), 100);
    const cls   = pct >= 100 ? 'over' : pct >= 80 ? 'warn' : 'ok';
    return `<div class="budget-card"><div class="bc-head"><span class="bc-emoji">${CAT_EMOJI[cat] || '💸'}</span><span class="bc-label">${cat.replace(/^\S+\s/, '')}</span><button class="bc-edit-btn" onclick="deleteBudget('${cat.replace(/'/g, "\\'")}')">✕</button></div><div class="bc-amounts"><span class="bc-spent" style="color:${cls === 'over' ? 'var(--red)' : cls === 'warn' ? 'var(--amber)' : 'var(--green)'}">${fmt(spent)}</span><span class="bc-limit">of ${fmt(limit)}</span></div><div class="bc-progress"><div class="bc-fill ${cls}" style="width:${pct}%"></div></div><div class="bc-stat"><span>${pct}% used</span><span>${fmt(Math.max(0, limit - spent))} left</span></div></div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════
// AI VIEW
// ═══════════════════════════════════════════════════════════════

function renderAI() {
  const health = computeHealthScore();
  const scoreBig = document.getElementById('healthScoreBig'); const gradeBig = document.getElementById('healthGradeBig'); const descBig = document.getElementById('healthDescBig');
  if (scoreBig) scoreBig.textContent = health.score; if (gradeBig) gradeBig.textContent = health.grade;
  if (descBig) descBig.textContent = health.score >= 80 ? 'Excellent financial health! You are in the top tier.' : health.score >= 60 ? 'Good financial discipline. Minor improvements will make a big difference.' : health.score >= 40 ? 'Average. Focus on savings and budgeting to improve rapidly.' : 'Needs attention. Set budgets and start saving consistently.';
  const breakdown = document.getElementById('healthBreakdown');
  if (breakdown) breakdown.innerHTML = Object.entries(health.breakdown).map(([k, v]) => `<div class="hb-item"><div class="hb-label">${k.charAt(0).toUpperCase() + k.slice(1)}</div><div class="hb-score" style="color:${v >= 70 ? 'var(--green)' : v >= 40 ? 'var(--amber)' : 'var(--red)'}">${v}</div><div class="hb-bar"><div class="hb-fill" style="width:${v}%;background:${v >= 70 ? 'var(--green)' : v >= 40 ? 'var(--amber)' : 'var(--red)'}"></div></div></div>`).join('');
  drawHealthGauge(health.score); generateBehaviorInsights(); generateAIInsights(); renderPrediction(); renderSubAnalysis();
}

function drawHealthGauge(score) {
  const canvas = document.getElementById('healthGauge'); if (!canvas) return;
  const ctx = canvas.getContext('2d'); const w = canvas.width, h = canvas.height; const cx = w / 2, cy = h / 2 + 20; const r = 70;
  ctx.clearRect(0, 0, w, h);
  ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 0); ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 14; ctx.stroke();
  const color = score >= 80 ? '#00e5a0' : score >= 60 ? '#6c47ff' : score >= 40 ? '#ffaa00' : '#ff3d6e';
  ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, Math.PI + (score / 100) * Math.PI); ctx.strokeStyle = color; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.stroke();
  ctx.fillStyle = color; ctx.font = 'bold 32px Outfit'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(score, cx, cy - 8);
  ctx.fillStyle = S.theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'; ctx.font = '12px Outfit'; ctx.fillText('HEALTH SCORE', cx, cy + 18);
}

function renderSubAnalysis() {
  const el = document.getElementById('subAnalysis'); if (!el) return;
  const subs = detectSubscriptions();
  if (!subs.length) { el.innerHTML = '<div style="font-size:13px;color:var(--muted);padding:16px">No subscriptions detected yet.</div>'; return; }
  el.innerHTML = subs.map(s => `<div class="sa-card"><div class="sa-icon">${CAT_EMOJI[s.cat] || '🔄'}</div><div><div class="sa-name">${escHtml(s.name.charAt(0).toUpperCase() + s.name.slice(1))}</div><div class="sa-amount">${fmt(s.monthly)}/mo</div><div class="sa-period">${fmt(s.monthly * 12)}/year · ${s.count}x</div></div></div>`).join('');
}

// ═══════════════════════════════════════════════════════════════
// GOALS
// ═══════════════════════════════════════════════════════════════

function renderGoals() {
  const grid = document.getElementById('goalsGrid'); if (!grid) return;
  if (!S.goals.length) { grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="es-icon">🎯</div><div class="es-title">No goals yet</div><div class="es-sub">Set savings goals for vacation, gadgets, or emergency fund.</div></div>`; return; }
  grid.innerHTML = S.goals.map(g => {
    const pct = Math.min(Math.round(g.saved / g.target * 100), 100);
    const daysLeft = g.date ? Math.ceil((new Date(g.date) - new Date()) / 86400000) : null;
    const done = pct >= 100;
    return `<div class="goal-card${done ? ' gc-complete' : ''}"><div class="gc-head"><div class="gc-emoji">${g.emoji}</div><div><div class="gc-name">${escHtml(g.name)}</div><div class="gc-deadline">${daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed') : 'No deadline'}</div></div></div><button class="gc-del" onclick="deleteGoal(${g.id})">✕</button><div class="gc-amounts"><div><div class="gc-saved">${fmt(g.saved)}</div><div class="gc-target">of ${fmt(g.target)}</div></div><div class="gc-ring-wrap"><canvas id="goalRing${g.id}" width="80" height="80"></canvas><div class="gc-pct" style="color:${done ? 'var(--green)' : 'var(--accent)'}">${pct}%</div></div></div><div class="gc-progress"><div class="gc-fill" style="width:${pct}%;background:${done ? 'var(--green)' : 'linear-gradient(90deg,var(--accent),var(--accent2))'}"></div></div><div class="gc-stat">${done ? '🎉 Goal achieved!' : fmt(g.target - g.saved) + ' remaining'}</div></div>`;
  }).join('');
  S.goals.forEach(g => { drawSavingsRing('goalRing' + g.id, Math.min(g.saved / g.target * 100, 100), g.saved >= g.target ? '#00e5a0' : '#6c47ff'); });
}

// ═══════════════════════════════════════════════════════════════
// INVESTMENTS
// ═══════════════════════════════════════════════════════════════

function renderInvestments() {
  const summary = document.getElementById('investSummary');
  if (summary) {
    const totalIn  = S.investments.reduce((s, i) => s + i.amount, 0);
    const totalCur = S.investments.reduce((s, i) => s + i.current, 0);
    const pl       = totalCur - totalIn; const plPct = totalIn > 0 ? Math.round(pl / totalIn * 100) : 0;
    summary.innerHTML = `<div class="is-item"><div class="is-label">Invested</div><div class="is-value">${fmt(totalIn)}</div></div><div class="is-item"><div class="is-label">Current Value</div><div class="is-value">${fmt(totalCur)}</div></div><div class="is-item"><div class="is-label">P&amp;L</div><div class="is-value" style="color:${pl >= 0 ? 'var(--green)' : 'var(--red)'}">${pl >= 0 ? '+' : ''}${fmt(pl)}</div></div><div class="is-item"><div class="is-label">Return</div><div class="is-value" style="color:${plPct >= 0 ? 'var(--green)' : 'var(--red)'}">${plPct >= 0 ? '+' : ''}${plPct}%</div></div>`;
  }
  const c = document.getElementById('investGrid'); if (!c) return;
  if (!S.investments.length) { c.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="es-icon">📈</div><div class="es-title">No investments</div><div class="es-sub">Track your SIPs, stocks, crypto, and more.</div></div>`; return; }
  c.innerHTML = S.investments.map(inv => {
    const pl = inv.current - inv.amount; const plPct = inv.amount > 0 ? Math.round(pl / inv.amount * 100) : 0;
    return `<div class="invest-card glass-card"><div class="ic-head"><span class="ic-icon">${INVEST_ICONS[inv.type] || '📈'}</span><div><div class="ic-name">${escHtml(inv.name)}</div><div class="ic-type">${INVEST_LABELS[inv.type] || inv.type}</div></div><button class="ic-del" onclick="deleteInvestment(${inv.id})">✕</button></div><div class="ic-amounts"><div class="ic-invested">Invested: ${fmt(inv.amount)}</div><div class="ic-current" style="color:${pl >= 0 ? 'var(--green)' : 'var(--red)'}">${fmt(inv.current)}</div></div><span class="ic-pl ${pl >= 0 ? 'positive' : 'negative'}">${pl >= 0 ? '+' : ''}${fmt(pl)} (${plPct >= 0 ? '+' : ''}${plPct}%)</span></div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════
// WALLETS
// ═══════════════════════════════════════════════════════════════

function renderWallets() {
  const grid = document.getElementById('walletsGrid'); if (!grid) return;
  if (!S.wallets.length) { grid.innerHTML = `<div class="empty-state"><div class="es-icon">👜</div><div class="es-title">No wallets yet</div><div class="es-sub">Add your bank accounts, UPI, crypto and more.</div></div>`; renderWalletChart([]); return; }
  grid.innerHTML = S.wallets.map(w => `<div class="wallet-card" style="background:${WALLET_COLORS[w.type] || WALLET_COLORS.bank}"><div class="wc-type">${w.type.toUpperCase()}</div><div class="wc-balance">${fmt(w.balance)}</div><div class="wc-name">${escHtml(w.name)}</div><div class="wc-icon">${WALLET_ICONS[w.type] || '💳'}</div><button style="position:absolute;bottom:12px;right:12px;background:rgba(255,255,255,0.15);border:none;border-radius:6px;width:28px;height:28px;cursor:pointer;color:#fff;font-size:13px;" onclick="deleteWallet(${w.id})">✕</button></div>`).join('');
  renderWalletChart(S.wallets);
}
function renderWalletChart(wallets) {
  const canvas = document.getElementById('walletChart'); if (!canvas) return;
  destroyChart('walletChart'); if (!wallets.length) return;
  S.charts.walletChart = new Chart(canvas, {
    type: 'doughnut', data: { labels: wallets.map(w => w.name), datasets: [{ data: wallets.map(w => w.balance), backgroundColor: ['#6c47ff','#4488ff','#00e5a0','#ff3d6e','#f59e0b','#06b6d4'], borderWidth: 0, hoverOffset: 8 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: true, position: 'right' }, tooltip: { callbacks: { label: ctx => `${ctx.label}: ${fmt(ctx.raw)}` } } } },
  });
}

// ═══════════════════════════════════════════════════════════════
// CALENDAR
// ═══════════════════════════════════════════════════════════════

function renderCalendar() {
  const wrap  = document.getElementById('calendarWrap'); if (!wrap) return;
  const year  = S.calDisplayYear, month = S.calDisplayMonth;
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today       = new Date();
  const eventDays   = new Set(S.calEvents.filter(e => { const d = new Date(e.date + 'T00:00:00'); return d.getMonth() === month && d.getFullYear() === year; }).map(e => new Date(e.date + 'T00:00:00').getDate()));
  let html = `<div class="cal-header"><button class="mn-btn" onclick="changeCalMonth(-1)">‹</button><div class="cal-title">${MONTHS[month]} ${year}</div><button class="mn-btn" onclick="changeCalMonth(1)">›</button></div><div class="cal-grid">${['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => `<div class="cal-day-label">${d}</div>`).join('')}`;
  for (let i = 0; i < firstDay; i++) html += `<div class="cal-day other-month"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday  = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
    const hasEvent = eventDays.has(d);
    html += `<div class="cal-day${isToday ? ' today' : ''}${hasEvent ? ' has-event' : ''}">${d}</div>`;
  }
  html += `</div>`; wrap.innerHTML = html;
  const listEl   = document.getElementById('calEventList');
  const upcoming = [...S.calEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
  if (listEl) {
    if (!upcoming.length) { listEl.innerHTML = '<div style="font-size:13px;color:var(--muted);padding:16px">No events yet. Add bills, EMIs, and reminders.</div>'; return; }
    listEl.innerHTML = upcoming.map(e => `<div class="cal-event"><div class="ce-icon">${CAL_ICONS[e.type] || '🔔'}</div><div class="ce-name">${escHtml(e.name)}</div><div class="ce-date">${fmtDate(e.date)}</div>${e.amount ? `<div class="ce-amount">${fmt(e.amount)}</div>` : ''}<button onclick="deleteCalEvent(${e.id})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:14px;padding:4px">🗑️</button></div>`).join('');
  }
}
function changeCalMonth(dir) {
  S.calDisplayMonth += dir;
  if (S.calDisplayMonth > 11) { S.calDisplayMonth = 0; S.calDisplayYear++; }
  if (S.calDisplayMonth < 0)  { S.calDisplayMonth = 11; S.calDisplayYear--; }
  renderCalendar();
}

// ── GAMIFICATION ──
function renderGamification(){
  const lvInfo=getLevel();const xpInLevel=lvInfo.currentXP-lvInfo.prevXP;const xpNeeded=lvInfo.nextXP-lvInfo.prevXP;const pct=Math.min(Math.round(xpInLevel/xpNeeded*100),100);
  const xpCard=document.getElementById('xpBarCard');
  if(xpCard)xpCard.innerHTML=`<div class="xp-header"><div class="xp-level">Level <span>${lvInfo.level}</span></div><div class="xp-points">${S.xp} XP · 🔥 ${S.streak} day streak</div></div><div class="xp-bar"><div class="xp-fill" style="width:${pct}%"></div></div><div class="xp-labels"><span>${lvInfo.prevXP} XP</span><span>${pct}% to next level</span><span>${lvInfo.nextXP} XP</span></div>`;
  const grid=document.getElementById('achievementsGrid');
  if(grid)grid.innerHTML=ALL_ACHIEVEMENTS.map(a=>{const un=S.achievements.includes(a.id);return `<div class="ach-card ${un?'unlocked':'locked'}"><div class="ach-icon">${a.emoji}</div><div class="ach-name">${a.name}</div><div class="ach-desc">${a.desc}</div><span class="ach-xp">+${a.xp} XP${un?' ✓':''}</span></div>`;}).join('');
  const challenges=[
    {icon:'📝',name:'Log Today',desc:'Add at least one transaction today',reward:'+5 XP',done:S.txs.some(t=>t.date===new Date().toISOString().split('T')[0])},
    {icon:'🎯',name:'Stay Under Budget',desc:'Keep all categories under budget',reward:'+20 XP',done:Object.entries(S.budgets).every(([c,b])=>{const s=getMonthTxs().filter(t=>t.type==='expense'&&t.category===c).reduce((s,t)=>s+t.amount,0);return s<=b;})&&Object.keys(S.budgets).length>0},
    {icon:'💰',name:'Add Income',desc:'Record income this month',reward:'+10 XP',done:getMonthTxs().some(t=>t.type==='income')},
    {icon:'📊',name:'Set a Budget',desc:'Create at least one budget limit',reward:'+15 XP',done:Object.keys(S.budgets).length>0},
    {icon:'🎯',name:'Set a Goal',desc:'Add a savings goal',reward:'+20 XP',done:S.goals.length>0},
    {icon:'👜',name:'Add a Wallet',desc:'Track a wallet or account',reward:'+10 XP',done:S.wallets.length>0},
  ];
  const list=document.getElementById('challengesList');
  if(list)list.innerHTML=challenges.map(c=>`<div class="ch-card glass-card"><div class="ch-icon">${c.icon}</div><div><div class="ch-name">${c.name}</div><div class="ch-desc">${c.desc}</div></div>${c.done?`<div class="ch-done">✅ Done</div>`:`<span class="ch-reward">${c.reward}</span>`}</div>`).join('');
}

function getLevel(){
  const thresholds=[0,100,250,500,1000,2000,3500,5000,8000,12000,20000];
  let level=1,prevXP=0,nextXP=100;
  for(let i=0;i<thresholds.length-1;i++){if(S.xp>=thresholds[i]&&S.xp<thresholds[i+1]){level=i+1;prevXP=thresholds[i];nextXP=thresholds[i+1];break;}if(S.xp>=thresholds[thresholds.length-1]){level=thresholds.length;prevXP=thresholds[thresholds.length-1];nextXP=prevXP+10000;}}
  return{level,currentXP:S.xp,prevXP,nextXP};
}

function addXP(pts){S.xp+=pts;save();}
function checkAchievements(){
  const check=(id,cond)=>{if(cond&&!S.achievements.includes(id)){S.achievements.push(id);save();showToast(`🏆 Achievement: ${ALL_ACHIEVEMENTS.find(a=>a.id===id)?.name||id}!`);}};
  check('first_tx',S.txs.length>=1);check('tx_10',S.txs.length>=10);check('tx_50',S.txs.length>=50);check('tx_100',S.txs.length>=100);
  check('budget_set',Object.keys(S.budgets).length>0);check('goal_set',S.goals.length>0);
  check('invest_add',S.investments.length>0);check('streak_7',S.streak>=7);check('streak_30',S.streak>=30);
  check('wallet_add',S.wallets.length>0);
  const monthTxs=getMonthTxs();const income=monthTxs.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);const expense=monthTxs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  if(income>0)check('savings_20',(income-expense)/income>=0.2);
  check('health_80',computeHealthScore().score>=80);
}
function buildAchievements(){checkAchievements();}

function updateStreak(){
  const today=new Date().toISOString().split('T')[0];const last=S.lastActive;
  if(!last){S.streak=1;S.lastActive=today;save();return;}
  if(last===today)return;
  const diff=Math.round((new Date(today)-new Date(last))/86400000);
  if(diff===1){S.streak++;S.lastActive=today;}else if(diff>1){S.streak=1;S.lastActive=today;}
  save();
}

// ── VOICE INPUT ──
function initVoice(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const btn=document.getElementById('voiceBtn');if(!SR||!btn)return;
  btn.style.display='flex';
  let recognition=null;let listening=false;
  btn.addEventListener('click',()=>{
    if(listening){recognition?.stop();return;}
    recognition=new SR();recognition.lang='en-IN';recognition.continuous=false;recognition.interimResults=false;
    recognition.onstart=()=>{listening=true;btn.classList.add('listening');btn.textContent='🔴';};
    recognition.onend=()=>{listening=false;btn.classList.remove('listening');btn.textContent='🎙️';};
    recognition.onresult=(e)=>{
      const t=e.results[0][0].transcript;
      const amtMatch=t.match(/(\d+(?:\.\d+)?)/);const amt=amtMatch?amtMatch[1]:'';
      const descEl=document.getElementById('desc');const amtEl=document.getElementById('amount');
      if(descEl)descEl.value=t;if(amtEl&&amt)amtEl.value=amt;
      showToast('Voice input captured 🎙️');
    };
    recognition.start();
  });
}

// ── EXPORT ──
function showExportMenu(){document.getElementById('exportMenu').classList.toggle('open');}
function exportCSV(){
  const headers=['Date','Description','Category','Type','Amount','Note'];
  const rows=S.txs.map(t=>[t.date,`"${t.desc}"`,`"${t.category}"`,t.type,t.amount,`"${t.note||''}"`]);
  const csv=[headers,...rows].map(r=>r.join(',')).join('\n');
  download('spendly_export_'+new Date().toISOString().split('T')[0]+'.csv',csv,'text/csv');
  showToast('CSV exported ✅');document.getElementById('exportMenu').classList.remove('open');
}
function exportJSON(){
  const data={transactions:S.txs,budgets:S.budgets,goals:S.goals,investments:S.investments,wallets:S.wallets,calEvents:S.calEvents,exportedAt:new Date().toISOString()};
  download('spendly_data.json',JSON.stringify(data,null,2),'application/json');
  showToast('JSON exported ✅');document.getElementById('exportMenu').classList.remove('open');
}
function printReport(){document.getElementById('exportMenu').classList.remove('open');window.print();}
function download(filename,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);}
