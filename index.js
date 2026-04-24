const sceneItems = [
    {
        id: "titulo",
        type: "image",
        src: "Titulo_portada.png",
        alt: "Ayuda en Matemáticas 24/7",

        // Aqui editas la posicion de la imagen del titulo.
        // x: -1 izquierda, 0 centro, 1 derecha.
        // y: -1 arriba, 0 centro, 1 abajo.
        x: 0,
        y: -0.25,

        // Aqui editas el tamano de la imagen del titulo.
        // 0.50 significa 50% del lado del cuadrado.
        size: 0.70
    },
    {
        id: "jugar",
        type: "button",
        src: "boton_jugar.png",
        alt: "Botón jugar",

        // Aqui editas la posicion del boton jugar.
        x: 0,
        y: 0.25,

        // Aqui editas el tamano del boton jugar.
        size: 0.28,
        pulseDelay: 0,
        action: () => {
            window.location.href = "infactorielle/infactorielle.html";
        }
    },
    {
        id: "terminal",
        type: "button",
        src: "boton_terminal.png",
        alt: "Abrir terminal",

        // Aqui editas la posicion del boton terminal.
        x: -0.61,
        y: -0.85,

        // Aqui editas el tamano del boton terminal.
        size: 0.27,
        pulseDelay: 2,
        action: () => {
            window.location.href = "terminal/terminal.html";
        }
    },
    {
        id: "pueblo",
        type: "button",
        src: "boton_pueblo.png",
        alt: "Botón pueblo",

        // Aqui editas la posicion del boton pueblo.
        x: 0.69,
        y: -0.86,

        // Aqui editas el tamano del boton pueblo.
        size: 0.26,
        pulseDelay: 4,
        action: () => {
            window.location.href = "pueblo/pueblo.html";
        }
    },
    {
        id: "bosque",
        type: "button",
        src: "boton_bosque.png",
        alt: "Abrir juegos",

        // Aqui editas la posicion del boton bosque.
        x: -0.70,
        y: 0.85,

        // Aqui editas el tamano del boton bosque.
        size: 0.30,
        pulseDelay: 6,
        action: () => {
            window.location.href = "bosque/bosque.html";
        }
    },
    {
        id: "fabrica",
        type: "button",
        src: "boton_fabrica.png",
        alt: "Botón fábrica",

        // Aqui editas la posicion del boton fabrica.
        x: 0.74,
        y: 0.85,

        // Aqui editas el tamano del boton fabrica.
        size: 0.30,
        pulseDelay: 8,
        action: () => {
            window.location.href = "fabrica/fabrica.html";
        }
    }
];

document.addEventListener("DOMContentLoaded", () => {
    renderSceneItems();
    updateViewportLayout();
    setupEdgePanels();

    window.addEventListener("resize", updateViewportLayout);

    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", updateViewportLayout);
        window.visualViewport.addEventListener("scroll", updateViewportLayout);
    }
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
        element.style.setProperty("--pulse-delay", `${item.pulseDelay || 0}s`);

        if (item.type === "button") {
            element.type = "button";
            element.setAttribute("aria-label", item.alt);

            if (item.action) {
                element.addEventListener("click", item.action);
            } else {
                element.classList.add("inactive");
            }
        }

        const image = document.createElement("img");
        image.className = "scene-image";
        image.src = item.src;
        image.alt = item.alt;
        image.draggable = false;

        element.appendChild(image);
        container.appendChild(element);
    });
}

function updateViewportLayout() {
    const viewport = getRealViewport();
    const sceneSize = Math.min(viewport.width, viewport.height);
    const difference = Math.abs(viewport.width - viewport.height);
    const squareTolerance = 8;
    const railSpace = 52;
    const outsideX = Math.max(0, (viewport.width - sceneSize) / 2);
    const outsideY = Math.max(0, (viewport.height - sceneSize) / 2);
    const hasRoomForHorizontalRails = viewport.width > viewport.height && outsideX >= railSpace;
    const hasRoomForVerticalRails = viewport.height > viewport.width && outsideY >= railSpace;

    document.documentElement.style.setProperty("--viewport-width", `${viewport.width}px`);
    document.documentElement.style.setProperty("--viewport-height", `${viewport.height}px`);
    document.documentElement.style.setProperty("--scene-size", `${sceneSize}px`);

    document.body.classList.remove("layout-wide", "layout-tall", "layout-square");

    if (difference <= squareTolerance) {
        document.body.classList.add("layout-square");
    } else if (hasRoomForHorizontalRails) {
        document.body.classList.add("layout-wide");
    } else if (hasRoomForVerticalRails) {
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

function setupEdgePanels() {
    const infoRail = document.getElementById("info-rail");
    const settingsRail = document.getElementById("settings-rail");
    const backdrop = document.getElementById("modal-backdrop");
    const closeButtons = document.querySelectorAll("[data-close-modal]");

    infoRail.addEventListener("click", () => openModal("info-modal"));
    settingsRail.addEventListener("click", () => openModal("settings-modal"));
    backdrop.addEventListener("click", closeModals);

    closeButtons.forEach(button => {
        button.addEventListener("click", closeModals);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeModals();
        }
    });
}

function openModal(modalId) {
    closeModals();

    document.getElementById("modal-backdrop").classList.remove("oculto");
    document.getElementById(modalId).classList.remove("oculto");
}

function closeModals() {
    document.getElementById("modal-backdrop").classList.add("oculto");

    document.querySelectorAll(".mini-modal").forEach(modal => {
        modal.classList.add("oculto");
    });
}
