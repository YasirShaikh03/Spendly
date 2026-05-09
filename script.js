// ── STATE ─────────────────────────────────────────────────────
let txs = JSON.parse(localStorage.getItem('spendly_txs') || '[]');
let currentType   = 'expense';
let currentFilter = 'All';
let currentMonth  = new Date().getMonth();
let currentYear   = new Date().getFullYear();
let toastTimer;

// ── CONSTANTS ─────────────────────────────────────────────────
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const CAT_COLORS = {
  '🍔 Food':          '#f4a261',
  '🚌 Transport':     '#457b9d',
  '🛍️ Shopping':      '#e76f51',
  '🏥 Health':        '#2a9d8f',
  '🎬 Entertainment': '#9b5de5',
  '📚 Education':     '#264653',
  '🏠 Housing':       '#6d6875',
  '💼 Salary':        '#2d6a4f',
  '💰 Other Income':  '#95d5b2',
  '📦 Other':         '#a8dadc'
};

// ── INIT ──────────────────────────────────────────────────────
document.getElementById('date').value = new Date().toISOString().split('T')[0];
updateMonthLabel();
render();

// Enter key shortcut
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTransaction();
});

// ── TYPE TOGGLE ───────────────────────────────────────────────
function setType(type) {
  currentType = type;
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.${type}-btn`).classList.add('active');
}

// ── MONTH NAVIGATION ──────────────────────────────────────────
function changeMonth(dir) {
  currentMonth += dir;
  if (currentMonth > 11) { currentMonth = 0;  currentYear++; }
  if (currentMonth < 0)  { currentMonth = 11; currentYear--; }
  updateMonthLabel();
  render();
}

function updateMonthLabel() {
  document.getElementById('monthLabel').textContent =
    MONTHS[currentMonth] + ' ' + currentYear;
}

// ── FILTER ────────────────────────────────────────────────────
function filterCat(cat, el) {
  currentFilter = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  render();
}

// ── ADD TRANSACTION ───────────────────────────────────────────
function addTransaction() {
  const desc     = document.getElementById('desc').value.trim();
  const amount   = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date     = document.getElementById('date').value;

  // Validation
  if (!desc)              { showToast('Please enter a description ✏️'); return; }
  if (!amount || amount <= 0) { showToast('Enter a valid amount 💸');   return; }
  if (!date)              { showToast('Pick a date 📅');                return; }

  // Push new transaction to front
  txs.unshift({
    id: Date.now(),
    desc,
    amount,
    category,
    date,
    type: currentType
  });

  save();

  // Clear inputs
  document.getElementById('desc').value   = '';
  document.getElementById('amount').value = '';

  showToast(currentType === 'expense' ? 'Expense added! 💸' : 'Income added! 💰');
  render();
}

// ── DELETE TRANSACTION ────────────────────────────────────────
function deleteTx(id) {
  txs = txs.filter(t => t.id !== id);
  save();
  render();
  showToast('Deleted 🗑️');
}

// ── SAVE TO LOCALSTORAGE ──────────────────────────────────────
function save() {
  localStorage.setItem('spendly_txs', JSON.stringify(txs));
}

// ── MAIN RENDER ───────────────────────────────────────────────
function render() {
  // Filter to current month
  const monthTxs = txs.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // Totals
  const income  = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  document.getElementById('totalIncome').textContent  = fmt(income);
  document.getElementById('totalExpense').textContent = fmt(expense);
  document.getElementById('totalBalance').textContent = fmt(balance);

  // Apply filter
  let visible = monthTxs;
  if (currentFilter === 'expense') visible = monthTxs.filter(t => t.type === 'expense');
  if (currentFilter === 'income')  visible = monthTxs.filter(t => t.type === 'income');

  // Render list
  const list = document.getElementById('txList');
  if (visible.length === 0) {
    list.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🪙</div>
        <p>No transactions yet.<br>Add your first one above!</p>
      </div>`;
  } else {
    list.innerHTML = visible.map(t => `
      <div class="tx-item">
        <div class="tx-icon" style="background:${CAT_COLORS[t.category] || '#ddd'}22">
          ${t.category.split(' ')[0]}
        </div>
        <div class="tx-body">
          <div class="tx-name">${t.desc}</div>
          <div class="tx-meta">${t.category.replace(/^\S+\s/, '')} · ${fmtDate(t.date)}</div>
        </div>
        <div class="tx-right">
          <div class="tx-amount ${t.type === 'income' ? 'inc' : 'exp'}">
            ${t.type === 'income' ? '+' : '-'}${fmt(t.amount)}
          </div>
        </div>
        <button class="tx-del" onclick="deleteTx(${t.id})">✕</button>
      </div>
    `).join('');
  }

  // Render donut chart
  renderDonut(monthTxs);
}

// ── DONUT CHART ───────────────────────────────────────────────
function renderDonut(monthTxs) {
  const expenses = monthTxs.filter(t => t.type === 'expense');
  const income   = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const total    = expenses.reduce((s, t) => s + t.amount, 0);

  const chartSection = document.getElementById('chartSection');
  if (total === 0) {
    chartSection.style.display = 'none';
    return;
  }
  chartSection.style.display = 'block';

  // Group by category
  const groups = {};
  expenses.forEach(t => {
    groups[t.category] = (groups[t.category] || 0) + t.amount;
  });
  const entries = Object.entries(groups).sort((a, b) => b[1] - a[1]);

  // Draw on canvas
  const canvas = document.getElementById('donut');
  const ctx    = canvas.getContext('2d');
  ctx.clearRect(0, 0, 130, 130);

  const cx = 65, cy = 65, r = 55, ir = 38;
  let start = -Math.PI / 2;

  entries.forEach(([cat, val]) => {
    const angle = (val / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = CAT_COLORS[cat] || '#ccc';
    ctx.fill();
    start += angle;
  });

  // Donut hole
  ctx.beginPath();
  ctx.arc(cx, cy, ir, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();

  // Percentage label
  const pct = income > 0 ? Math.round((total / income) * 100) : 100;
  document.getElementById('donutPct').textContent = pct + '%';

  // Legend
  const leg = document.getElementById('legend');
  leg.innerHTML = entries.slice(0, 5).map(([cat, val]) => `
    <div class="leg-item">
      <div class="leg-dot" style="background:${CAT_COLORS[cat] || '#ccc'}"></div>
      <span class="leg-label">${cat.replace(/^\S+\s/, '')}</span>
      <span class="leg-val">${fmt(val)}</span>
    </div>
  `).join('');
}

// ── HELPERS ───────────────────────────────────────────────────
function fmt(n) {
  return '₹' + n.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

function fmtDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}