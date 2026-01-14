import { Router } from 'express';
import { obtenerUrl, redireccionUrl } from '../controllers/controles.js';

const router = Router();

router.post('/', obtenerUrl);
router.get('/:clave', redireccionUrl);

export default router;