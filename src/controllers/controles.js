const mapa = new Map();
const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function obtenerUrl(req, res) {
    // Verificamos que exista contenido
    if (req.body) {

        const url = req.body.url;
        const isValid = isUrlValid(url);

        if (isValid) {
            // Ya esta acortada, se busca la urlLarga
            if (isUrlShort(url)) {
                res.json({
                    [url]: mapa.get(url)
                });

                return;
            } else {
                const urlCorta = "http://localhost:3000/url/short/" + generadorUrl();
                mapa.set(urlCorta, url);
                res.json({
                    [urlCorta]: url
                });

                return;
            }
        } else {
            res.status(400).json({
                "error": "url invalida",
                "type_error": "Falta de protocolo HTTP/HTTPS"
            });
            return;
        }
    } 

    res.status(400).json({
        "error": "Debe ingresar contenido en el body de la petición"
    })

    return;
}

function isUrlShort(url) {
    const isValid = isUrlValid(url);

    // Verfica si la url ya esta acortada
    if (isValid && mapa.get(url)) {
        return true;
    }

    return false;
}

function isUrlValid(url) {
    // Verifica que el url tenga el metodo correspondiente de la url 
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return true;
    }

    return false;
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