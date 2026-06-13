import mongoose from 'mongoose';

// Singleton: only one clinic-profile document is kept.
const configuracionSchema = new mongoose.Schema(
  {
    nombreClinica: { type: String, trim: true, default: '' },
    direccion:     { type: String, trim: true, default: '' },
    telefono:      { type: String, trim: true, default: '' },
    correo:        { type: String, trim: true, default: '' },
    horario:       { type: String, trim: true, default: '' },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('Configuracion', configuracionSchema);
