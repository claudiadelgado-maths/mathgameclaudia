let niveles = [];

function obtenerJuego() {
    const params = new URLSearchParams(window.location.search);
    return params.get("game");
}

async function cargarNiveles() {

    try {

        const juego = obtenerJuego();

        if (!juego) {
            console.error("No se especificó el juego");
            return [];
        }

        const datos = [];
        let i = 1;

        while (true) {

            const ruta = `../data/${juego}/nivel${i}.json?v=1`;

            const res = await fetch(ruta);

            if (!res.ok) {
                break;
            }

            const json = await res.json();
            datos.push(json);

            i++;

        }

        niveles = datos.flat();

        return niveles;

    } catch (error) {

        console.error("Error cargando niveles:", error);
        return [];

    }

}