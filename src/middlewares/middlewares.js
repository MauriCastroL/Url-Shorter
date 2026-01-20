export const ManejoErrores = (req, res, data = {}) => {
    return res.status(data.statusCode || 400).json({
        "status": data.status || "error", 
        "statusCode": data.statusCode || 400,
        "error": {
            "code": data.code || "Sin Información.",
            "message": data.message || "No hay información del problema",
            "details": data.details || "No hay detalles del problema",
            "timestamp": new Date().toISOString(),
            "path": req.path,
            "suggestion": data.suggestion || "Mira la documentación https://api.example.com/docs/errors"
        },
        "documentation_url": "https://api.example.com/docs/errors"
    });
}
