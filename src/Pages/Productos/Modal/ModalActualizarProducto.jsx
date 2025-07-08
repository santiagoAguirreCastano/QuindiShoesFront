import React, { useState } from "react";
import axiosClient from "../../../api/axion";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { tiposProductoPredeterminados } from "../../../utils/tiposProducto";
import { FaPlus } from "react-icons/fa";

const ModalActualizarProducto = ({ producto, onClose, onActualizar }) => {
  const [formData, setFormData] = useState({
    tipoProducto: producto.tipo_producto,
    nombreProducto: producto.nombre_producto,
    generoProducto: producto.genero_producto,
    precioProducto: producto.precio_producto,
    id_producto: producto.id_producto,
    urlImagen: producto.imagenes?.[0]?.url || "", // Nueva línea
  });

  const [mostrarInputTipo, setMostrarInputTipo] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "precioProducto" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tipoFinal = mostrarInputTipo ? nuevoTipo : formData.tipoProducto;

    if (
      !tipoFinal ||
      !formData.nombreProducto ||
      !formData.generoProducto ||
      !formData.precioProducto
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos.",
      });
      return;
    }

    if (
      formData.urlImagen.trim() !== "" &&
      !formData.urlImagen.startsWith("http")
    ) {
      Swal.fire({
        icon: "warning",
        title: "URL inválida",
        text: "La URL de la imagen no es válida.",
      });
      return;
    }

    try {
      await axiosClient.put(`/producto/${formData.id_producto}`, {
        ...formData,
        tipoProducto: tipoFinal,
        imagenUrl: formData.urlImagen, // Envío al backend
      });

      onActualizar();
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El producto se actualizó correctamente.",
        timer: 1500,
        showConfirmButton: false,
        background: "#fff",
      });
      onClose();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el producto.",
        confirmButtonColor: "#f87171",
      });
    }
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md px-2 sm:px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white bg-opacity-90 rounded-2xl w-full max-w-lg shadow-2xl border border-pink-200 p-6 sm:p-8"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-center text-pink-600 mb-6">
        ✏️ Editar Producto
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select o input personalizado para tipo de producto */}
        {!mostrarInputTipo ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              name="tipoProducto"
              value={formData.tipoProducto}
              onChange={handleChange}
              required
              className="w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="">Seleccione un tipo</option>
              {tiposProductoPredeterminados.map((tipo, index) => (
                <option key={index} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            <motion.button
              type="button"
              onClick={() => setMostrarInputTipo(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus /> Otro
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Nuevo tipo de producto"
              value={nuevoTipo}
              onChange={(e) => setNuevoTipo(e.target.value)}
              className="w-full p-3 border border-pink-200 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setMostrarInputTipo(false)}
              className="w-full sm:w-auto px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md"
            >
              Cancelar
            </button>
          </div>
        )}

        <input
          name="nombreProducto"
          value={formData.nombreProducto}
          onChange={handleChange}
          placeholder="Nombre del producto"
          required
          className="w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <motion.select
          name="generoProducto"
          value={formData.generoProducto}
          onChange={handleChange}
          className="w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <option value="">Seleccione género</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Unisex">Unisex</option>
        </motion.select>

        <input
          name="precioProducto"
          type="number"
          value={formData.precioProducto}
          onChange={handleChange}
          placeholder="Precio"
          required
          className="w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <input
          name="urlImagen"
          value={formData.urlImagen}
          onChange={handleChange}
          placeholder="URL de la imagen del producto"
          className="w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 text-sm rounded-lg bg-pink-500 hover:bg-pink-600 text-white shadow-md"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </motion.div>
  </div>
);
}

export default ModalActualizarProducto;
