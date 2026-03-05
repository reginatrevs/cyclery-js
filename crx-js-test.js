document.addEventListener("DOMContentLoaded", function () {

  const block = document.querySelector(".crx-js-testblock");
  if (!block) return;

  const button = block.querySelector(".crx-js-testblock__btn");
  const result = block.querySelector(".crx-js-testblock__result");

  if (!button || !result) return;

  button.addEventListener("click", function () {
    result.textContent = "JS is working ✔";
    block.style.background = "#e8ffe8";
  });

});