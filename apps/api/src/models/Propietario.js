import mongoose from 'mongoose';

const propietarioSchema = new mongoose.Schema(
  {
    nombreCompleto: { type: String, required: true, trim: true },
    dui:            { type: String, required: true, unique: true, trim: true },
    telefono:       { type: String, required: true, trim: true },
    correo:         { type: String, required: true, trim: true },
    direccion:      { type: String, required: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('Propietario', propietarioSchema);
