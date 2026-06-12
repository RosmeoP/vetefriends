import Perro from '../models/perro.js';
import HistorialClinico from '../models/HistorialClinico.js';

export const getPerros = async (req, res) => {
  try {
    const perros = await Perro.find().populate('propietario').sort({ createdAt: -1 });
    res.status(200).json(perros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPerro = async (req, res) => {
  const { nombre, raza, edad, peso, telefono, estado, diagnostico, ultimaVisita, dueño, propietario } = req.body;
  const perro = new Perro({ nombre, raza, edad, peso, telefono, estado, diagnostico, ultimaVisita, dueño, propietario });
  try {
    const newPerro = await perro.save();
    const populated = await Perro.findById(newPerro._id).populate('propietario');
    res.status(201).json({ message: 'Perro creado exitosamente', data: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarPerro = async (req, res) => {
  const { id } = req.params;
  const { nombre, raza, edad, peso, telefono, estado, diagnostico, ultimaVisita, dueño, propietario } = req.body;
  try {
    const perro = await Perro.findByIdAndUpdate(
      id,
      { nombre, raza, edad, peso, telefono, estado, diagnostico, ultimaVisita, dueño, propietario },
      { returnDocument: 'after' }
    ).populate('propietario');
    res.status(200).json({ message: 'Perro actualizado exitosamente', data: perro });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const eliminarPerro = async (req, res) => {
  const { id } = req.params;
  try {
    // Eliminar historiales asociados en cascada
    await HistorialClinico.deleteMany({ mascota: id });
    await Perro.findByIdAndDelete(id);
    res.status(200).json({ message: 'Perro eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPerroById = async (req, res) => {
  const { id } = req.params;
  try {
    const perro = await Perro.findById(id).populate('propietario');
    if (!perro) return res.status(404).json({ message: 'Perro no encontrado' });
    res.status(200).json(perro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};