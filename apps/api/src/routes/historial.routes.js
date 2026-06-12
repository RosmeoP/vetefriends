import express from 'express';
import {
  getHistorialesByMascota,
  getHistorialById,
  createHistorial,
  updateHistorial,
  deleteHistorial,
} from '../controllers/historial.controllers.js';

const router = express.Router();

router.get('/mascota/:mascotaId', getHistorialesByMascota);
router.get('/:id',               getHistorialById);
router.post('/',                 createHistorial);
router.put('/:id',               updateHistorial);
router.delete('/:id',            deleteHistorial);

export default router;
