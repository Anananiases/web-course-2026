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