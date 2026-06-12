import express from "express";
import {
  getPerros,
  createPerro,
  actualizarPerro,
  eliminarPerro,
  getPerroById,
} from "../controllers/perro.controllers.js";

const router = express.Router();

// GET /api/perros - Obtener todos los perros
router.get("/", getPerros);

// GET /api/perros/:id - Obtener un perro por ID
router.get("/:id", getPerroById);

// POST /api/perros - Crear un nuevo perro
router.post("/", createPerro);

// PUT /api/perros/:id - Actualizar un perro
router.put("/:id", actualizarPerro);

// DELETE /api/perros/:id - Eliminar un perro
router.delete("/:id", eliminarPerro);

export default router;
