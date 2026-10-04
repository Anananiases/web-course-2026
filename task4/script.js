"use strict";

const DIGITS_COUNT = 4;
const DIGITS_RANGE = 10;

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