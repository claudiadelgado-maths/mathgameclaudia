const sceneItems = [
  {
    id: "texto-intro",
    type: "html",

    // Aqui editas la posicion del texto Ver intro.
    // x: -1 izquierda, 0 centro, 1 derecha.
    // y: -1 arriba, 0 centro, 1 abajo.
    x: 0,
    y: 0.62,

    // Aqui editas el tamano del texto Ver intro.
    // 0.25 significa 25% del lado del cuadrado.
    size: 0.34,
    html: '<p class="intro-title">Ver intro</p>'
  },
  {
    id: "video-intro",
    type: "html",

    // Aqui editas la posicion del video de intro.
    x: 0,
    y: 0,

    // Aqui editas el tamano del video de intro.
    size: 1,
    html: `
      <div class="video-frame">
        <iframe
          src="https://www.youtube.com/embed/cG3QzkI9Gpc"
          title="Intro de Infactorielle"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
      </div>
    `
  }
];

document.addEventListener("DOMContentLoaded", () => {
  renderSceneItems();
  updateZoneViewport();

  window.addEventListener("resize", updateZoneViewport);

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateZoneViewport);
    window.visualViewport.addEventListener("scroll", updateZoneViewport);
  }

  document.getElementById("inicio-rail").addEventListener("click", () => {
    window.location.href = "../index.html";
  });
});

function renderSceneItems() {
  const container = document.getElementById("scene-items");
  container.innerHTML = "";

  sceneItems.forEach(item => {
    const element = item.type === "button"
      ? document.createElement("button")
      : document.createElement("div");

    element.className = item.type === "button" ? "scene-item scene-button" : "scene-item";
    element.style.left = `${((item.x + 1) / 2) * 100}%`;
    element.style.top = `${((item.y + 1) / 2) * 100}%`;
    element.style.width = `${item.size * 100}%`;

    if (item.type === "button") {
      element.type = "button";
      element.setAttribute("aria-label", item.alt || item.id);

      if (item.action) {
        element.addEventListener("click", item.action);
      } else {
        element.classList.add("inactive");
      }
    }

    if (item.type === "html") {
      element.innerHTML = item.html;

      if (item.action) {
        element.addEventListener("click", item.action);
      }
    } else {
      const image = document.createElement("img");
      image.className = "scene-image";
      image.src = item.src;
      image.alt = item.alt || "";
      image.draggable = false;

      element.appendChild(image);
    }

    container.appendChild(element);
  });
}

function updateZoneViewport() {
  const viewport = getZoneViewport();
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

function getZoneViewport() {
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
