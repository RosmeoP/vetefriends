import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema(
  {
    nombre:      { type: String, required: true, trim: true },
    categoria:   { type: String, trim: true },
    cantidad:    { type: Number, required: true, default: 0, min: 0 },
    precio:      { type: Number, default: 0, min: 0 },
    descripcion: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('Producto', productoSchema);
