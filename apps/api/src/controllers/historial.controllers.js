import HistorialClinico from '../models/HistorialClinico.js';

export const getHistoriales = async (req, res) => {
  try {
    const historiales = await HistorialClinico.find()
      .populate('mascota')
      .sort({ fechaConsulta: -1 });
    res.status(200).json(historiales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistorialesByMascota = async (req, res) => {
  const { mascotaId } = req.params;
  try {
    const historiales = await HistorialClinico.find({ mascota: mascotaId }).sort({ fechaConsulta: -1 });
    res.status(200).json(historiales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistorialById = async (req, res) => {
  const { id } = req.params;
  try {
    const historial = await HistorialClinico.findById(id).populate('mascota');
    if (!historial) return res.status(404).json({ message: 'Historial no encontrado' });
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createHistorial = async (req, res) => {
  const { fechaConsulta, motivo, diagnostico, tratamiento, veterinario, mascota } = req.body;
  const historial = new HistorialClinico({ fechaConsulta, motivo, diagnostico, tratamiento, veterinario, mascota });
  try {
    const newHistorial = await historial.save();
    res.status(201).json({ message: 'Historial creado exitosamente', data: newHistorial });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHistorial = async (req, res) => {
  const { id } = req.params;
  const { fechaConsulta, motivo, diagnostico, tratamiento, veterinario } = req.body;
  try {
    const historial = await HistorialClinico.findByIdAndUpdate(
      id,
      { fechaConsulta, motivo, diagnostico, tratamiento, veterinario },
      { returnDocument: 'after', runValidators: true }
    );
    if (!historial) return res.status(404).json({ message: 'Historial no encontrado' });
    res.status(200).json({ message: 'Historial actualizado exitosamente', data: historial });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHistorial = async (req, res) => {
  const { id } = req.params;
  try {
    const historial = await HistorialClinico.findByIdAndDelete(id);
    if (!historial) return res.status(404).json({ message: 'Historial no encontrado' });
    res.status(200).json({ message: 'Historial eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
