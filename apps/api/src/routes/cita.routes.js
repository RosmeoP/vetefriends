import express from 'express';
import {
  getCitas,
  getCitaById,
  createCita,
  actualizarCita,
  eliminarCita,
} from '../controllers/cita.controllers.js';

const router = express.Router();

router.get('/',       getCitas);
router.get('/:id',    getCitaById);
router.post('/',      createCita);
router.put('/:id',    actualizarCita);
router.delete('/:id', eliminarCita);

export default router;
