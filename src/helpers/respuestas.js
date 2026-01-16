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

export function ManejoSuccess(req, res, { status_code, status, message, details }) {
    return res.status(Number(status_code)).json({
        "status": status,
        "statusCode": status_code,
        "info": {
            "message": message,
            "details": details,
            "timestamp": new Date().toISOString(),
            "path": req.originalUrl
        }
    })
}

export function hateoas(isAdmin = false, json_data, { self_desc, clave }, req) {
    if (!isAdmin) {
        return json_data["_links"] = {
            "self": {
                "href": req.protocol + '://' + req.host + "/url/short/" + clave,
                "method": "GET",
                "desc": self_desc
            }
        }
    } else {
        return {
            "code": "NOT IMPLEMENTED"
        }
    }

} 

/* {
  "data": {
    "id": "abc12",
    "original": "https://google.com",
    "clicks": 5
  },
  "links": {
    "self": {
      "href": "http://localhost:3000/api/url/abc12",
      "method": "GET",
      "desc": "Ver detalles de esta URL"
    },
    "delete": {
      "href": "http://localhost:3000/api/url/abc12",
      "method": "DELETE",
      "desc": "Borrar esta URL permanentemente"
    },
    "update": {
      "href": "http://localhost:3000/api/url/abc12",
      "method": "PATCH",
      "desc": "Modificar la URL original"
    }
  }
} */