import { ingresarDb, lecturaDb } from '../db/db_controler.js'
import { ManejoError, ManejoSuccess, hateoas } from '../helpers/respuestas.js'
import validator from 'validator';

const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export async function obtenerUrl(req, res) {
    let url;

    // Manejo de contenido JSON en req.body
    try {
        url = req.body.url;
    } catch (error) {

        return ManejoError(req, res, {
            status_code: 400,
            status: "error",
            code_error: `${error}`,
            message: "Falta ingresar contenigo al Body de la petición.",
            details: `req.body esta vacio`,
            suggestion: 'Debe ingresar contenido con método POST e ingresar un body tipo .JSON con el siguiente formato: {"url": "UrlLarga"}'
        });
    }

    // Verificamos si es que poseen los protocolos
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    try {

        new URL(url);

        if (!validator.isURL(url, { 
            require_protocol: true,  
            require_tld: true       
        })) {
            throw new Error("Bad Request");
        }

    } catch (error) {
        return ManejoError(req, res, {
            status_code: 400,
            status: "error",
            code_error: "Bad Request",
            message: "Ingreso una url invalida.",
            details: `La URL: ${url} no es valida`,
            suggestion: "Debe ingresar una url valida."
        });
    }


    try {   
        // Leemos la db
        let data = await lecturaDb();

        // Genero la nueva clave que acorte la URL
        let clave = generadorUrl();

        // Nos aseguramos de crear claves únicas
        while (clave in data) {
            clave = generadorUrl();
        }

        // Ingresamos información de la creación
        data[clave] = {
            "createdAt": new Date().toISOString(),
            "urlOriginal": url,
            "urlAcortada": req.protocol + '://' + req.host + req.originalUrl + clave,
            "visits": 0
        }

        // Reescribimos los datos en la db
        await ingresarDb(data);

        return ManejoSuccess(req, res, {
            "urlOriginal": url,
            "urlAcortada": req.protocol + '://' + req.host + req.originalUrl + clave
        }, {
            status_code: 201,
            message: `URL: ${`http://localhost:3000/url/short/${clave}`} creada con exito.`,
            details: "La url fue acortada y almacenada lista para usarla pegandola en el buscador."
        }, hateoas(false, {}, req));

    } catch (error) {
        return ManejoError(req, res, {
            status_code: 500,
            status: "error",
            code_error: "Internal Server Error",
            message: "Hubo una falla en el servidor.",
            details: `${error.message}`,
            suggestion: "No fue posible establecer una conexión la base de datos, intente en otro momento."
        });
    }
}


function generadorUrl() {
    // Generamos aleatoriamente la clave de url nueva
    let resultado = '';
    const longitud = 10;

    for (let i = 0; i < longitud; i++) {
        resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    return resultado;
}

export async function redireccionUrl(req, res) {
    if (!req.params.clave) {

        return ManejoError(req, res, {
            status_code: 400,
            status: "error",
            code_error: "Bad Request",
            message: "Hace falta ingresar la clave de la url.",
            details: `La URL: http:localhost:3000/url/short/:clave tiene una clave vacia`,
            suggestion: "Debe ingresar una clave."
        });
    } 

    const clave = req.params.clave;

    const data = await lecturaDb();

    if (data[clave]) {
        data[clave].visits += 1;
        await ingresarDb(data);
        res.redirect(data[clave].urlOriginal);
    } else {
        return ManejoError(req, res, {
            status_code: 404,
            status: "error",
            code_error: "RESOURCE_NOT_FOUND",
            message: "El recurso no se encuentra almacenado en la base de datos.",
            details: `La URL: http:localhost:3000/url/short/${clave} no se encuentra en database.json`,
            suggestion: "Verificar el ingreso de la URL."
        });
    }
}

export async function obtenerConsultasAnteriores(req, res) {
    let data = await lecturaDb(req, res);

    if (Object.keys(data).length === 0) {
        // Aplicar HATEOAS 
        return ManejoSuccess(req, res, {
            status_code: 400,
            status: "exitoso",
            message: "No existen recursos en la base de datos",
            details: "No hay registros de uso anteriores."
        })
    }

    return ManejoSuccess(req, res, data, {
            status_code: 200,
            status: "exitoso",
            message: "Listado de las url acortadas por la api.",
            details: "Se enlistan todas las url que los usuarios han ingresado para su acortamiento."
        }, hateoas(false, {}, req));
}