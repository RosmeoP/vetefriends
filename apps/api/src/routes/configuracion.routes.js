import express from 'express';
import {
  getConfiguracion,
  updateConfiguracion,
} from '../controllers/configuracion.controllers.js';

const router = express.Router();

router.get('/', getConfiguracion);
router.put('/', updateConfiguracion);

export default router;
