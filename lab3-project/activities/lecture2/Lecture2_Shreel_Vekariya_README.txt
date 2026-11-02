# Lecture 2 Activity - Magic 8-Ball & Fortune Cookie

This is an individual lab activity for CSCI 3172 extending a Magic 8-Ball JavaScript application to include a Fortune Cookie option.

* Date Created: 16 SEP 2026
* Last Modification Date: 16 SEP 2026
* Lab Timberlea URL: https://web.cs.dal.ca/~svekariya/csci3172/activities/lecture2/
* Lab Gitlab URL: https://git.cs.dal.ca/svekariya/csci3172.git

## Authors

* Shreel Vekariya (sh256647@dal.ca) - (B00944228)

## Built With

* HTML, CSS, and Vanilla JavaScript

## Sources Used

### script.js
*Lines 2 - 18*
const magic8BallAnswers = [ ... ];
const fortuneCookieAnswers = [ ... ];

The text content for the arrays above was sourced from the following links provided in the assignment outline:
- Fortune Cookie sayings: https://www.best-ever-cookie-collection.com/fortune-cookie-sayings.html
- Magic 8-Ball sayings: https://magic-8ball.com/magic-8-ball-answers/

## Artificial Intelligence Tools Used

* [Gemini](https://gemini.google.com/) - The AI Tool used

### Prompt Used on Gemini

I've written most of the JavaScript for my Magic 8-Ball and Fortune Cookie lab, but I am having trouble getting the dropdown menu to correctly switch between the two arrays. Can you help me figure out the logic to grab the value from the select element and use it to choose the right array?


The code prompt above was used in Gemini to generate the code shown below: 

#### script.js
*Lines 26 - 32*

const mode = document.getElementById('modeSelect').value;
let selectedAnswer = "";

if (mode === "8ball") {
    selectedAnswer = getRandomItem(magic8BallAnswers);
} else if (mode === "fortune") {
    selectedAnswer = getRandomItem(fortuneCookieAnswers);
}

- The code in script.js was implemented by reading the value from the HTML select element and using an if/else control structure to pick from the correct list.
- Gemini's Code was used because I needed help structuring the control flow to toggle between the two arrays based on the user's dropdown choice.
- Gemini's Code was modified by integrating it into my existing function and ensuring the variable names matched my previously defined arrays.

## Acknowledgments
* Provided base code by CSCI 3172 Instructor.