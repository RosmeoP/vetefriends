import Producto from '../models/Producto.js';

export const getProductos = async (req, res) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findById(id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProducto = async (req, res) => {
  const { nombre, categoria, cantidad, precio, descripcion } = req.body;
  const producto = new Producto({ nombre, categoria, cantidad, precio, descripcion });
  try {
    const nuevo = await producto.save();
    res.status(201).json({ message: 'Producto creado exitosamente', data: nuevo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, cantidad, precio, descripcion } = req.body;
  try {
    const producto = await Producto.findByIdAndUpdate(
      id,
      { nombre, categoria, cantidad, precio, descripcion },
      { returnDocument: 'after', runValidators: true }
    );
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json({ message: 'Producto actualizado exitosamente', data: producto });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByIdAndDelete(id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
