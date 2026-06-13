import Configuracion from '../models/Configuracion.js';

// Always operate on a single config document (create it on first read).
export const getConfiguracion = async (req, res) => {
  try {
    let config = await Configuracion.findOne();
    if (!config) config = await Configuracion.create({});
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateConfiguracion = async (req, res) => {
  const { nombreClinica, direccion, telefono, correo, horario } = req.body;
  try {
    const config = await Configuracion.findOneAndUpdate(
      {},
      { nombreClinica, direccion, telefono, correo, horario },
      { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ message: 'Configuración actualizada exitosamente', data: config });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
