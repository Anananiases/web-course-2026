"use strict";

const DIGITS_COUNT = 4;
const DIGITS_RANGE = 10;
const state = {
  secret: "",
  history: [],
  isOver: false,
};

const dom = {
  input: document.getElementById("guess-input"),
  checkBtn: document.getElementById("check-btn"),
  newGameBtn: document.getElementById("new-game-btn"),
  errorMessage: document.getElementById("error-message"),
  attemptsCount: document.getElementById("attempts-count"),
  historyList: document.getElementById("history-list"),
};

function createSecretNumber() {
  const pool = Array.from({ length: DIGITS_RANGE }, (_, i) => String(i));
  const digits = [];

  while (digits.length < DIGITS_COUNT) {
    const index = Math.floor(Math.random() * pool.length);
    digits.push(pool.splice(index, 1)[0]);
  }

  return digits.join("");
}

function validateGuess(raw) {
  const value = String(raw).trim();

  if (value.length === 0) {
    return { valid: false, error: "Введите число." };
  }

  if (!/^\d+$/.test(value)) {
    return { valid: false, error: "Только цифры, без букв и символов." };
  }

  if (value.length !== DIGITS_COUNT) {
    return { valid: false, error: `Нужно ровно ${DIGITS_COUNT} цифры.` };
  }

  const uniqueDigits = new Set(value);
  if (uniqueDigits.size !== DIGITS_COUNT) {
    return { valid: false, error: "Цифры не должны повторяться." };
  }

  return { valid: true };
}

function countBullsAndCows(secret, guess) {
  let bulls = 0;
  let cows = 0;

  for (let i = 0; i < secret.length; i += 1) {
    if (guess[i] === secret[i]) {
      bulls += 1;
    } else if (secret.includes(guess[i])) {
      cows += 1;
    }
  }

  return { bulls, cows };
}

function pluralize(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

function formatResult({ bulls, cows }) {
  const bullsText = `${bulls} ${pluralize(bulls, "бык", "быка", "быков")}`;
  const cowsText = `${cows} ${pluralize(cows, "корова", "коровы", "коров")}`;
  return `${bullsText}, ${cowsText}`;
}

function createHistoryItem(attempt, index) {
  const li = document.createElement("li");
  li.className = "history-item";

  const isWin = attempt.bulls === DIGITS_COUNT;
  if (isWin) {
    li.classList.add("history-item--win");
  }

  const guessSpan = document.createElement("span");
  guessSpan.className = "history-item__guess";
  guessSpan.textContent = `${index + 1}. ${attempt.guess}`;

  const resultSpan = document.createElement("span");
  resultSpan.className = "history-item__result";
  resultSpan.textContent = isWin ? "🏆 Победа!" : formatResult(attempt);

  li.append(guessSpan, resultSpan);
  return li;
}

function render() {
  dom.attemptsCount.textContent = String(state.history.length);

  dom.historyList.innerHTML = "";
  const fragment = document.createDocumentFragment();
  state.history.forEach((attempt, index) => {
    fragment.appendChild(createHistoryItem(attempt, index));
  });
  dom.historyList.appendChild(fragment);

  dom.input.disabled = state.isOver;
  dom.checkBtn.disabled = state.isOver;

  dom.historyList.scrollTop = dom.historyList.scrollHeight;
}

function showError(message) {
  dom.errorMessage.textContent = message;
}

function clearError() {
  dom.errorMessage.textContent = "";
}

function startNewGame() {
  state.secret = createSecretNumber();
  state.history = [];
  state.isOver = false;

  dom.input.value = "";
  dom.input.disabled = false;
  dom.checkBtn.disabled = false;

  render();
  dom.input.focus();
}

function handleGuess() {
  if (state.isOver) return;

  const raw = dom.input.value;
  const { valid, error } = validateGuess(raw);

  if (!valid) {
    showError(error);
    return;
  }

  clearError();

  const { bulls, cows } = countBullsAndCows(state.secret, raw);
  state.history.push({ guess: raw, bulls, cows });

  if (bulls === DIGITS_COUNT) {
    state.isOver = true;
    showError(
      `🎉 Победа! Угадано за ${state.history.length} ` +
      `${pluralize(state.history.length, "попытку", "попытки", "попыток")}.`
    );
  }

  dom.input.value = "";
  render();

  if (!state.isOver) {
    dom.input.focus();
  }
}
function init() {
  dom.checkBtn.addEventListener("click", handleGuess);
  dom.newGameBtn.addEventListener("click", startNewGame);
  dom.input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleGuess();
  });

  startNewGame();
}

document.addEventListener("DOMContentLoaded", init);