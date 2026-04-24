let nivelActual = 0;
let pasoActual = 0;
let juegoBloqueado = false;

function iniciarJuego() {

    cargarNiveles().then(data => {

        niveles = data;

        if (niveles.length > 0) {
            cargarNivel();
        }

    });

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

    const infoNivel = document.getElementById("nivel-info");
    const infoPaso = document.getElementById("paso-info");
    const instruccion = document.getElementById("instruccion");
    const pregunta = document.getElementById("pregunta");
    const opcionA = document.getElementById("opcionA");
    const opcionB = document.getElementById("opcionB");
    const mensaje = document.getElementById("mensaje");

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
    const mensaje = document.getElementById("mensaje");

    const esCorrecta = opcion.dataset.correcta === "true";

    if (esCorrecta) {

        // efectos
        playCorrectSound();
        spriteCorrect();

        opcion.classList.add("correcto");
        mensaje.innerText = "¡Correcto!";

        setTimeout(avanzar, 1000);

    } else {

        // efectos
        playWrongSound();
        spriteWrong();

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

    // efectos de nivel superado
    playLevelUpSound();
    spriteLevelUp();

    juegoBloqueado = true;

    const opcionesContenedor = document.getElementById("opciones");
    const pregunta = document.getElementById("pregunta");
    const infoPaso = document.getElementById("paso-info");
    const mensaje = document.getElementById("mensaje");
    const continuarBtn = document.getElementById("continuar-btn");

    opcionesContenedor.style.display = "none";
    pregunta.style.display = "none";
    infoPaso.style.display = "none";

    mensaje.style.fontSize = "52px";
    mensaje.innerText = "¡Felicidades!";

    continuarBtn.style.display = "inline-block";

}

function ocultarPantallaFinal() {

    const mensaje = document.getElementById("mensaje");
    const continuarBtn = document.getElementById("continuar-btn");
    const opcionesContenedor = document.getElementById("opciones");
    const pregunta = document.getElementById("pregunta");
    const infoPaso = document.getElementById("paso-info");

    mensaje.style.fontSize = "22px";
    continuarBtn.style.display = "none";
    opcionesContenedor.style.display = "flex";
    pregunta.style.display = "block";
    infoPaso.style.display = "inline";

}

function continuarJuego() {

    const continuarBtn = document.getElementById("continuar-btn");
    const opcionesContenedor = document.getElementById("opciones");
    const pregunta = document.getElementById("pregunta");
    const infoPaso = document.getElementById("paso-info");
    const instruccion = document.getElementById("instruccion");
    const mensaje = document.getElementById("mensaje");

    if (nivelActual < niveles.length - 1) {

        nivelActual++;
        cargarNivel();
        return;

    }

    continuarBtn.style.display = "none";
    opcionesContenedor.style.display = "none";
    pregunta.style.display = "none";
    infoPaso.style.display = "none";
    instruccion.innerText = "";

    mensaje.style.fontSize = "48px";
    mensaje.innerText = "Juego completado";

}