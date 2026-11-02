// 1. Create arrays of possible answers
const magic8BallAnswers = [
    "It is certain.", "It is decidedly so.", "Without a doubt.",
    "Yes - definitely.", "You may rely on it.", "As I see it, yes.",
    "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.",
    "Reply hazy, try again.", "Ask again later.", "Better not tell you now.",
    "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.",
    "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."
];

const fortuneCookieAnswers = [
    "A beautiful, smart, and loving person will be coming into your life.",
    "A dubious friend may be an enemy in camouflage.",
    "A faithful friend is a strong defense.",
    "A fresh start will put you on your way.",
    "A friend asks only for your time not your money.",
    "A friend is a present you give yourself.",
    "A golden era of prosperity is shining upon you.",
    "A good time to finish up old tasks."
];

// 2. Create a function to fetch the question the user has asked
function getAnswer() {
    // These variables only live while getAnswer() is running
    const questionInput = document.getElementById('userQuestion').value.trim();
    const mode = document.getElementById('modeSelect').value;
    const answerElement = document.getElementById('answer');

    // 3. If the user left the question blank, give them a nudge and stop
    if (questionInput === "") {
        alert("Please enter a question");
        return;
    }

    // Tiny helper for grabbing a random item from an array
    function getRandomItem(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    let selectedAnswer = "";

    // 4. Pick a random answer based on the dropdown choice
    if (mode === "8ball") {
        selectedAnswer = getRandomItem(magic8BallAnswers);
    } else if (mode === "fortune") {
        selectedAnswer = getRandomItem(fortuneCookieAnswers);
    }

    // 5. Show the question and answer back to the user
    answerElement.innerHTML = `<strong>Q:</strong> ${questionInput} <br><br> <strong>A:</strong> ${selectedAnswer}`;

    // 6. Keep a record of the question and answer in the console
    console.log(`Question: ${questionInput}`);
    console.log(`Answer: ${selectedAnswer}`);

    return selectedAnswer;
}