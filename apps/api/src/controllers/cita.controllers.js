import Cita from '../models/Cita.js';

export const getCitas = async (req, res) => {
  try {
    const citas = await Cita.find()
      .populate('paciente')
      .sort({ fecha: 1, hora: 1 });
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCitaById = async (req, res) => {
  const { id } = req.params;
  try {
    const cita = await Cita.findById(id).populate('paciente');
    if (!cita) return res.status(404).json({ message: 'Cita no encontrada' });
    res.status(200).json(cita);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCita = async (req, res) => {
  const { paciente, fecha, hora, motivo, veterinario, estado } = req.body;
  const cita = new Cita({ paciente, fecha, hora, motivo, veterinario, estado });
  try {
    const newCita = await cita.save();
    const populated = await Cita.findById(newCita._id).populate('paciente');
    res.status(201).json({ message: 'Cita creada exitosamente', data: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarCita = async (req, res) => {
  const { id } = req.params;
  const { paciente, fecha, hora, motivo, veterinario, estado } = req.body;
  try {
    const cita = await Cita.findByIdAndUpdate(
      id,
      { paciente, fecha, hora, motivo, veterinario, estado },
      { returnDocument: 'after', runValidators: true }
    ).populate('paciente');
    if (!cita) return res.status(404).json({ message: 'Cita no encontrada' });
    res.status(200).json({ message: 'Cita actualizada exitosamente', data: cita });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const eliminarCita = async (req, res) => {
  const { id } = req.params;
  try {
    const cita = await Cita.findByIdAndDelete(id);
    if (!cita) return res.status(404).json({ message: 'Cita no encontrada' });
    res.status(200).json({ message: 'Cita eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
