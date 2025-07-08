import React, { useState } from "react";
import axiosClient from "../../../api/axion";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserEdit } from "react-icons/fa";

const ModalActualizarEmpleado = ({ empleado, onClose, onActualizar }) => {
  const [formData, setFormData] = useState({ ...empleado });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const datosBackend = {
    nombre: formData.nombres,
    apellido: formData.apellidos,
    telefono: formData.telefono,
    direccion: formData.direccion,
    correo: formData.correo,
    rol: formData.rol
  };

  try {
    await axiosClient.put(`/empleado/${formData.id}`, datosBackend);
    onActualizar();
    Swal.fire({
      icon: "success",
      title: "Empleado actualizado correctamente",
      confirmButtonColor: "#4CAF50",
      timer: 1800,
      showConfirmButton: false,
    });
    onClose();
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    Swal.fire({
      icon: "error",
      title: "Error al actualizar empleado",
      text: "Intenta de nuevo más tarde",
      confirmButtonColor: "#E53935",
    });
  }
};

  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-center items-center px-4"
      >
        <motion.div
          key="form"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-xl border border-green-200"
        >
          {/* Encabezado */}
          <div className="flex items-center gap-3 mb-6">
            <FaUserEdit className="text-green-600 text-2xl" />
            <h2 className="text-2xl font-bold text-green-700">
              Actualizar Empleado
            </h2>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos personales */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                Datos personales
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Nombres</label>
                  <input
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Apellidos</label>
                  <input
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>
            </div>

            {/* Datos de contacto */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                Contacto
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Teléfono</label>
                  <input
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Dirección</label>
                  <input
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>
            </div>

            {/* Correo y rol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Rol</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="vendedor">Vendedor</option>
                  <option value="domiciliario">Domiciliario</option>
                </select>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-red-400 text-red-500 rounded-lg hover:bg-red-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalActualizarEmpleado;
