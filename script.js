let count = 0;
const counter = document.getElementById("counter");
const button = document.getElementById("pixelButton");

button.addEventListener("click", () => {
  count++;
  counter.textContent = count;
});
