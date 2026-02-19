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

const nivelesBtn = document.getElementById("niveles-btn");
const modalNiveles = document.getElementById("modal-niveles");
const cerrarModal = document.getElementById("cerrar-modal");
const listaNiveles = document.getElementById("lista-niveles");


async function cargarNiveles() {
    try {
        const rutas = [
            "data/nivel1.json?v=1",
            "data/nivel2.json?v=1",
            "data/nivel3.json?v=1"
        ];

        const respuestas = await Promise.all(
            rutas.map(ruta => fetch(ruta))
        );

        const datos = await Promise.all(
            respuestas.map(res => res.json())
        );

        // Unimos todos los niveles en un solo arreglo
        niveles = datos.flat();

        cargarNivel();

    } catch (error) {
        mensaje.innerText = "OMG XD";
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

// ===== FUNCIONES DEL MODAL DE NIVELES =====

function abrirModal() {
    renderizarNiveles();
    modalNiveles.classList.remove("oculto");
}

function cerrarModalFunc() {
    modalNiveles.classList.add("oculto");
}

function renderizarNiveles() {
    listaNiveles.innerHTML = "";

    niveles.forEach((nivel, index) => {
        const cuadro = document.createElement("div");
        cuadro.classList.add("cuadro-nivel");

        if (index < nivelActual) {
            cuadro.classList.add("completado");
        } else {
            cuadro.classList.add("pendiente");
        }

        cuadro.innerText = nivel.nivel;

        cuadro.addEventListener("click", () => {
            nivelActual = index;
            cerrarModalFunc();
            cargarNivel();
        });

        listaNiveles.appendChild(cuadro);
    });
}

// ===== EVENT LISTENERS DEL MODAL =====

nivelesBtn.addEventListener("click", abrirModal);
cerrarModal.addEventListener("click", cerrarModalFunc);


opcionA.addEventListener("click", () => verificar("opcionA"));
opcionB.addEventListener("click", () => verificar("opcionB"));
continuarBtn.addEventListener("click", continuarJuego);

cargarNiveles();
