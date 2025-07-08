import React, { useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "../../api/axion";

export default function EditarDatosUsuario({ usuario, onClose, onUpdate }) {
  const [form, setForm] = useState({
    nombre: usuario?.nombre || "",
    apellido: usuario?.apellido || "", // <-- usa apellido (singular)
    correo: usuario?.correo || "",
    telefono: usuario?.telefono || "",
    direccion: usuario?.direccion || "",
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const res = await axiosClient.put(`/profile/${usuario.id_usuario}`, form);
      onUpdate(res.data); // <-- Esto envía el usuario actualizado al Perfil
      onClose();
    } catch (err) {
      setError("Error al actualizar datos.");
    }
    setCargando(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    >
      <div className="bg-white bg-opacity-95 p-8 rounded-3xl shadow-2xl border border-pink-100 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-pink-500 hover:text-pink-700 text-2xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6 drop-shadow">
          Editar Datos
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              name="nombre"
              type="text"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              className="flex-1 px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
            <input
              name="apellido"
              type="text"
              placeholder="Apellido"
              value={form.apellido}
              onChange={handleChange}
              className="flex-1 px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>
          <input
            name="correo"
            type="email"
            placeholder="Correo"
            value={form.correo}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
          <input
            name="telefono"
            type="text"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
          <input
            name="direccion"
            type="text"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <motion.button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r bg-pink-400 text-white font-bold text-lg shadow-lg hover:from-pink-500 hover:to-emerald-500 transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={cargando}
          >
            {cargando ? "Guardando..." : "Guardar Cambios"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}