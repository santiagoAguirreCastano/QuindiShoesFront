import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { WavesBackground } from "../../Components/Particulas2/Particulas2";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

export const Password = () => {
  const [nuevaContraseña, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const token = new URLSearchParams(window.location.search).get("token");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nuevaContraseña !== confirmarPassword) {
      return MySwal.fire({
        icon: "warning",
        title: "Contraseñas no coinciden",
        text: "Por favor, asegúrate de que ambas contraseñas sean iguales.",
        confirmButtonColor: "#fca5a5",
        background: "#fff1f2",
      });
    }

    try {
      await axios.post("https://quindishoes-backend-def.onrender.com/reiniciarContrasena", {
        token,
        contraseña: nuevaContraseña,
      });

      await MySwal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        text: "Tu contraseña ha sido restablecida con éxito.",
        confirmButtonText: "Ir al inicio de sesión",
        confirmButtonColor: "#86efac",
        background: "#f0fdfa",
      });

      navigate("/Login");
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo restablecer la contraseña. Intenta de nuevo.",
        confirmButtonColor: "#fda4af",
        background: "#fff0f5",
      });
    }
  };

  return (
    <div className="relative h-screen overflow-hidden flex items-center justify-center bg-white">
      <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
        <WavesBackground />
      </div>

      <div className="z-10 w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-green-100">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Restablecer Contraseña
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nuevaContraseña}
            onChange={(e) => setNuevaPassword(e.target.value)}
            className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            required
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            required
          />
          <motion.button
            type="submit"
            className="inline-flex items-center justify-center
                       bg-gradient-to-r from-green-400 to-pink-400
                       hover:from-green-500 hover:to-pink-500
                       text-white font-semibold text-base sm:text-lg px-6 py-3 rounded-full
                       shadow-lg hover:shadow-xl
                       transform hover:scale-105 transition-all duration-300 ease-out
                       focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-75"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            🔒 Restablecer Contraseña
          </motion.button>
        </form>
      </div>
    </div>
  );
};
