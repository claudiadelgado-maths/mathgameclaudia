// duración por defecto
const DEFAULT_SPRITE_DURATION = 1200;


// ============================
// FUNCION GENERAL
// ============================

function showSprite(spriteName, size = 180, duration = DEFAULT_SPRITE_DURATION) {

    const sprite = document.createElement("img");

    sprite.src = `../assets/stickers/${spriteName}.png`;

    sprite.style.position = "fixed";
    sprite.style.left = "50%";
    sprite.style.top = "50%";
    sprite.style.transform = "translate(-50%, -50%)";

    sprite.style.width = size + "px";

    sprite.style.zIndex = "9999";
    sprite.style.pointerEvents = "none";

    document.body.appendChild(sprite);

    setTimeout(() => {
        sprite.remove();
    }, duration);

}


// ============================
// FUNCIONES ESPECIFICAS
// ============================

function spriteCorrect() {
    showSprite("abejafeliz", 180, 1200);
}

function spriteWrong() {
    showSprite("abejamolesta", 180, 1200);
}

function spriteLevelUp() {
    showSprite("nivelsuperado", 600, 3000); // 3 segundos
}