# Lecture 3 Activity - Fantastic Beasts Sanctuary

This is an individual activity for CSCI 3172 extending the Fantastic Beasts JavaScript array and object application to include UI rendering, array filtering (search), and object removal.

* Date Created: 18 SEP 2026
* Last Modification Date: 18 SEP 2026
* Lab Timberlea URL: https://web.cs.dal.ca/~svekariya/csci3172/activities/lecture3/
* Lab Gitlab URL: https://git.cs.dal.ca/svekariya/csci3172.git

## Authors

* Shreel Vekariya (Student)

## Built With

* HTML, Custom CSS, Bootstrap 4, and Vanilla JavaScript

## Sources Used

* The base HTML, CSS, and JS file structures were provided by the CSCI 3172 Instructor as starter code for the L3V3 exercise.

## Artificial Intelligence Tools Used

* [Gemini](https://gemini.google.com/) - The AI Tool used

### Prompt Used on Gemini

I'm working on my Lecture 3 activity and need to extend the Fantastic Beasts script. Can you help me implement an array filter function so users can search the array by creature name or type, and a way to remove objects from the array based on a unique ID?


The code prompt above was used in Gemini to generate the JavaScript logic for manipulating the `sanctuary` array shown below: 

#### script.js
*Lines 41 - 46*
```javascript
    const filteredCreatures = sanctuary.filter(creature => 
        creature.name.toLowerCase().includes(filterText) || 
        creature.type.toLowerCase().includes(filterText)
    );
The code in script.js was implemented by reading the value from the search input and filtering the main array before passing it to the UI rendering block.

Gemini's Code was used because I needed help structuring the higher-order .filter() array method to check multiple object keys (name and type) simultaneously.

Gemini's Code was modified by integrating it inside my updateSanctuaryUI function so that it runs every time the input event listener fires.

Acknowledgments
Provided base code by CSCI 3172 Instructor.