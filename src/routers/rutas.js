import { Router } from 'express';
import { obtenerUrl } from '../controllers/controles.js';

const router = Router();

router.post('/', obtenerUrl);

export default router;