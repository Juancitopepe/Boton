const button = document.getElementById("dailyButton");
const info = document.getElementById("info");

// Fecha actual en horario de Argentina (UTC-3)
function getArgentinaDate() {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
}

let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastPress = localStorage.getItem("lastPress");

function updateButton() {
  button.textContent = streak;
}

function canPressToday() {
  if (!lastPress) return true;
  const now = getArgentinaDate();
  const last = new Date(lastPress);
  return now.toDateString() !== last.toDateString();
}

function missedADay() {
  if (!lastPress) return false;
  const now = getArgentinaDate();
  const last = new Date(lastPress);
  const diff = (now - last) / (1000 * 60 * 60 * 24);
  return diff >= 2;
}

function resetIfMissed() {
  if (missedADay()) {
    streak = 0;
    localStorage.setItem("streak", 0);
  }
}

function disableButtonForToday() {
  button.disabled = true;
  info.textContent = "Ya presionaste el botón hoy.";
}

button.addEventListener("click", () => {
  if (!canPressToday()) {
    disableButtonForToday();
    return;
  }

  resetIfMissed();
  streak++;
  updateButton();

  const now = getArgentinaDate();
  localStorage.setItem("streak", streak);
  localStorage.setItem("lastPress", now);

  disableButtonForToday();
  info.textContent = "¡Racha actualizada!";
});

// --- Inicialización ---
resetIfMissed();
updateButton();

// Desactivar si ya se presionó hoy
if (!canPressToday()) disableButtonForToday();
