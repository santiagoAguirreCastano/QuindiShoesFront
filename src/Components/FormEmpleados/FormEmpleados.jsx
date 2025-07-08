import React, { useState } from "react";
import axiosClient from "../../api/axion";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";

export const FormEmpleados = ({ modoModal = false, onClose }) => {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    correo: "",
    contrasena: "",
    rol: "vendedor",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.post("/register", formData);
      Swal.fire({
        icon: "success",
        title: "Empleado registrado",
        confirmButtonColor: "#4CAF50",
        timer: 1800,
        showConfirmButton: false,
      });
      if (modoModal && onClose) onClose();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: "Revisa los campos o intenta más tarde",
        confirmButtonColor: "#E53935",
      });
    }
  };

  const Formulario = (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-xl border border-green-200"
    >
      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-6">
        <FaUserPlus className="text-green-600 text-2xl" />
        <h2 className="text-2xl font-bold text-green-700">
          Registro de Empleados
        </h2>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombres y Apellidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Nombres</label>
            <input
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Apellidos</label>
            <input
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Teléfono y Dirección */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Teléfono</label>
            <input
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Dirección</label>
            <input
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Correo y Contraseña */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Correo</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Contraseña</label>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Rol */}
        <div>
          <label className="text-sm text-gray-600">Rol</label>
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          >
            <option value="vendedor">Vendedor</option>
            <option value="domiciliario">Domiciliario</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 mt-6">
          {modoModal && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-red-400 text-red-500 rounded-lg hover:bg-red-50 transition"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Registrar
          </button>
        </div>
      </form>
    </motion.div>
  );

  return modoModal ? (
  <AnimatePresence>
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-center items-center px-4"
    >
      {/* Fondo difuminado */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />

      {/* Contenido del modal */}
      <div className="relative z-10">{Formulario}</div>
    </motion.div>
  </AnimatePresence>
) : (
  <div className="my-20 px-4">{Formulario}</div>
);
};
