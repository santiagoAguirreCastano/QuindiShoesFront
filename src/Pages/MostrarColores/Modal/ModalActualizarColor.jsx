import React, { useState } from "react";
import axiosClient from "../../../api/axion";

const ModalActualizarColor = ({ color, onClose, onActualizar }) => {
  const [formData, setFormData] = useState({ ...color });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Datos a enviar:", formData);
      await axiosClient.put(`/color/${formData.id_color}`, {
        nombreColor: formData.nombreColor,
        codigoHax: formData.codigoHax
      });
      onActualizar();
      onClose();
    } catch (err) {
      console.error("Error al actualizar color:", err);
      alert("Error al actualizar color");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Actualizar Color</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombreColor"
            value={formData.nombreColor}
            onChange={handleChange}
            placeholder="Nombre del color"
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="color"
            name="codigoHax"
            value={formData.codigoHax}
            onChange={handleChange}
            required
            className="w-full h-12 border rounded"
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

export default ModalActualizarColor;
