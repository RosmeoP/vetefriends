import express from 'express';
import {
  getAllPropietarios,
  getPropietarioById,
  createPropietario,
  updatePropietario,
  deletePropietario,
} from '../controllers/propietario.controllers.js';

const router = express.Router();

router.get('/',    getAllPropietarios);
router.get('/:id', getPropietarioById);
router.post('/',   createPropietario);
router.put('/:id', updatePropietario);
router.delete('/:id', deletePropietario);

export default router;
