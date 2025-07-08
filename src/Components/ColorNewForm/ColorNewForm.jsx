import React, { useState } from "react";
import axiosClient from "../../api/axion";
import { FaPalette } from "react-icons/fa";

export const ColorNewForm = ({ onColorGuardado }) => {
  const [color, setColor] = useState({
    nombreColor: "",
    codigoHax: "#000000",
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null); // { tipo: "success" | "error", texto: string }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setColor({
      ...color,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);
    try {
      const token = localStorage.getItem("token");

      const response = await axiosClient.post("/color", color, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMensaje({
        tipo: "success",
        texto: "¡Color registrado con éxito!",
      });

      const nuevoToken = response.headers["x-renewed-token"];
      if (nuevoToken) {
        localStorage.setItem("token", nuevoToken);
      }

      setColor({ nombreColor: "", codigoHax: "#000000" });

      // Llama a la función de recarga si está definida
      if (typeof onColorGuardado === "function") {
        onColorGuardado();
      }
    } catch (error) {
      let texto = "Hubo un error al registrar el color.";
      if (
        error?.response?.data?.mensaje &&
        error.response.data.mensaje.toLowerCase().includes("existe")
      ) {
        texto = "El color ya existe. Intenta con otro nombre o código.";
      }
      setMensaje({
        tipo: "error",
        texto,
      });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 mb-10 bg-white p-8 rounded-2xl shadow-xl border border-indigo-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700 flex items-center justify-center gap-2">
        <FaPalette className="text-3xl" /> Registrar nuevo color
      </h2>
      {mensaje && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-center font-semibold shadow transition-all ${
            mensaje.tipo === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-pink-100 text-pink-700 border border-pink-200"
          }`}
        >
          {mensaje.texto}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Nombre del color
          </label>
          <input
            type="text"
            name="nombreColor"
            placeholder="Ej: Azul Pastel"
            value={color.nombreColor}
            onChange={handleChange}
            className="w-full p-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Selecciona el color
          </label>
          <input
            type="color"
            name="codigoHax"
            value={color.codigoHax}
            onChange={handleChange}
            className="w-full h-14 cursor-pointer rounded-lg border-2 border-indigo-200"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Registrando..." : "Registrar color"}
        </button>
      </form>
    </div>
  );
};
