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
            // Mejorar esta validacion!!!!!!!!!!!!!!
            if (!url.includes('.')) {
                // Url sin .com/.gov/etc
                throw new Error("URL invalida");
            }

            new URL(url);

        } catch (error) {
            res.status(400).json({
                "status": "error", 
                "statusCode": 400,
                "error": {
                    "code": "Bad Request",
                    "message": "Ingreso una url invalida.",
                    "details": `La URL: ${url} no es valida`,
                    "timestamp": Date(),
                    "path": `/url/short/`,
                    "suggestion": "Debe ingresar una url valida."
                },
            });

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
    // Generamos aleatoriamente la url nueva
    let resultado = '';
    const longitud = 10;

    for (let i = 0; i < longitud; i++) {
        resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    return resultado;
}

export async function redireccionUrl(req, res) {
    if (!req.params.clave) {
        res.status(400).json({
            "status": "error", 
            "statusCode": 404,
            "error": {
                "code": "Bad Request",
                "message": "Hace falta ingresar la clave de la url.",
                "details": `La URL: http:localhost:3000/url/short/:clave tiene una clave vacia`,
                "timestamp": Date(),
                "path": `/url/short/`,
                "suggestion": "Debe ingresar una clave."
            },
        });

        return;
    } 

    const clave = req.params.clave;

    const data =  await lecturaDb();

    if (data[clave]) {
        res.redirect(data[clave]);
    } else {
        res.status(404).json({
            "status": "error", 
            "statusCode": 404,
            "error": {
                "code": "RESOURCE_NOT_FOUND",
                "message": "El recurso no se encuentra almacenado en la base de datos.",
                "details": `La URL: http:localhost:3000/url/short/${clave} no se encuentra en database.json`,
                "timestamp": Date(),
                "path": `/url/short/${clave}`,
                "suggestion": "Verificar el ingreso de la URL."
            },
        });
    }
}

export async function obtenerConsultasAnteriores(req, res) {
    let data = await lecturaDb(req, res);

    if (Object.keys(data).length === 0) {
        res.status(200).json({
            "status": "exitoso",
            "statusCode": 200,
            "info": {
                "code": "NO_INFO",
                "message": "No existen recursos en la base de datos",
                "details": "No hay registros de uso anteriores.",
                "timestamp": Date(),
                "path": "url/short/consultas/listado",
                "suggestion": "Ingresaro (POST) urls para acortarlas e ingresarlas en la base de datos."                
            }
        })

        return;
    }

    res.status(200).json(data);
    return;
}