const SAVED_KEY = 'campusConnectSaved';
const THEME_KEY = 'campusConnectTheme';
const SEARCH_FIELDS = ['title', 'organization', 'category', 'location', 'date', 'description'];

const $ = (id) => document.getElementById(id);
const els = {
    input: $('searchInput'), clear: $('clearBtn'), surprise: $('surpriseBtn'), form: $('searchForm'),
    grid: $('resultsGrid'), empty: $('emptyState'), live: $('liveAnnouncer'), count: $('resultCount'),
    orgs: $('orgFilters'), sort: $('sortSelect'), upcoming: $('upcomingOnly'), savedOnly: $('savedOnly'),
    next: $('nextEvent'), theme: $('themeBtn')
};

const state = { events: [], saved: new Set(), open: new Set() };
const today = new Date(new Date().toDateString());

const escapeHtml = (text) => text.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const highlight = (text, query) => {
    const safe = escapeHtml(text);
    if (!query) return safe;
    const pattern = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return safe.replace(new RegExp(`(${pattern})`, 'gi'), '<mark>$1</mark>');
};

const loadSaved = () => {
    try { state.saved = new Set(JSON.parse(localStorage.getItem(SAVED_KEY)) || []); } catch { state.saved = new Set(); }
};
const persistSaved = () => {
    try { localStorage.setItem(SAVED_KEY, JSON.stringify([...state.saved])); } catch { /* storage unavailable */ }
};

const eventDate = (item) => new Date(`${item.isoDate}T00:00:00`);
const daysUntil = (item) => Math.round((eventDate(item) - today) / 86400000);
const isUpcoming = (item) => daysUntil(item) >= 0;

const dayLabel = (n) => (n === 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`);

const getVisibleEvents = () => {
    const query = els.input.value.trim().toLowerCase();
    const checkedOrgs = [...els.orgs.querySelectorAll('input:checked')].map((box) => box.value);
    const results = state.events.filter((item) => {
        const matchesQuery = !query || SEARCH_FIELDS.some((field) => item[field].toLowerCase().includes(query));
        const matchesOrg = checkedOrgs.length === 0 || checkedOrgs.includes(item.organization);
        const matchesUpcoming = !els.upcoming.checked || isUpcoming(item);
        const matchesSaved = !els.savedOnly.checked || state.saved.has(item.id);
        return matchesQuery && matchesOrg && matchesUpcoming && matchesSaved;
    });
    const sorters = {
        'date-asc': (a, b) => eventDate(a) - eventDate(b),
        'date-desc': (a, b) => eventDate(b) - eventDate(a),
        title: (a, b) => a.title.localeCompare(b.title)
    };
    return results.sort(sorters[els.sort.value]);
};

const cardHtml = (item, query) => {
    const open = state.open.has(item.id);
    const saved = state.saved.has(item.id);
    const days = daysUntil(item);
    const status = days >= 0 ? `Upcoming, ${dayLabel(days)}` : 'Past event';
    return `
    <article class="card ${days < 0 ? 'past' : ''}" data-id="${item.id}">
        <h3>${highlight(item.title, query)}</h3>
        <div class="tags"><span class="tag">${highlight(item.organization, query)}</span><span class="tag">${highlight(item.category, query)}</span></div>
        <p><strong>Location:</strong> ${highlight(item.location, query)}</p>
        <p><strong>Date:</strong> ${highlight(item.date, query)} at ${escapeHtml(item.time)}</p>
        <p class="badge">${status}</p>
        ${open ? `<div class="details" id="details-${item.id}"><p>${highlight(item.description, query)}</p></div>` : ''}
        <div class="card-actions">
            <button type="button" data-action="toggle" aria-expanded="${open}" aria-controls="details-${item.id}">${open ? 'Hide details' : 'Show details'}</button>
            <button type="button" data-action="save" aria-pressed="${saved}" aria-label="Save ${escapeHtml(item.title)}">${saved ? 'Saved' : 'Save'}</button>
            <button type="button" data-action="ics" aria-label="Add ${escapeHtml(item.title)} to calendar">Add to calendar</button>
        </div>
    </article>`;
};

const render = ({ announce = true } = {}) => {
    const query = els.input.value.trim();
    const results = getVisibleEvents();
    const total = state.events.length;
    const summary = `Showing ${results.length} of ${total} event${total !== 1 ? 's' : ''}`;
    els.count.textContent = summary;

    if (results.length === 0) {
        els.grid.classList.add('hidden');
        els.empty.classList.remove('hidden');
        const shown = query ? `'${escapeHtml(query)}'` : 'these filters';
        els.empty.innerHTML = `<p>No results found for ${shown}.</p><p>Try a shorter word, a building name, or clear your filters.</p>`;
        if (announce) els.live.textContent = `No results found for ${query || 'these filters'}.`;
        return;
    }
    els.empty.classList.add('hidden');
    els.grid.classList.remove('hidden');
    els.grid.innerHTML = results.map((item) => cardHtml(item, query)).join('');
    if (announce) els.live.textContent = `${summary}.`;
};

const renderNextUp = () => {
    const next = state.events.filter(isUpcoming).sort((a, b) => eventDate(a) - eventDate(b))[0];
    els.next.textContent = next
        ? `${next.title}, ${dayLabel(daysUntil(next))} (${next.date}) at ${next.location}.`
        : 'No upcoming events are listed. Check back soon.';
};

const buildOrgFilters = () => {
    const orgs = [...new Set(state.events.map((item) => item.organization))].sort();
    els.orgs.insertAdjacentHTML('beforeend', orgs.map((org) =>
        `<label class="check"><input type="checkbox" value="${escapeHtml(org)}"> ${escapeHtml(org)}</label>`).join(''));
};

const downloadIcs = (item) => {
    const day = item.isoDate.replace(/-/g, '');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Campus Connect//EN', 'BEGIN:VEVENT',
        `UID:${item.id}@campusconnect`, `DTSTAMP:${day}T000000Z`, `DTSTART;VALUE=DATE:${day}`,
        `SUMMARY:${item.title}`, `LOCATION:${item.location}`, `DESCRIPTION:${item.description}`,
        'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    link.download = `${item.title.replace(/\W+/g, '-').toLowerCase()}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
    els.live.textContent = `Calendar file downloaded for ${item.title}.`;
};

const handleCardClick = (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const id = button.closest('.card').dataset.id;
    const item = state.events.find((e) => e.id === id);
    const { action } = button.dataset;
    if (action === 'toggle') {
        state.open.has(id) ? state.open.delete(id) : state.open.add(id);
    } else if (action === 'save') {
        state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id);
        persistSaved();
        els.live.textContent = `${item.title} ${state.saved.has(id) ? 'saved' : 'removed from saved'}.`;
    } else if (action === 'ics') {
        downloadIcs(item);
        return;
    }
    render({ announce: false });
    els.grid.querySelector(`[data-id="${id}"] [data-action="${action}"]`)?.focus();
};

const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    els.theme.setAttribute('aria-pressed', String(theme === 'light'));
    els.theme.textContent = theme === 'light' ? 'Dark theme' : 'Light theme';
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* storage unavailable */ }
};

const syncUrl = () => {
    const url = new URL(window.location);
    els.input.value.trim() ? url.searchParams.set('q', els.input.value.trim()) : url.searchParams.delete('q');
    history.replaceState(null, '', url);
};

const bindEvents = () => {
    els.form.addEventListener('submit', (e) => e.preventDefault());
    els.input.addEventListener('input', () => { syncUrl(); render(); });
    els.form.addEventListener('change', () => render());
    els.grid.addEventListener('click', handleCardClick);
    els.clear.addEventListener('click', () => {
        els.input.value = '';
        els.form.querySelectorAll('input[type="checkbox"]').forEach((box) => { box.checked = false; });
        syncUrl(); render(); els.input.focus();
    });
    els.surprise.addEventListener('click', () => {
        const pool = state.events.filter(isUpcoming);
        const pick = pool[Math.floor(Math.random() * pool.length)];
        if (!pick) return;
        els.input.value = pick.title;
        state.open.add(pick.id);
        syncUrl(); render();
    });
    els.theme.addEventListener('click', () =>
        setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'));
    document.addEventListener('keydown', (e) => {
        const typing = ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName);
        if (e.key === '/' && !typing) { e.preventDefault(); els.input.focus(); }
    });
};

const init = async () => {
    loadSaved();
    try { setTheme(localStorage.getItem(THEME_KEY) || 'dark'); } catch { setTheme('dark'); }
    bindEvents();
    try {
        const response = await fetch('search_index.json');
        state.events = await response.json();
    } catch (error) {
        els.empty.classList.remove('hidden');
        els.empty.textContent = 'Events could not be loaded. Check your connection and reload the page.';
        return;
    }
    els.input.value = new URLSearchParams(window.location.search).get('q') || '';
    buildOrgFilters();
    renderNextUp();
    render({ announce: false });
};

init();
