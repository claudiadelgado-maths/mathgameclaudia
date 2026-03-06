document.addEventListener("DOMContentLoaded", () => {

    const nivelesBtn = document.getElementById("niveles-btn");
    const modalNiveles = document.getElementById("modal-niveles");
    const cerrarModal = document.getElementById("cerrar-modal");
    const listaNiveles = document.getElementById("lista-niveles");

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

    nivelesBtn.addEventListener("click", abrirModal);
    cerrarModal.addEventListener("click", cerrarModalFunc);

});