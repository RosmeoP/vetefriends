import Propietario from '../models/Propietario.js';
import Perro from '../models/perro.js';

export const getAllPropietarios = async (req, res) => {
  try {
    const propietarios = await Propietario.find().sort({ createdAt: -1 });
    res.status(200).json(propietarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPropietarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const propietario = await Propietario.findById(id);
    if (!propietario) return res.status(404).json({ message: 'Propietario no encontrado' });
    res.status(200).json(propietario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPropietario = async (req, res) => {
  const { nombreCompleto, dui, telefono, correo, direccion } = req.body;
  const propietario = new Propietario({ nombreCompleto, dui, telefono, correo, direccion });
  try {
    const newPropietario = await propietario.save();
    res.status(201).json({ message: 'Propietario creado exitosamente', data: newPropietario });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Ya existe un propietario con ese DUI' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updatePropietario = async (req, res) => {
  const { id } = req.params;
  const { nombreCompleto, dui, telefono, correo, direccion } = req.body;
  try {
    const propietario = await Propietario.findByIdAndUpdate(
      id,
      { nombreCompleto, dui, telefono, correo, direccion },
      { returnDocument: 'after', runValidators: true }
    );
    if (!propietario) return res.status(404).json({ message: 'Propietario no encontrado' });
    res.status(200).json({ message: 'Propietario actualizado exitosamente', data: propietario });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Ya existe un propietario con ese DUI' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deletePropietario = async (req, res) => {
  const { id } = req.params;
  try {
    // Verificar si tiene mascotas asignadas
    const mascotasCount = await Perro.countDocuments({ propietario: id });
    if (mascotasCount > 0) {
      return res.status(400).json({
        message: `No se puede eliminar el propietario porque tiene ${mascotasCount} mascota(s) asignada(s)`,
      });
    }
    const propietario = await Propietario.findByIdAndDelete(id);
    if (!propietario) return res.status(404).json({ message: 'Propietario no encontrado' });
    res.status(200).json({ message: 'Propietario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
