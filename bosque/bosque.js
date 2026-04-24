const DATA_URL = "bosque.json";
const GAME_BASE_URL = "mathgame/game/game.html";
const ITEMS_PER_PAGE = 2;

const container = document.getElementById("bosque-container");
const overlay = document.getElementById("overlay");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalGoBtn = document.getElementById("modal-go-btn");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const inicioRail = document.getElementById("inicio-rail");
const pageDots = document.getElementById("page-dots");

let bosqueItems = [];
let currentPage = 0;
let wheelLocked = false;
let touchStartY = 0;

document.addEventListener("DOMContentLoaded", async () => {
  setupViewport();
  setupNavigation();

  try {
    const res = await fetch(DATA_URL);
    bosqueItems = await res.json();
    renderCurrentPage();
  } catch (err) {
    console.error("Error cargando bosque.json:", err);
  }
});

function setupViewport() {
  updateViewportLayout();
  window.addEventListener("resize", updateViewportLayout);

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateViewportLayout);
    window.visualViewport.addEventListener("scroll", updateViewportLayout);
  }
}

function setupNavigation() {
  prevPageBtn.addEventListener("click", () => changePage(-1));
  nextPageBtn.addEventListener("click", () => changePage(1));
  inicioRail.addEventListener("click", () => {
    window.location.href = "../index.html";
  });

  document.addEventListener("wheel", handleWheel, { passive: false });
  document.addEventListener("touchstart", event => {
    touchStartY = event.touches[0].clientY;
  }, { passive: true });

  document.addEventListener("touchend", event => {
    const touchEndY = event.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;

    if (Math.abs(deltaY) < 42) {
      return;
    }

    changePage(deltaY > 0 ? 1 : -1);
  }, { passive: true });
}

function renderCurrentPage() {
  const start = currentPage * ITEMS_PER_PAGE;
  const pageItems = bosqueItems.slice(start, start + ITEMS_PER_PAGE);

  container.innerHTML = "";

  pageItems.forEach(game => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Abrir ${game.titulo}`);
    card.style.backgroundImage = `url('${game.imagen}')`;
    card.addEventListener("click", () => openModal(game));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(game);
      }
    });

    const overlayDiv = document.createElement("div");
    overlayDiv.className = "card-overlay";

    const title = document.createElement("h3");
    title.textContent = game.titulo;

    const goBtn = document.createElement("button");
    goBtn.className = "go-btn";
    goBtn.type = "button";
    goBtn.textContent = "GO";
    goBtn.addEventListener("click", event => {
      event.stopPropagation();
      goToGame(game.id, game.titulo);
    });

    overlayDiv.appendChild(title);
    overlayDiv.appendChild(goBtn);
    card.appendChild(overlayDiv);
    container.appendChild(card);
  });

  renderPageDots();
  updateArrows();
}

function changePage(direction) {
  const nextPage = currentPage + direction;
  const maxPage = getMaxPage();

  if (nextPage < 0 || nextPage > maxPage) {
    return;
  }

  currentPage = nextPage;
  renderCurrentPage();
}

function updateArrows() {
  prevPageBtn.classList.toggle("oculto", currentPage === 0);
  nextPageBtn.classList.toggle("oculto", currentPage >= getMaxPage());
}

function renderPageDots() {
  const totalPages = getMaxPage() + 1;
  pageDots.innerHTML = "";

  for (let page = 0; page < totalPages; page++) {
    const dot = document.createElement("button");
    dot.className = "page-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir al grupo ${page + 1}`);
    dot.classList.toggle("activa", page === currentPage);

    dot.addEventListener("click", () => {
      currentPage = page;
      renderCurrentPage();
    });

    pageDots.appendChild(dot);
  }
}

function getMaxPage() {
  return Math.max(0, Math.ceil(bosqueItems.length / ITEMS_PER_PAGE) - 1);
}

function handleWheel(event) {
  if (Math.abs(event.deltaY) < 18 || wheelLocked || overlay.style.display === "flex") {
    return;
  }

  event.preventDefault();
  wheelLocked = true;
  changePage(event.deltaY > 0 ? 1 : -1);

  setTimeout(() => {
    wheelLocked = false;
  }, 420);
}

function openModal(game) {
  modalImage.style.backgroundImage = `url('${game.imagen}')`;
  modalTitle.textContent = game.titulo;
  modalDescription.textContent = game.descripcion;
  modalGoBtn.onclick = () => goToGame(game.id, game.titulo);
  overlay.style.display = "flex";
}

function closeModal() {
  overlay.style.display = "none";
}

overlay.addEventListener("click", closeModal);

document.querySelector(".modal").addEventListener("click", event => {
  event.stopPropagation();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal();
  }

  if (event.key === "ArrowDown") {
    changePage(1);
  }

  if (event.key === "ArrowUp") {
    changePage(-1);
  }
});

function goToGame(id, titulo) {
  const url = `${GAME_BASE_URL}?game=${id}&title=${encodeURIComponent(titulo)}`;
  window.location.href = url;
}

function updateViewportLayout() {
  const viewport = getRealViewport();
  const stageSize = Math.min(viewport.width, viewport.height);
  const difference = Math.abs(viewport.width - viewport.height);
  const squareTolerance = 8;
  const railSpace = 52;
  const outsideX = Math.max(0, (viewport.width - stageSize) / 2);
  const outsideY = Math.max(0, (viewport.height - stageSize) / 2);

  document.documentElement.style.setProperty("--viewport-width", `${viewport.width}px`);
  document.documentElement.style.setProperty("--viewport-height", `${viewport.height}px`);
  document.documentElement.style.setProperty("--stage-size", `${stageSize}px`);

  document.body.classList.remove("layout-wide", "layout-tall", "layout-square");

  if (difference <= squareTolerance) {
    document.body.classList.add("layout-square");
  } else if (viewport.width > viewport.height && outsideX >= railSpace) {
    document.body.classList.add("layout-wide");
  } else if (viewport.height > viewport.width && outsideY >= railSpace) {
    document.body.classList.add("layout-tall");
  } else {
    document.body.classList.add("layout-square");
  }
}

function getRealViewport() {
  if (window.visualViewport) {
    return {
      width: window.visualViewport.width,
      height: window.visualViewport.height
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}
