/**
 * HOW TO RUN LOCALLY (from the lab2 folder):
 *   npm init -y && npm install cheerio
 *   node scraper/scraper.js                                   (reads the local sample directory page)
 *   node scraper/scraper.js https://example.com/events.html   (fetches a live page, Node 18+)
 */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const DEFAULT_SOURCE = path.join(__dirname, 'source', 'events_directory.html');
const OUTPUT_FILE = path.join(__dirname, '..', 'search_index.json');

const loadHtml = async (source) => {
    if (/^https?:\/\//.test(source)) {
        const response = await fetch(source);
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        return response.text();
    }
    return fs.readFileSync(source, 'utf8');
};

const parseEvents = (html) => {
    const $ = cheerio.load(html);
    return $('.event-card').map((_, el) => {
        const card = $(el);
        const text = (selector) => card.find(selector).text().trim();
        return {
            id: card.attr('data-id'),
            title: text('.title'),
            organization: text('.org'),
            category: text('.category'),
            location: text('.loc'),
            date: text('.date'),
            isoDate: card.find('.date').attr('datetime'),
            time: text('.time'),
            description: text('.desc')
        };
    }).get();
};

const main = async () => {
    const source = process.argv[2] || DEFAULT_SOURCE;
    const events = parseEvents(await loadHtml(source));
    if (events.length === 0) throw new Error('No .event-card elements found.');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(events, null, 2));
    console.log(`Scraped ${events.length} events from ${source} into search_index.json`);
};

main().catch((error) => { console.error(error.message); process.exit(1); });
