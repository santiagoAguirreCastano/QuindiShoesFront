import React, { useState } from "react";
import axiosClient from "../../api/axion";
import { motion } from "framer-motion";

const CambiarContraseñaForm = () => {
  const [contraseñaActual, setContraseñaActual] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nuevaContraseña !== confirmarContraseña) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);
    setMensaje("");
    try {
      const response = await axiosClient.post(
        "/cambiarContrasenaR",
        {
          contraseñaActual: contraseñaActual,
          nuevaContraseña: nuevaContraseña,
        }
      );
      setMensaje("Contraseña cambiada con éxito");
      setContraseñaActual("");
      setNuevaContraseña("");
      setConfirmarContraseña("");
    } catch (error) {
      setMensaje("Hubo un error al cambiar la contraseña.");
    }
    setCargando(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5 w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
    >
      <input
        type="password"
        placeholder="Contraseña actual"
        value={contraseñaActual}
        onChange={(e) => setContraseñaActual(e.target.value)}
        className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
        required
      />
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={nuevaContraseña}
        onChange={(e) => setNuevaContraseña(e.target.value)}
        className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
        required
      />
      <input
        type="password"
        placeholder="Confirmar nueva contraseña"
        value={confirmarContraseña}
        onChange={(e) => setConfirmarContraseña(e.target.value)}
        className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
        required
      />

      {mensaje && (
        <p className={`text-center text-sm ${mensaje.includes("éxito") ? "text-green-500" : "text-red-500"}`}>
          {mensaje}
        </p>
      )}

      <motion.button
        type="submit"
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition-all"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        disabled={cargando}
      >
        {cargando ? "Guardando..." : "Cambiar Contraseña"}
      </motion.button>
    </motion.form>
  );
};

export default CambiarContraseñaForm;
