const letras = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generadorAlias = () => {
    let alias = ''

    for (let i = 0; i <= 6; i++) {
        alias += letras.charAt(Math.random() * letras.length)
    }

    return alias;
}