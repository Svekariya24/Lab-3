# Lab 2 - Campus Connect Event Finder

A web scraper, JSON search index, and highly accessible real-time search interface built to WCAG AA standards.

* Date Created: 19 OCT 2026
* Last Modification Date: 19 OCT 2026
* Lab Timberlea URL: https://web.cs.dal.ca/~svekariya/csci3172/labs/lab2/index.html
* Lab Gitlab URL: https://git.cs.dal.ca/svekariya/csci3172.git 

## Authors

* Shreel Vekariya (Student)

## Built With

* HTML5 - Semantic Markup
* CSS3 - WCAG AA Contrast Styling 
* Vanilla JavaScript - Real-time filtering and DOM manipulation
* [Node.js & Cheerio](https://cheerio.js.org/) - Used to scrape and parse the raw HTML into JSON

## Scraper Documentation

The scraping script (`scraper.js`) was built using Node.js and the `cheerio` parsing library. It targets a simulated university event directory structure consisting of nested HTML `<div>` elements representing event cards. The script iterates through the DOM, programmatically extracting distinct attributes per record (Title, Organization, Location, and Date) using specific CSS class selectors, and exports the clean dataset directly into `search_index.json`.

## Accessibility Self-Audit Log

* **Colour Contrast:** I ran the UI through the Firefox Accessibility Inspector. The dark theme utilizes `#ffffff` text on `#121212` backgrounds, yielding a contrast ratio well above the minimum 4.5:1 standard mandated by WCAG AA. 
* **Keyboard Navigation:** I disconnected my mouse and tested the interface exclusively using the Tab, Shift+Tab, and Enter keys. A custom `#00ffcc` focus ring with an outline-offset was applied to the search input, clear button, and individual result cards, ensuring focus flows logically from top to bottom with high visibility.
* **ARIA Live Regions:** I implemented a hidden `<div>` with `aria-live="polite"` and `aria-atomic="true"`. Testing with a screen reader confirmed that as I typed into the search bar, the UI dynamically announced "Showing X events" or "No results found" without stealing focus away from the input field.

## Sources Used

* No external code sources were used aside from standard MDN Web Docs for JavaScript array methods.

## Artificial Intelligence Tools Used

* [Gemini](https://gemini.google.com/) - The AI Tool used

## Prompt Used on Gemini

I'm building a real-time JavaScript search filter for my lab. The array filtering is working, but how do I properly implement an "aria-live" region to dynamically announce the updated count of search results to screen reader users as they type, without breaking their focus on the input box?


The code prompt above was used in Gemini to generate the ARIA announcement logic shown below: 

## app.js
*Lines 44 - 63*

```javascript
        if (results.length === 0) {
            resultsGrid.classList.add('hidden');
            emptyState.classList.remove('hidden');
            emptyState.innerHTML = `<p>No results found for '<strong>${query}</strong>'. Please try a different title or location.</p>`;
            
            // Screen reader announcement
            liveAnnouncer.textContent = `No results found for ${query}.`;
        } else {
            resultsGrid.classList.remove('hidden');
            emptyState.classList.add('hidden');

            // ... (Card rendering logic omitted for brevity) ...

            // Screen reader announcement dynamically updates
            liveAnnouncer.textContent = `Showing ${results.length} event${results.length !== 1 ? 's' : ''}.`;
        }
The code in app.js was implemented by grabbing a hidden div with aria-live="polite" and updating its textContent immediately after the DOM renders the new search results.

Gemini's Code was used because I needed help understanding exactly how and when to trigger ARIA announcements without interrupting the user's keyboard typing flow.

Gemini's Code was modified by integrating it into my existing renderResults function and tailoring the string interpolation to match my Campus Connect event dataset.

# Acknowledgments
Provided Lab 2 instructions, Rubric, and WCAG standards by CSCI 3172 Instructor.