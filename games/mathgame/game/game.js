document.addEventListener("DOMContentLoaded", () => {

    const opcionA = document.getElementById("opcionA");
    const opcionB = document.getElementById("opcionB");
    const continuarBtn = document.getElementById("continuar-btn");
    const inicioBtn = document.getElementById("inicio-btn");

    // Opciones de respuesta
    opcionA.addEventListener("click", () => verificar("opcionA"));
    opcionB.addEventListener("click", () => verificar("opcionB"));

    // Botón continuar
    continuarBtn.addEventListener("click", continuarJuego);

    // Botón volver al inicio
    inicioBtn.addEventListener("click", () => {
        window.location.href = "../../../index.html";
    });

    // Iniciar juego
    iniciarJuego();

    // Iniciar música de fondo
    startBackgroundMusic();

});