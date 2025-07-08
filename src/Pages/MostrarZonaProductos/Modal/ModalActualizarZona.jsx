import React, { useState } from "react";
import axios from "axios";

const token = localStorage.getItem("token");

const ModalActualizarZona = ({ zona, onClose, onActualizar }) => {
  const [formData, setFormData] = useState({ ...zona });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    try {
      await axios.put(
        `http://localhost:3000/zonaProducto/${formData.id_zonaProductos}`,
        {
          nombre_zona: formData.nombre_zona,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onActualizar(); // Solo esta, onClose la maneja el padre
    } catch (err) {
      console.error("Error al actualizar zona:", err);
      alert("Error al actualizar zona");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Actualizar Zona</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombre_zona"
            value={formData.nombre_zona}
            onChange={handleChange}
            placeholder="Nombre de la zona"
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

export default ModalActualizarZona;
