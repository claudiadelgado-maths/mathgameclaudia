let niveles = [];

async function cargarNiveles() {

    try {

        const rutas = [
            "../data/intervalos/nivel1.json",
            "../data/intervalos/nivel2.json",
            "../data/intervalos/nivel3.json"
        ];

        const respuestas = await Promise.all(
            rutas.map(ruta => fetch(ruta))
        );

        const datos = await Promise.all(
            respuestas.map(res => res.json())
        );

        niveles = datos.flat();

        return niveles;

    } catch (error) {

        console.error("Error cargando niveles:", error);
        return [];

    }

}