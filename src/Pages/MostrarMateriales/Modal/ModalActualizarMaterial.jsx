import React, { useState } from "react";
import axios from "axios";

const ModalActualizarMaterial = ({ material, onClose, onActualizar }) => {
  const [formData, setFormData] = useState({ ...material });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      console.log("Datos a enviar:", formData);
      await axios.put(
        `https://quindishoes-backend-def.onrender.com/material/${formData.id_material}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onActualizar();
      onClose();
    } catch (error) {
      console.error("Error al actualizar material:", error);
      alert("Error al actualizar material");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">
          Actualizar Material
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombre_material"
            value={formData.nombre_material}
            onChange={handleChange}
            placeholder="Nombre del material"
            required
            className="w-full p-2 border rounded"
          />

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-red-500 px-4 py-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalActualizarMaterial;
