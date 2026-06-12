import mongoose from 'mongoose';

const perroSchema = new mongoose.Schema(
  {
    nombre:      { type: String, required: true, trim: true },
    raza:        { type: String, required: true, trim: true },
    edad:        { type: Number, required: true },
    peso:        { type: Number },
    telefono:    { type: String, trim: true },
    estado:      { type: String, trim: true },
    diagnostico: { type: String, trim: true },
    ultimaVisita:{ type: Date },
    dueño:       { type: String, trim: true },
    propietario: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Propietario',
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('Perro', perroSchema);
