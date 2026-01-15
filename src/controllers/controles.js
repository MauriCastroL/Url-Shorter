import { ingresarDb, lecturaDb } from '../db/db_controler.js'

const mapa = new Map();
const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export async function obtenerUrl(req, res) {
    // Verificamos que exista contenido
    if (req.body && req.body.url) {

        let url = req.body.url;

        // Verificamos si es que poseen los protocolos
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        try {
            new URL(url);
        } catch (error) {
            res.status(400).json({
                "error": "Lo ingresado no es una URL valida"
            })
            return;
        }


        try {   
            let data = await lecturaDb();

            const clave = generadorUrl();
            mapa.set(clave, url);

            data[clave] = url;

            await ingresarDb(data);

            res.status(201).json({  
                [`http://localhost:3000/url/short/${clave}`]: url
            })
            
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Error interno del servidor",
                detalle: error.message
            });
        }
    } 

    res.status(400).json({
        "error": "Debe ingresar contenido en el body de la petición"
    })

    return;
}


function generadorUrl() {
    // Generamos aleatoriamente al url nueva
    let resultado = '';
    const longitud = 10;

    for (let i = 0; i < longitud; i++) {
        resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    return resultado;
}

export function redireccionUrl(req, res) {
    if (!req.params.clave) {
        res.status(400).json({
            "error": "hace falta ingresar la clave de la url"
        });

        return;
    } 

    const clave = req.params.clave;

    if (mapa.has(clave)) {
        res.redirect(mapa.get(clave));
        return;
    } else {
        res.status(404).json({
            "error": "No se encuantra registrada la url ingresada"
        });

        return;
    }
}

export async function obtenerConsultasAnteriores(req, res) {
    let data = await lecturaDb(req, res);
    res.status(200).json(data);
}