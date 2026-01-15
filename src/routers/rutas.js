import { Router } from 'express';
import { obtenerUrl, redireccionUrl, obtenerConsultasAnteriores } from '../controllers/controles.js';

const router = Router();

router.post('/', obtenerUrl);
router.get('/:clave', redireccionUrl);
router.get('/consultas/listado', obtenerConsultasAnteriores);

export default router; 