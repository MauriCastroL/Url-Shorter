export function ManejoError(req, res, { status_code, status, code, message, details, suggestion }) {
    // Estandarización de errores
    return res.status(Number(status_code)).json({
        "status": status, 
        "statusCode": status_code,
        "error": {
            "code": `${code}`,
            "message": message,
            "details": details,
            "timestamp": new Date().toISOString(),
            "path": req.originalUrl,
            "suggestion": suggestion
        },
    });
}

export function ManejoSuccess(req, res, { status_code, status, message, details }, _links) {
    return res.status(Number(status_code)).json({
        "status": status,
        "statusCode": status_code,
        "info": {
            "message": message,
            "details": details,
            "timestamp": new Date().toISOString(),
            "path": req.originalUrl
        },
        _links
    })
}

export function hateoas(isAdmin = false, { self_desc, clave }, req) {
    if (!isAdmin) {
        return {
            "self": {
            "href": req.protocol + '://' + req.host + "/url/short/" + clave,
            "method": "GET",
            "desc": self_desc
            }
        }
    } else {
        return {
            "self": {
            "href": req.protocol + '://' + req.host + "/url/short/" + clave,
            "method": "GET",
            "desc": self_desc
            },
            "delete": {
            "href": "http://localhost:3000/api/url/" + clave,
            "method": "DELETE",
            "desc": "Borrar esta URL permanentemente"
            },
            "update": {
            "href": "http://localhost:3000/api/url/abc12",
            "method": "PATCH",
            "desc": "Modificar la URL original"
            }
        }
    }

} 

