// ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { WavesBackground } from "../Particulas2/Particulas2";
import { motion } from "framer-motion"; // Import motion for animations

const MySwal = withReactContent(Swal);

export const Email = () => {
  const [correo, setCorreo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!correo) {
      MySwal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor, introduce tu correo electrónico.",
        confirmButtonColor: "#f472b6", // rosa pastel
      });
      return;
    }

    try {
      await axios.post("http://localhost:3000/RecuperarContrasena", { correo });
      MySwal.fire({
        icon: "success",
        title: "¡Correo enviado!",
        text: "Revisa tu bandeja de entrada para continuar con el cambio de contraseña.",
        confirmButtonColor: "#a7f3d0", // verde pastel (kept for success)
        background: "#f0fff4",
      });
    } catch (error) {
      console.error("Error al enviar correo de recuperación:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo enviar el correo. Intenta nuevamente.",
        confirmButtonColor: "#fda4af", // rojo pastel (kept for error)
        background: "#fff1f2",
      });
    }
  };

  return (
    <>
      <WavesBackground />
      <div className="min-h-screen flex items-center justify-center p-4"> {/* Added pastel background */}
        <motion.div // Added motion for animations
          className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-pink-100" // Pastel border
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6 drop-shadow-sm"> {/* Pastel purple heading */}
            Recuperar Contraseña
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}> {/* Added onSubmit to form */}
            <input
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300" // Pastel pink/purple inputs
              required
            />
            <motion.button
              type="submit"
              className="w-full inline-flex items-center justify-center
                         bg-gradient-to-r from-purple-400 to-pink-500 {/* Pastel pink gradient */}
                         hover:from-purple-500 hover:to-pink-600
                         text-white font-semibold text-lg py-3 rounded-full
                         shadow-lg hover:shadow-xl
                         transform hover:scale-105 transition-all duration-300 ease-out
                         focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-75" // Pastel focus ring
              whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.97 }}
            >
              Enviar enlace
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
};