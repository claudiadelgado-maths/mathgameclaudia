const sceneItems = [
  /*
    Aqui agregas futuros elementos dentro del cuadro 1:1.
    Ejemplo:
    {
      id: "mi-boton",
      type: "button",
      src: "mi_imagen.png",
      alt: "Mi boton",

      // Aqui editas la posicion del elemento.
      // x: -1 izquierda, 0 centro, 1 derecha.
      // y: -1 arriba, 0 centro, 1 abajo.
      x: 0,
      y: 0,

      // Aqui editas el tamano del elemento.
      // 0.25 significa 25% del lado del cuadrado.
      size: 0.25,
      action: () => {}
    }
  */
];

document.addEventListener("DOMContentLoaded", () => {
  renderSceneItems();
  updatePuebloViewport();

  window.addEventListener("resize", updatePuebloViewport);

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updatePuebloViewport);
    window.visualViewport.addEventListener("scroll", updatePuebloViewport);
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

    const image = document.createElement("img");
    image.className = "scene-image";
    image.src = item.src;
    image.alt = item.alt || "";
    image.draggable = false;

    element.appendChild(image);
    container.appendChild(element);
  });
}

function updatePuebloViewport() {
  const viewport = getPuebloViewport();
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

function getPuebloViewport() {
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
