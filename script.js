const button = document.getElementById("dailyButton");
const info = document.getElementById("info");

// --- NUEVOS ELEMENTOS ---
const topLeft = document.getElementById("top-left");
const topRight = document.getElementById("top-right");
const bottomLeft = document.getElementById("bottom-left");
const bottomRight = document.getElementById("bottom-right");

// Fecha actual en horario de Argentina (UTC-3)
function getArgentinaDate() {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
}

// --- SISTEMA DEL BOTÓN ---
let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastPress = localStorage.getItem("lastPress");
let bestStreak = parseInt(localStorage.getItem("bestStreak")) || 0;
let streakStart = localStorage.getItem("streakStart");

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

  const now = getArgentinaDate();

  // Si es la primera racha nueva (antes era 0)
  if (streak === 1) {
    streakStart = now;
    localStorage.setItem("streakStart", streakStart);
  }

  // Actualizar mejor racha
  if (streak > bestStreak) {
    bestStreak = streak;
    localStorage.setItem("bestStreak", bestStreak);
    localStorage.setItem("streakStart", streakStart);
  }

  updateButton();
  localStorage.setItem("streak", streak);
  localStorage.setItem("lastPress", now);

  disableButtonForToday();
  info.textContent = "¡Racha actualizada!";
});

// --- Inicialización ---
resetIfMissed();
updateButton();
if (!canPressToday()) disableButtonForToday();

// --- FECHA ARRIBA IZQUIERDA ---
function updateCurrentDate() {
  const now = getArgentinaDate();
  const day = String(now.getDate()).padStart(2, "0");
  const months = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
  const month = months[now.getMonth()];
  const year = String(now.getFullYear()).slice(-2);
  topLeft.textContent = `${day} ${month} ${year}`;
}

// --- TEMPORIZADOR ARRIBA DERECHA ---
function updateCountdown() {
  const now = getArgentinaDate();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // siguiente medianoche
  const diff = midnight - now;

  const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
  const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
  const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

  topRight.textContent = `${hours}:${minutes}:${seconds}`;
}

// --- Racha máxima ABAJO IZQUIERDA ---
function updateBestStreak() {
  bottomLeft.textContent = `MEJOR: ${bestStreak}`;
}

// --- Fecha de inicio ABAJO DERECHA ---
function updateStartDate() {
  if (!streakStart || streak === 0) {
    bottomRight.textContent = "-- --- --";
    return;
  }

  const date = new Date(streakStart);
  const day = String(date.getDate()).padStart(2, "0");
  const months = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
  const month = months[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);
