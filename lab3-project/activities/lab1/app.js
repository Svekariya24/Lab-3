'use strict';

const THEME_KEY = 'x21-theme';
const state = {
  stocks: [],
  byId: new Map(),          // ticker -> stock object (fast lookup)
  sectors: new Set(),       // unique sectors
  tags: new Set(),          // unique tags
  query: '',
  sector: 'all',
  sort: 'id',
  activeTag: null,
};

let activeChart = null; // Store the Chart instance

const $ = (selector) => document.querySelector(selector);
const money = (n) => `$${n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const pct = (n) => `${n > 0 ? '+' : ''}${n.toFixed(2)}%`;
const dir = (n) => (n >= 0 ? 'up' : 'down');

/* ---------- Theme (dark / light) ---------- */
const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  const btn = $('#themeToggle');
  btn.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  btn.setAttribute('aria-pressed', String(theme === 'dark'));
};

const initTheme = () => {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (err) { saved = null; }
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || preferred);
  $('#themeToggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* storage unavailable */ }
  });
};

/* ---------- Data loading (async fetch of data.json) ---------- */
const loadData = async () => {
  const response = await fetch('data.json');
  if (!response.ok) throw new Error(`HTTP ${response.status} while loading data.json`);
  const stocks = await response.json();

  state.stocks = stocks;
  state.byId = new Map(stocks.map((s) => [s.id, s]));
  state.sectors = new Set(stocks.map((s) => s.sector));
  state.tags = new Set(stocks.flatMap((s) => s.tags));
};

/* ---------- Chart.js Integration ---------- */
const renderChart = (ticker) => {
    const stock = state.byId.get(ticker); // Quick Map lookup
    if (!stock || !stock.history) return;

    const ctx = $('#stockChart').getContext('2d');
    
    if (activeChart) {
        activeChart.destroy(); // Clear existing chart
    }

    const isDark = document.documentElement.dataset.theme === 'dark';
    const accentColor = isDark ? '#7d92ff' : '#2f4bff';

    activeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Today'],
            datasets: [{
                label: `${stock.id} Performance`,
                data: stock.history,
                borderColor: accentColor,
                backgroundColor: isDark ? 'rgba(125, 146, 255, 0.1)' : 'rgba(47, 75, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true } }
        }
    });
};

/* ---------- Filtering + sorting with array methods ---------- */
const getVisible = () => {
  const q = state.query.trim().toLowerCase();
  const filtered = state.stocks
    .filter((s) => state.sector === 'all' || s.sector === state.sector)
    .filter((s) => !state.activeTag || s.tags.includes(state.activeTag))
    .filter((s) => !q || [s.id, s.name, ...s.tags].some((field) => field.toLowerCase().includes(q)));

  const sorters = {
    'id': (a, b) => a.id.localeCompare(b.id),
    'change-desc': (a, b) => b.change - a.change,
    'change-asc': (a, b) => a.change - b.change,
    'price-desc': (a, b) => b.price - a.price,
    'cap-desc': (a, b) => b.marketCap - a.marketCap,
  };
  return [...filtered].sort(sorters[state.sort]);
};

/* ---------- Rendering ---------- */
const renderCards = (list) => {
  $('#stockGrid').innerHTML = list.map(({ id, name, sector, exchange, price, change, marketCap, blurb }) => `
    <article class="card" style="cursor:pointer;" onclick="renderChart('${id}')">
      <div class="card-head"><span class="ticker">${id}</span><span class="price">${money(price)}</span></div>
      <div>${name}</div>
      <div class="change ${dir(change)}">${pct(change)} today</div>
      <div class="meta">${sector} on ${exchange}, market cap $${marketCap}B</div>
      <div class="meta">${blurb}</div>
      <button class="btn ghost" style="margin-top:10px;" type="button" data-symbol="${id}">Test in HTTP lab</button>
    </article>`).join('');
  $('#emptyState').hidden = list.length > 0;
  $('#resultCount').textContent = `${list.length} of ${state.stocks.length} stocks shown`;
};

const renderSummary = (list) => {
  const count = list.length;
  const avg = count ? list.reduce((sum, s) => sum + s.change, 0) / count : 0;
  const leader = list.reduce((best, s) => (!best || s.change > best.change ? s : best), null);
  const rows = [
    ['Stocks shown', count],
    ['Average move', pct(avg)],
    ['Top mover', leader ? `${leader.id} ${pct(leader.change)}` : 'none'],
    ['Sectors', state.sectors.size],
  ];
  $('#summary').innerHTML = rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
};

const renderTags = () => {
  $('#tagBar').innerHTML = [...state.tags].sort().map((tag) =>
    `<button class="chip" type="button" data-tag="${tag}" aria-pressed="${state.activeTag === tag}">${tag}</button>`).join('');
};

const refresh = () => {
  const list = getVisible();
  renderCards(list);
  renderSummary(list);
  renderTags();
};

/* ---------- Controls ---------- */
const initControls = () => {
  $('#sectorSelect').insertAdjacentHTML('beforeend',
    [...state.sectors].sort().map((sec) => `<option value="${sec}">${sec}</option>`).join(''));

  $('#searchInput').addEventListener('input', (e) => { state.query = e.target.value; refresh(); });
  $('#sectorSelect').addEventListener('change', (e) => { state.sector = e.target.value; refresh(); });
  $('#sortSelect').addEventListener('change', (e) => { state.sort = e.target.value; refresh(); });

  $('#tagBar').addEventListener('click', (e) => {
    const chip = e.target.closest('[data-tag]');
    if (!chip) return;
    state.activeTag = state.activeTag === chip.dataset.tag ? null : chip.dataset.tag;
    refresh();
  });

  $('#stockGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-symbol]');
    if (!btn) return;
    e.stopPropagation(); // Prevent chart render when clicking HTTP button
    $('#symbolInput').value = btn.dataset.symbol;
    $('#httpForm').requestSubmit();
    $('#http').scrollIntoView({ behavior: 'smooth' });
  });
};

/* ---------- HTTP visualizer ---------- */
const buildRequest = ({ method, symbol, note }) => {
  const host = 'api.21x.example';
  const headers = { Host: host, 'User-Agent': 'x21-web/1.0 (Lab1)', Accept: 'application/json' };
  let path = `/v1/stocks/${encodeURIComponent(symbol)}`;
  let body = '';

  if (method === 'POST') {
    path = '/v1/watchlist';
    body = JSON.stringify({ symbol, note }, null, 2);
    headers['Content-Type'] = 'application/json';
    headers['Content-Length'] = new Blob([body]).size;
  }
  const headerText = [`${method} ${path} HTTP/1.1`, ...Object.entries(headers).map(([k, v]) => `${k}: ${v}`)].join('\n');
  return { headerText, body };
};

const buildResponse = ({ method, symbol }) => {
  const stock = state.byId.get(symbol);
  if (!stock) {
    return `HTTP/1.1 404 Not Found\nContent-Type: application/json\n\n${JSON.stringify({ error: `Unknown ticker ${symbol}` }, null, 2)}`;
  }
  if (method === 'POST') {
    return `HTTP/1.1 201 Created\nContent-Type: application/json\n\n${JSON.stringify({ added: stock.id, watching: true }, null, 2)}`;
  }
  const { id, name, price, change } = stock;
  return `HTTP/1.1 200 OK\nContent-Type: application/json\n\n${JSON.stringify({ id, name, price, change }, null, 2)}`;
};

const initHttpLab = () => {
  const methodSelect = $('#methodSelect');
  methodSelect.addEventListener('change', () => { $('#noteField').hidden = methodSelect.value !== 'POST'; });

  $('#httpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = {
      method: methodSelect.value,
      symbol: $('#symbolInput').value.trim().toUpperCase(),
      note: $('#noteInput').value.trim(),
    };
    const { headerText, body } = buildRequest(input);
    $('#reqHeaders').textContent = headerText;
    $('#reqBody').textContent = body || '(empty: GET requests carry no body)';
    $('#resOut').textContent = buildResponse(input);
  });
};

/* ---------- Boot ---------- */
const init = async () => {
  initTheme();
  initHttpLab();
  try {
    await loadData();
    initControls();
    refresh();
    renderChart(state.stocks[0].id); // Load the first stock chart on boot
  } catch (err) {
    $('#stockGrid').textContent = `Could not load stock data. ${err.message}. Serve this folder over HTTP (not file://).`;
  }
};

document.addEventListener('DOMContentLoaded', init);