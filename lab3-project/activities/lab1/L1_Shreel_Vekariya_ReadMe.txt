# Lab 1 - 21x Stock Analytics Dashboard

This is an individual lab activity for CSCI 3172 building a dynamic, client-side web application that processes structured JSON data, manipulates DOM elements, and simulates HTTP transactions.

* Date Created: 28 SEP 2026
* Last Modification Date: 28 SEP 2026
* Lab Timberlea URL: https://web.cs.dal.ca/~svekariya/csci3172/labs/lab1/index.html
* Lab Gitlab URL: https://git.cs.dal.ca/svekariya/csci3172.git

## Authors

* Name: Vekariya, Shreel
* Banner/B00: [Insert your B00 number here]
* CSID: svekariya

## Project Description
21x is a fictional stock analytics startup featuring a stock screener (search, filter, dark/light theme) and an HTTP request lab.

## Data Structure Justification
I used an ES6 Map keyed by ticker (`state.byId`) because the HTTP lab needs to look up one stock by its unique ID many times, and `Map.get()` does that in constant time without scanning the array on every request. Keys stay unique by design, which also mirrors how a real API resolves `/stocks/{symbol}`.

I used ES6 Sets (`state.sectors` and `state.tags`) to collect unique sector and tag values from the dataset. A Set removes duplicates automatically, so the dropdown and tag chips are built from the data itself instead of being hardcoded, and they stay correct if `data.json` changes. The visible list is produced with `.filter()`, `.sort()` on a copy, and `.reduce()` for the summary stats.

## Built With & Sources
* HTML, Custom CSS (Light/Dark Mode), Vanilla JavaScript, JSON
* Fonts: Bricolage Grotesque and IBM Plex Sans via Google Fonts.
* Chart.js Library: https://www.chartjs.org/ (Used to visually render the stock history arrays from data.json into an interactive line graph).
* Stock data in data.json is fictional/illustrative sample data written for this lab.

## Artificial Intelligence Tools Used

* [Gemini](https://gemini.google.com/) - The AI Tool used

### Prompt Used on Gemini

I've built the core logic and grid rendering for my Lab 1 stock screener. Can you help me integrate the external Chart.js library into my existing codebase? I want a line chart to appear at the top of the page that updates whenever a user clicks on one of the dynamically rendered stock cards.


The code prompt above was used in Gemini to generate the specific Chart.js instantiation and update logic shown below: 

#### app.js
*Lines 55 - 88*
```javascript
const renderChart = (ticker) => {
    const stock = state.byId.get(ticker); 
    if (!stock || !stock.history) return;

    const ctx = $('#stockChart').getContext('2d');
    
    if (activeChart) {
        activeChart.destroy(); 
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
The code in app.js was implemented by grabbing the <canvas> element from the DOM and passing it into a new Chart instance, pulling the historical data points from the state.byId ES6 Map.

Gemini's Code was used because I wanted to enhance the visual UI of the project by reading data from my JSON file and plotting it graphically, and I needed help with the Chart.js specific syntax.

Gemini's Code was modified by ensuring the chart's colors dynamically adapt to the application's existing Light/Dark mode state variable.

Acknowledgments
Provided Lab 1 instructions and requirements by CSCI 3172 Instructor.