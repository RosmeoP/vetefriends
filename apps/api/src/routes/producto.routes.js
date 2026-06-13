import express from 'express';
import {
  getProductos,
  getProductoById,
  createProducto,
  actualizarProducto,
  eliminarProducto,
} from '../controllers/producto.controllers.js';

const router = express.Router();

router.get('/',       getProductos);
router.get('/:id',    getProductoById);
router.post('/',      createProducto);
router.put('/:id',    actualizarProducto);
router.delete('/:id', eliminarProducto);

export default router;
