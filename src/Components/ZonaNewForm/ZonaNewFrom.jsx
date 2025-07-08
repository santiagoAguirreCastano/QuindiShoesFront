import React, { useState } from "react";
import axiosClient from "../../api/axion";

export const ZonaNewForm = () => {
  const [zona, setZona] = useState({
    nombreZona: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setZona({
      ...zona,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await axiosClient.post("/zonaProducto", zona, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Zona registrada:", response.data);
      alert("¡Zona registrada con éxito!");

      const nuevoToken = response.headers["x-renewed-token"];
      if (nuevoToken) {
        localStorage.setItem("token", nuevoToken);
      }

      // Limpiar el formulario
      setZona({ nombreZona: "" });

    } catch (error) {
      console.error("Error al registrar zona:", error);
      alert("Hubo un error al registrar la zona.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Registro de zona del producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombreZona"
          placeholder="Nombre de la zona"
          value={zona.nombreZona}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Registrar zona
        </button>
      </form>
    </div>
  );
};
