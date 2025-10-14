const button = document.getElementById("dailyButton");
const info = document.getElementById("info");

// Función para obtener fecha actual en Argentina (UTC-3)
function getArgentinaDate() {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
}

// Cargar datos guardados
let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastPress = localStorage.getItem("lastPress");

function updateButton() {
  button.textContent = streak;
}

function canPressToday() {
  if (!lastPress) return true;
  const now = getArgentinaDate();
  const last = new Date(lastPress);

  // Si es otro día en Argentina → se puede presionar
  return now.toDateString() !== last.toDateString();
}

function missedADay() {
  if (!lastPress) return false;
  const now = getArgentinaDate();
  const last = new Date(lastPress);

  // Calcular diferencia en días
  const diff = (now - last) / (1000 * 60 * 60 * 24);
  return diff >= 2; // si pasó más de un día sin presionar, racha perdida
}

function resetIfMissed() {
  if (missedADay()) {
    streak = 0;
    localStorage.setItem("streak", 0);
  }
}

button.addEventListener("click", () => {
  if (!canPressToday()) {
    info.textContent = "Ya presionaste el botón hoy.";
    return;
  }

  resetIfMissed();
  streak++;
  updateButton();
  info.textContent = "¡Racha actualizada!";
  const now = getArgentinaDate();
  localStorage.setItem("streak", streak);
  localStorage.setItem("lastPress", now);
});

resetIfMissed();
updateButton();
