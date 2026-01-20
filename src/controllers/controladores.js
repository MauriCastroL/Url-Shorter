import * as service from '../services/servicio.js';
import { ManejoErrores } from '../middlewares/middlewares.js'

export const listarLinks = async (req, res) => {
    try {
        let page = Number(req.query.page);
        let limit = Number(req.query.limit);

        if (Number.isNaN(page) || page < 1) page = 1;
        if (Number.isNaN(limit) || limit < 1) limit = 10;

        const links = await service.servicioExtraerTodosLosLinks(limit, page);

        if (!links || links.length === 0) {
        return res.status(200).json({ 
            mensaje: "No hay links para mostrar",
            datos: []
        });
    }

    res.status(200).json({
        meta: { pagina: page, por_pagina: limit, total: links.length },
        datos: links
    });

    } catch (error) {
        return ManejoErrores(req, res, {
            statusCode: 500,
            status: "fail",
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al intentar obtener los links.",
            details: error.message,
            suggestion: "Intenta nuevamente en unos minutos."
        });
    }
}

export const acortarLink = async (req, res) => {
    try {
        let linkOriginal = req.body.url;

        // VALIDACIÓN: Campo faltante
        if (!linkOriginal) {
            return ManejoErrores(req, res, {
                statusCode: 400,
                code: "MISSING_PARAMETER",
                message: "Falta el campo obligatorio 'url'.",
                details: "El cuerpo de la solicitud JSON debe contener la propiedad 'url'.",
                suggestion: "Envía un body como: { 'url': 'https://google.com' }"
            });
        }

        if (typeof linkOriginal !== 'string') {
            return ManejoErrores(req, res, {
                statusCode: 400,
                code: "INVALID_ARGUMENT_TYPE",
                message: "El formato de la URL es inválido.",
                details: "Se esperaba un String, se recibió otro tipo de dato.",
                suggestion: "Asegúrate de que 'url' sea una cadena de texto."
            });
        }

        const result = await service.servicioGenerarLinkNuevo(linkOriginal);
        res.status(201).json(result);

    } catch (error) {
        return ManejoErrores(req, res, {
            statusCode: 400,
            code: "URL_VALIDATION_FAILED",
            message: "La URL proporcionada no es válida o segura.",
            details: error.message, // "Formato incorrecto" o lo que lance el servicio
            suggestion: "Verifique que la URL incluya protocolo (http/https) y un dominio válido."
        });
    }
}

export const eliminarLink = async (req, res) => {
    try {
        const alias = req.params.alias;
        
        if (!alias) {
            return ManejoErrores(req, res, {
                statusCode: 400,
                code: "MISSING_PARAMETER",
                message: "Falta el alias en la ruta."
            });
        }

        const resultado = await service.servicioEliminarLink(alias);

        if (!resultado) {
            return ManejoErrores(req, res, {
                statusCode: 404,
                code: "RESOURCE_NOT_FOUND",
                message: "No se encontró el link para eliminar.",
                details: `El alias '${alias}' no existe en la base de datos.`,
                suggestion: "Verifique que el alias esté escrito correctamente."
            });
        }

        res.status(200).json({ mensaje: "Link eliminado", eliminado: resultado });

    } catch (error) {
        return ManejoErrores(req, res, {
            statusCode: 500,
            code: "DB_DELETE_ERROR",
            message: "Error interno al intentar eliminar el registro.",
            details: error.message
        });
    }
}

export const redireccionarLink = async (req, res) => {
    try {
        const alias = req.params.alias;

        const urlDestino = await service.servicioRedireccionarLink(alias);

        if (!urlDestino) {
            return ManejoErrores(req, res, {
                statusCode: 404,
                code: "LINK_NOT_FOUND",
                message: "El enlace corto no existe.",
                details: `El alias '${alias}' no está registrado en nuestro sistema.`,
                suggestion: "Crea un nuevo enlace corto en POST /api/links"
            });
        }

        res.redirect(urlDestino);

    } catch (error) {
        return ManejoErrores(req, res, {
            statusCode: 500,
            code: "REDIRECT_ERROR",
            message: "Error al procesar la redirección.",
            details: error.message
        });
    }
}