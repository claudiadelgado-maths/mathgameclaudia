let niveles = [];
let nivelActual = 0;
let pasoActual = 0;
let juegoBloqueado = false;

const opcionA = document.getElementById("opcionA");
const opcionB = document.getElementById("opcionB");
const mensaje = document.getElementById("mensaje");
const continuarBtn = document.getElementById("continuar-btn");
const infoNivel = document.getElementById("nivel-info");
const infoPaso = document.getElementById("paso-info");
const instruccion = document.getElementById("instruccion");
const pregunta = document.getElementById("pregunta");
const opcionesContenedor = document.getElementById("opciones");

async function cargarNiveles() {
    try {
        const response = await fetch("data/niveles.json");
        niveles = await response.json();
        cargarNivel();
    } catch (error) {
        mensaje.innerText = "Error cargando niveles";
        console.error(error);
    }
}

function cargarNivel() {
    pasoActual = 0;
    juegoBloqueado = false;

    const nivel = niveles[nivelActual];
    document.body.style.backgroundImage = `url(${nivel.fondo})`;

    ocultarPantallaFinal();
    mostrarPaso();
}

function mostrarPaso() {
    const nivel = niveles[nivelActual];
    const paso = nivel.pasos[pasoActual];

    infoNivel.innerText = "Nivel: " + nivel.nivel;
    infoPaso.innerText = " | Paso: " + (pasoActual + 1);
    instruccion.innerText = "Elige la opción correcta";

    pregunta.innerHTML = paso.pregunta;

    opcionA.classList.remove("correcto", "incorrecto");
    opcionB.classList.remove("correcto", "incorrecto");
    mensaje.innerText = "";

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

    MathJax.typesetClear();
    MathJax.typeset();
}

function verificar(id) {
    if (juegoBloqueado) return;

    juegoBloqueado = true;

    const opcion = document.getElementById(id);
    const esCorrecta = opcion.dataset.correcta === "true";

    if (esCorrecta) {
        opcion.classList.add("correcto");
        mensaje.innerText = "¡Correcto!";
        setTimeout(avanzar, 1000);
    } else {
        opcion.classList.add("incorrecto");
        mensaje.innerText = "Incorrecto. Reiniciando nivel...";
        setTimeout(cargarNivel, 1500);
    }
}

function avanzar() {
    pasoActual++;

    if (pasoActual >= niveles[nivelActual].pasos.length) {
        mostrarFinDeNivel();
        return;
    }

    juegoBloqueado = false;
    mostrarPaso();
}

function mostrarFinDeNivel() {
    juegoBloqueado = true;

    opcionesContenedor.style.display = "none";
    pregunta.style.display = "none";
    infoPaso.style.display = "none";

    mensaje.style.fontSize = "52px";
    mensaje.innerText = "¡Felicidades!";

    continuarBtn.style.display = "inline-block";
}

function ocultarPantallaFinal() {
    mensaje.style.fontSize = "22px";
    continuarBtn.style.display = "none";
    opcionesContenedor.style.display = "flex";
    pregunta.style.display = "block";
    infoPaso.style.display = "inline";
}

function continuarJuego() {
    if (nivelActual < niveles.length - 1) {
        nivelActual++;
        cargarNivel();
        return;
    }

    juegoBloqueado = true;
    continuarBtn.style.display = "none";
    opcionesContenedor.style.display = "none";
    pregunta.style.display = "none";
    infoPaso.style.display = "none";
    instruccion.innerText = "";
    mensaje.style.fontSize = "48px";
    mensaje.innerText = "Juego completado";
}

opcionA.addEventListener("click", () => verificar("opcionA"));
opcionB.addEventListener("click", () => verificar("opcionB"));
continuarBtn.addEventListener("click", continuarJuego);

cargarNiveles();
