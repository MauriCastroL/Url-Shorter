import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaDb = path.join(__dirname, 'database.json');

export async function lecturaDb() {
    try {
        const data = await fs.readFile(rutaDb, 'utf-8');
        return JSON.parse(data); 
    } catch (error) {
        // Caso: DB no creada
        if (error.code === 'ENOENT') {
            ingresarDb({}); // Creamos la DB
            return {};
        }

        throw new Error("No se pudo leer la base de datos: " + error.message);
    }
}

export async function ingresarDb(dataCompleta) {
    await fs.writeFile(rutaDb, JSON.stringify(dataCompleta, null, 2));
}
