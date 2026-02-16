let niveles = [];
let nivelActual = 0;
let pasoActual = 0;

fetch("data/niveles.json")
    .then(res => res.json())
    .then(data => {
        niveles = data;
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
        const rutasNiveles = ["data/niveles.json", "data/nivel2.json"];
        const respuestas = await Promise.all(rutasNiveles.map((ruta) => fetch(ruta)));
        const datos = await Promise.all(respuestas.map((respuesta) => respuesta.json()));
        niveles = datos.flat();
        cargarNivel();
    });
    } catch (error) {
        mensaje.innerText = "No se pudieron cargar los niveles.";
        console.error(error);
    }
}

function cargarNivel() {
    pasoActual = 0;
    const nivel = niveles[nivelActual];
    juegoBloqueado = false;

    const nivel = niveles[nivelActual];
    document.body.style.backgroundImage = `url(${nivel.fondo})`;

    ocultarPantallaFinal();
    mostrarPaso();
}

function mostrarPaso() {
    const nivel = niveles[nivelActual];
    const paso = nivel.pasos[pasoActual];

    // Mostrar nivel y paso
    document.getElementById("nivel-info").innerText = "Nivel: " + nivel.nivel;
    document.getElementById("paso-info").innerText = " | Paso: " + (pasoActual + 1);

    // Mostrar instrucción fija
    document.getElementById("instruccion").innerText = "Elige la opción correcta";
    infoNivel.innerText = "Nivel: " + nivel.nivel;
    infoPaso.innerText = " | Paso: " + (pasoActual + 1);
    instruccion.innerText = "Elige la opción correcta";

    // Mostrar pregunta base (ecuación)
    document.getElementById("pregunta").innerHTML = paso.pregunta;
    pregunta.innerHTML = paso.pregunta;

    const opcionA = document.getElementById("opcionA");
    const opcionB = document.getElementById("opcionB");

    // Limpiar estilos anteriores
    opcionA.classList.remove("correcto", "incorrecto");
    opcionB.classList.remove("correcto", "incorrecto");

    document.getElementById("mensaje").innerText = "";
    mensaje.innerText = "";

    const opciones = [...paso.opciones];

    // Aleatorizar izquierda/derecha
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

    // Re-renderizar LaTeX
    MathJax.typesetClear();
    MathJax.typeset();
}

document.getElementById("opcionA").addEventListener("click", () => verificar("opcionA"));
document.getElementById("opcionB").addEventListener("click", () => verificar("opcionB"));

function verificar(id) {
    if (juegoBloqueado) {
        return;
    }

    const opcion = document.getElementById(id);
    const esCorrecta = opcion.dataset.correcta === "true";

    juegoBloqueado = true;

    if (esCorrecta) {
        opcion.classList.add("correcto");
        document.getElementById("mensaje").innerText = "¡Correcto!";
        mensaje.innerText = "¡Correcto!";
        setTimeout(() => avanzar(), 1000);
    } else {
        opcion.classList.add("incorrecto");
        document.getElementById("mensaje").innerText = "Incorrecto. Reiniciando nivel...";
        mensaje.innerText = "Incorrecto. Reiniciando nivel...";
        setTimeout(() => cargarNivel(), 1500);
    }
}

function avanzar() {
    pasoActual++;
    pasoActual += 1;

    if (pasoActual >= niveles[nivelActual].pasos.length) {
        document.getElementById("mensaje").innerText = "Nivel completado!";
    } else {
        mostrarPaso();
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

    MathJax.typesetClear();
    MathJax.typeset();
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
        nivelActual += 1;
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
