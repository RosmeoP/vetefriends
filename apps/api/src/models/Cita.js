import mongoose from 'mongoose';

const citaSchema = new mongoose.Schema(
  {
    paciente: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Perro',
      required: true,
    },
    fecha:       { type: Date,   required: true },
    hora:        { type: String, required: true, trim: true },
    motivo:      { type: String, required: true, trim: true },
    veterinario: { type: String, trim: true },
    estado: {
      type:    String,
      enum:    ['Programada', 'Confirmada', 'Completada', 'Cancelada'],
      default: 'Programada',
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('Cita', citaSchema);
