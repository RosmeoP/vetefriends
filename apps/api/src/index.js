import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { resolve } from "path";
import connectDB from "./config/db.js";
import perroRoutes from "./routes/perro.routes.js";
import propietarioRoutes from "./routes/propietario.routes.js";
import historialRoutes from "./routes/historial.routes.js";

// Configurar variables de entorno - Especificar la ruta explícitamente
const envPath = resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

// Debug: Verificar que las variables se cargaron
if (process.env.NODE_ENV !== "production") {
  console.log("🔧 Variables de entorno cargadas:");
  console.log("   PORT:", process.env.PORT || "NO DEFINIDO");
  console.log(
    "   MONGO_URI:",
    process.env.MONGO_URI ? "✓ Configurado" : "✗ NO DEFINIDO",
  );
}

// Crear aplicación Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/perros", perroRoutes);
app.use("/api/propietarios", propietarioRoutes);
app.use("/api/historiales", historialRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  console.log("Ruta / hit");
  res.json({ message: "API Veterinaria funcionando correctamente" });
});

// Debug: log todas las requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Función para iniciar el servidor
export const startServer = async () => {
  const PORT = process.env.PORT || 3000;

  // Verificar variable de entorno
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI no está definido en las variables de entorno");
    process.exit(1);
  }

  // Conectar a MongoDB
  await connectDB();

  // Iniciar servidor
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

// Si se ejecuta directamente este archivo
startServer();

export default app;
