let niveles = [];
let nivelActual = 0;
let pasoActual = 0;

fetch("data/niveles.json")
    .then(res => res.json())
    .then(data => {
        niveles = data;
        cargarNivel();
    });

function cargarNivel() {
    pasoActual = 0;
    const nivel = niveles[nivelActual];
    document.body.style.backgroundImage = `url(${nivel.fondo})`;
    mostrarPaso();
}

function mostrarPaso() {
    const nivel = niveles[nivelActual];
    const paso = nivel.pasos[pasoActual];

    document.getElementById("nivel-info").innerText = "Nivel: " + nivel.nivel;
    document.getElementById("paso-info").innerText = " | Paso: " + (pasoActual + 1);

    const opcionA = document.getElementById("opcionA");
    const opcionB = document.getElementById("opcionB");

    document.getElementById("mensaje").innerText = "";

    const opciones = [...paso.opciones];

    if (Math.random() < 0.5) {
        opcionA.dataset.correcta = opciones[0].correcta;
        opcionB.dataset.correcta = opciones[1].correcta;

        opcionA.innerHTML = opciones[0].texto;
        opcionB.innerHTML = opciones[1].texto;
    } else {
        opcionA.dataset.correcta = opciones[1].correcta;
        opcionB.dataset.correcta = opciones[0].correcta;

        opcionA.innerHTML = opciones[1].texto;
        opcionB.innerHTML = opciones[0].texto;
    }

    MathJax.typeset();
}

document.getElementById("opcionA").addEventListener("click", () => verificar("opcionA"));
document.getElementById("opcionB").addEventListener("click", () => verificar("opcionB"));

function verificar(id) {
    const opcion = document.getElementById(id);
    const esCorrecta = opcion.dataset.correcta === "true";

    if (esCorrecta) {
        opcion.classList.add("correcto");
        document.getElementById("mensaje").innerText = "¡Correcto!";
        setTimeout(() => avanzar(), 1000);
    } else {
        opcion.classList.add("incorrecto");
        document.getElementById("mensaje").innerText = "Incorrecto. Reiniciando nivel...";
        setTimeout(() => cargarNivel(), 1500);
    }
}

function avanzar() {
    document.querySelectorAll(".opcion").forEach(o => {
        o.classList.remove("correcto", "incorrecto");
    });

    pasoActual++;

    if (pasoActual >= niveles[nivelActual].pasos.length) {
        document.getElementById("mensaje").innerText = "Nivel completado!";
    } else {
        mostrarPaso();
    }
}
