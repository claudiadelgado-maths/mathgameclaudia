// ====== CONFIG ======
const DATA_URL = "games.json";
const GAME_BASE_URL = "mathgame/game/juego.html";

// ====== ELEMENTOS ======
const container = document.getElementById("games-container");
const overlay = document.getElementById("overlay");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalGoBtn = document.getElementById("modal-go-btn");

// ====== ESTADO ======
let GAMES = [];

// ====== INIT ======
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(DATA_URL);
    GAMES = await res.json();
    renderGames(GAMES);
  } catch (err) {
    console.error("Error cargando games.json:", err);
  }
});

// ====== RENDER ======
function renderGames(list) {
  container.innerHTML = "";

  list.forEach(game => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.style.backgroundImage = `url('${game.imagen}')`;

    card.onclick = () => openModal(game);

    const overlayDiv = document.createElement("div");
    overlayDiv.className = "card-overlay";

    const title = document.createElement("h3");
    title.textContent = game.titulo;

    const goBtn = document.createElement("button");
    goBtn.className = "go-btn";
    goBtn.textContent = "GO";

    goBtn.onclick = (e) => {
      e.stopPropagation();
      goToGame(game.id, game.titulo);
    };

    overlayDiv.appendChild(title);
    overlayDiv.appendChild(goBtn);
    card.appendChild(overlayDiv);

    container.appendChild(card);
  });
}

// ====== MODAL ======
function openModal(game) {
  modalImage.style.backgroundImage = `url('${game.imagen}')`;
  modalTitle.textContent = game.titulo;

  // 🔥 Aquí ya respeta saltos de línea gracias al CSS
  modalDescription.textContent = game.descripcion;

  modalGoBtn.onclick = () => goToGame(game.id, game.titulo);

  overlay.style.display = "flex";
}

function closeModal() {
  overlay.style.display = "none";
}

overlay.addEventListener("click", () => closeModal());

document.querySelector(".modal").addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ====== NAV ======
function goToGame(id, titulo) {
  const url = `${GAME_BASE_URL}?game=${id}&title=${encodeURIComponent(titulo)}`;
  window.location.href = url;
}

function goHome() {
  window.location.href = "../index.html";
}