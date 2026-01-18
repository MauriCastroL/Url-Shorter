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

export function ManejoSuccess(req, res, data, { status_code, status, message, details, meta_opcional = null}, _links) {
    return res.status(Number(status_code)).json({
        data,
        "status": status,
        "statusCode": status_code,
        "info": {
            "message": message,
            "details": details,
            "timestamp": new Date().toISOString(),
            "path": req.originalUrl
        },
        ...(meta_opcional && { meta: meta_opcional }),
        _links
    })
}

export function hateoas(isAdmin = false, links = {}, req) {
    // TO-DO
} 

