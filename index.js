document.addEventListener("DOMContentLoaded", () => {

    const botonJugar = document.getElementById("play-mathgame");
    const botonRepositorio = document.getElementById("open-repository");

    botonJugar.addEventListener("click", () => {

        window.location.href = "games/games.html";

    });

    botonRepositorio.addEventListener("click", () => {

        window.location.href = "repositorio/repositorio.html";

    });

});
