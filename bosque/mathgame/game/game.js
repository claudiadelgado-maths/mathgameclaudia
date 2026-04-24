// 🔥 EJECUCIÓN INMEDIATA (ANTES DE QUE CARGUE EL DOM)
const params = new URLSearchParams(window.location.search);
const titulo = params.get("title");

if (titulo) {
    document.title = titulo;
}

document.addEventListener("DOMContentLoaded", () => {

    // 🔥 TÍTULO EN EL DOM
    if (titulo) {
        const titleElement = document.getElementById("game-title");
        if (titleElement) {
            titleElement.textContent = titulo;
        }
    }

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

    // Música
    startBackgroundMusic();

});