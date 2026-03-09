let niveles = [];

async function cargarNiveles() {

    try {

        const datos = [];
        let i = 1;

        while (true) {

            const ruta = `../data/intervalos/nivel${i}.json?v=1`;

            const res = await fetch(ruta);

            if (!res.ok) {
                break; // cuando ya no existe el siguiente nivel se detiene
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