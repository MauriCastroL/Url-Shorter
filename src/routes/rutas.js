import Router from 'express';
import { listarLinks, acortarLink, eliminarLink, redireccionarLink } from '../controllers/controladores.js'

const router = Router();

// Generamos todas las rutas que vallamos a usar

router.post('/', acortarLink);
router.get('/links', listarLinks);
router.get('/:alias', redireccionarLink);
router.delete('/:alias', eliminarLink);

export default router