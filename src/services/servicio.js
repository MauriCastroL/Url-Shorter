import * as repo from '../repositories/repo.js';
import {generadorAlias} from '../utils/generadorAlias.js'
import validator from 'validator';

export const servicioExtraerTodosLosLinks = async (limit, page) => {
    const offset = (page - 1) * limit;
    const resultado = await repo.extraerLinks(limit, offset);
    return resultado;
}

export const servicioGenerarLinkNuevo = async (link) => {
        
    // Agregamos el protocolo la link 
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
        link = 'https://' + link;
    }


    // Verificamos que sea un link valido
    try {
        new URL(link);

        // Aplicamos validación extra
        if (!validator.isURL(link, { 
            require_protocol: true,  
            require_tld: true       
        })) {
            throw new Error("URL inválida segun validator");
        }
    } catch (error) {   
        throw new Error("La URL proporcionada no es válida");
    }

    let alias = generadorAlias();

    let linkEncontrado = await repo.extraerLink(alias);

    while (linkEncontrado) {
        alias = generadorAlias();
        
        linkEncontrado = await repo.extraerLink(alias);
    }

    const resultado = await repo.guardarLink(alias, link);

    if (!resultado) {
        throw new Error("No pudo guardarse el nuevo link");
    }

    return resultado;
}
    

export const servicioEliminarLink = async (alias) => {
    return await repo.repoEliminarLink(alias);
}

export const servicioRedireccionarLink = async (alias) => {
    const linkActualizado = await repo.aumentarVisitas(alias);
    
    if (!linkActualizado) {
        return null; 
    }

    return linkActualizado.original_url;
}