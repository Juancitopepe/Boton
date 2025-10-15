const button = document.getElementById("dailyButton");
const info = document.getElementById("info");
const topLeft = document.getElementById("top-left");
const topRight = document.getElementById("top-right");
const bottomLeft = document.getElementById("bottom-left");
const bottomRight = document.getElementById("bottom-right");

// Fecha actual en horario argentino
function getArgentinaDate() {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
}

let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastPress = localStorage.getItem("lastPress") ? new Date(localStorage.getItem("lastPress")) : null;
let bestStreak = parseInt(localStorage.getItem("bestStreak")) || 0;
let streakStart = localStorage.getItem("streakStart");

// --- Funciones base ---
function updateButton() {
  button.textContent = streak;
}

function getDayString(date) {
  return date.toLocaleDateString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
}

function canPressToday() {
  const now = getArgentinaDate();
  if (!lastPress) return true;
  return getDayString(now) !== getDayString(lastPress);
}

function missedADay() {
  if (!lastPress) return false;
  const now = getArgentinaDate();
  const diff = (now - lastPress) / (1000 * 60 * 60 * 24);
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

function enableButton() {
  button.disabled = false;
  info.textContent = "Podés presionar el botón.";
}

// --- Evento de clic ---
button.addEventListener("click", () => {
  if (!canPressToday()) {
    disableButtonForToday();
    return;
  }

  resetIfMissed();
  streak++;

  const now = getArgentinaDate();

  if (streak === 1) {
    streakStart = now.toISOString();
    localStorage.setItem("streakStart", streakStart);
  }

  if (streak > bestStreak) {
    bestStreak = streak;
    localStorage.setItem("bestStreak", bestStreak);
    localStorage.setItem("streakStart", streakStart);
  }

  localStorage.setItem("streak", streak);
  localStorage.setItem("lastPress", now.toISOString());

  updateButton();
  disableButtonForToday();
  info.textContent = "¡Racha actualizada!";
});

// --- Inicialización ---
resetIfMissed();
updateButton();
if (canPressToday()) enableButton();
else disableButtonForToday();24

// --- FECHA actual (arriba izquierda) ---
function updateCurrentDate() {
  const now = getArgentinaDate();
  const day = String(now.getDate()).padStart(2, "0");
  const months = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
  const month = months[now.getMonth()];
  const year = String(now.getFullYear()).slice(-2);
  topLeft.textContent = `${day} ${month} ${year}`;
}

// --- Temporizador hasta medianoche (arriba derecha) ---
function updateCountdown() {
  const now = getArgentinaDate();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
  topRight.textContent = `${h}:${m}:${s}`;
}

// --- Mejor racha (abajo izquierda) ---
function updateBestStreak() {
  bottomLeft.textContent = `MEJOR: ${bestStreak}`;
}

// --- Fecha de inicio de racha (abajo derecha) ---
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
  bottomRight.textContent = `${day} ${month} ${year}`;
}

// --- Actualización continua ---
setInterval(() => {
  updateCurrentDate();
  updateCountdown();
  updateBestStreak();
  updateStartDate();
}, 1000);

updateCurrentDate();
updateCountdown();
updateBestStreak();
updateStartDate();

// --- Texto superior central ---
const topCenter = document.getElementById("top-center");
topCenter.innerHTML = `Código por @valen.ar<br>Calvosland Proyect #004:<br>"La Racha"`;
