const words = ["javascript", "programming", "hangman", "developer", "frontend"];
const hints = {
  javascript: "A popular programming language.",
  programming: "The act of writing computer code.",
  hangman: "A classic word-guessing game.",
  developer: "A person who writes code.",
  frontend: "The client-side of web development.",
};

let selectedWord = "";
let guessedLetters = [];
let remainingTries = 0;
let timeRemaining = 60;
let timerInterval;

const wordDisplay = document.getElementById("word-display");
const letterInput = document.getElementById("letter-input");
const guessBtn = document.getElementById("guess-btn");
const message = document.getElementById("message");
const remainingTriesDisplay = document.getElementById("remaining-tries");
const hintBtn = document.getElementById("hint-btn");
const hintDisplay = document.getElementById("hint");
const difficultySelect = document.getElementById("difficulty");
const leaderboardList = document.getElementById("leaderboard-list");

function initializeGame() {
  // Reset values
  selectedWord = words[Math.floor(Math.random() * words.length)];
  guessedLetters = [];
  message.textContent = "";
  hintDisplay.textContent = "";
  hintBtn.disabled = false;
  letterInput.value = "";

  // Set remaining tries based on difficulty
  const difficulty = difficultySelect.value;
  remainingTries = difficulty === "easy" ? 8 : difficulty === "medium" ? 6 : 4;
  remainingTriesDisplay.textContent = remainingTries;

  // Start timer
  clearInterval(timerInterval);
  startTimer();

  // Display word blanks
  updateWordDisplay();
}

function updateWordDisplay() {
  const display = selectedWord
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");
  wordDisplay.textContent = display;

  // Check if the player has won
  if (!display.includes("_")) {
    message.textContent = "Congratulations! You guessed the word!";
    guessBtn.disabled = true;
    clearInterval(timerInterval);
    saveScore();
  }
}

function makeGuess() {
  const letter = letterInput.value.toLowerCase();
  if (!letter || guessedLetters.includes(letter)) {
    message.textContent = "Please enter a new letter.";
    return;
  }

  guessedLetters.push(letter);

  if (selectedWord.includes(letter)) {
    message.textContent = `Good job! "${letter}" is correct.`;
  } else {
    message.textContent = `Oops! "${letter}" is incorrect.`;
    remainingTries--;
    remainingTriesDisplay.textContent = remainingTries;

    if (remainingTries === 0) {
      message.textContent = `Game over! The word was "${selectedWord}".`;
      guessBtn.disabled = true;
      clearInterval(timerInterval);
    }
  }

  updateWordDisplay();
  letterInput.value = "";
}

function startTimer() {
  timeRemaining = 60;
  document.getElementById("time-remaining").textContent = timeRemaining;

  timerInterval = setInterval(() => {
    timeRemaining--;
    document.getElementById("time-remaining").textContent = timeRemaining;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      message.textContent = "Time's up! You lost.";
      guessBtn.disabled = true;
    }
  }, 1000);
}

function saveScore() {
  const name = prompt("Enter your name for the leaderboard:");
  const score = remainingTries * 10;
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderLeaderboard();
}

function renderLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboardList.innerHTML = leaderboard
    .slice(0, 5)
    .map((entry) => `<li>${entry.name}: ${entry.score}</li>`)
    .join("");
}

// Event Listeners
guessBtn.addEventListener("click", makeGuess);
hintBtn.addEventListener("click", () => {
  hintDisplay.textContent = hints[selectedWord] || "No hint available.";
  hintBtn.disabled = true;
});
document.addEventListener("keydown", (event) => {
  const letter = event.key.toLowerCase();
  if (/^[a-z]$/.test(letter)) {
    letterInput.value = letter;
    guessBtn.click();
  }
});

// Initialize the game on page load
initializeGame();
difficultySelect.addEventListener("change", initializeGame);

