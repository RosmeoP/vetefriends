import mongoose from 'mongoose';

const historialClinicoSchema = new mongoose.Schema(
  {
    fechaConsulta: { type: Date, required: true, default: Date.now },
    motivo:        { type: String, required: true, trim: true },
    diagnostico:   { type: String, required: true, trim: true },
    tratamiento:   { type: String, required: true, trim: true },
    veterinario:   { type: String, required: true, trim: true },
    mascota:       { type: mongoose.Schema.Types.ObjectId, ref: 'Perro', required: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('HistorialClinico', historialClinicoSchema);
