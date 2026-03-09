// ============================
// CARGA DE SONIDOS
// ============================

const soundCorrect = new Audio("../assets/sounds/abejafeliz.mp3");
const soundWrong = new Audio("../assets/sounds/abejamolesta.mp3");
const soundLevelUp = new Audio("../assets/sounds/nivelsuperado.mp3");
const soundMusic = new Audio("../assets/sounds/musicafondo.mp3");

// música en bucle
soundMusic.loop = true;
soundMusic.volume = 0.35;


// ============================
// FUNCIONES DE SONIDO
// ============================

function playCorrectSound() {
    soundCorrect.currentTime = 0;
    soundCorrect.play();
}

function playWrongSound() {
    soundWrong.currentTime = 0;
    soundWrong.play();
}

function playLevelUpSound() {
    soundLevelUp.currentTime = 0;
    soundLevelUp.play();
}

function startBackgroundMusic() {
    soundMusic.play().catch(() => {});
}

function stopBackgroundMusic() {
    soundMusic.pause();
}


// ============================
// INICIAR MUSICA CON INTERACCION
// (soluciona el problema de F5)
// ============================

function initMusicOnce() {

    startBackgroundMusic();

    document.removeEventListener("click", initMusicOnce);
    document.removeEventListener("keydown", initMusicOnce);

}

document.addEventListener("click", initMusicOnce);
document.addEventListener("keydown", initMusicOnce);


// ============================
// CONTROL DE CAMBIO DE PESTAÑA
// ============================

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {
        if (!soundMusic.paused) {
            soundMusic.pause();
        }
    } else {
        soundMusic.play().catch(() => {});
    }

});