const words = ["javascript", "programming", "hangman", "developer", "frontend"];
const hangmanParts = [
  " O ",
  " | ",
  "/| ",
  "/|\\",
  " | ",
  "/  ",
  "/ \\",
];
let selectedWord = "";
let guessedLetters = [];
let wrongLetters = [];
let remainingTries = hangmanParts.length;

const wordDisplay = document.getElementById("word-display");
const wrongLettersList = document.getElementById("wrong-letters-list");
const hangmanDrawing = document.querySelector("#hangman-drawing pre");
const guessBtn = document.getElementById("guess-btn");
const restartBtn = document.getElementById("restart-btn");
const letterInput = document.getElementById("letter-input");
const message = document.getElementById("message");

function initializeGame() {
  selectedWord = words[Math.floor(Math.random() * words.length)];
  guessedLetters = [];
  wrongLetters = [];
  remainingTries = hangmanParts.length;
  wordDisplay.textContent = getDisplayedWord();
  wrongLettersList.textContent = "";
  hangmanDrawing.textContent = `
+---+
|   |
    |
    |
    |
    |
=======`;
  message.textContent = "";
  letterInput.value = "";
  letterInput.focus();
}

function getDisplayedWord() {
  return selectedWord
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");
}

function updateHangman() {
  const drawing = `
+---+
|   |
${hangmanParts.slice(0, hangmanParts.length - remainingTries).join("\n")}
    |
=======
  `;
  hangmanDrawing.textContent = drawing;
}

function checkGameOver() {
  if (remainingTries <= 0) {
    message.textContent = "Game Over! The word was: " + selectedWord;
    guessBtn.disabled = true;
    return true;
  } else if (!getDisplayedWord().includes("_")) {
    message.textContent = "You Win! 🎉";
    guessBtn.disabled = true;
    return true;
  }
  return false;
}

guessBtn.addEventListener("click", () => {
  const letter = letterInput.value.toLowerCase();
  if (!letter || guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
    message.textContent = "Please enter a valid, unused letter.";
    return;
  }

  if (selectedWord.includes(letter)) {
    guessedLetters.push(letter);
    wordDisplay.textContent = getDisplayedWord();
  } else {
    wrongLetters.push(letter);
    wrongLettersList.textContent = wrongLetters.join(", ");
    remainingTries--;
    updateHangman();
  }

  checkGameOver();
  letterInput.value = "";
  letterInput.focus();
});

restartBtn.addEventListener("click", () => {
  guessBtn.disabled = false;
  initializeGame();
});


initializeGame();

