import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ParticlesBackground } from "../Particulas/ParticlesBackground";
import { WavesBackground } from "../../Components/Particulas2/Particulas2";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
const MySwal = withReactContent(Swal);

export const LoginForm = () => {
  const navigate = useNavigate();
   useEffect(() => {
    document.body.style.overflow = "hidden"; // Desactiva scroll
    return () => {
      document.body.style.overflow = "auto"; // Lo vuelve a activar al salir
    };
  }, []);
  const [loginData, setLoginData] = useState({
    correo: "",
    contraseña: "",
    recaptchaToken: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRecaptchaChange = (token) => {
    setLoginData({
      ...loginData,
      recaptchaToken: token,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.recaptchaToken) {
      MySwal.fire({
        icon: "warning",
        title: "¡reCAPTCHA requerido!",
        text: "Por favor, completa el reCAPTCHA.",
        confirmButtonColor: "#f472b6",
      });
      return;
    }

    try {
      const response = await axios.post("https://quindishoes-backend-def.onrender.com/auth", loginData);
      // Validar que el token tiene datos de usuario
      const token = response.data.token;
      let payload = {};
      try {
        payload = JSON.parse(atob(token.split('.')[1]));
      } catch {
        payload = {};
      }
      if (!payload.data || !payload.data.id) {
        MySwal.fire({
          icon: "error",
          title: "Error de autenticación",
          text: "El token recibido no contiene datos de usuario. Contacta soporte.",
          confirmButtonColor: "#fda4af",
          background: "#fff1f2",
        });
        return;
      }
      localStorage.setItem("token", token);
      localStorage.setItem("rol", response.data.rol);
      if (response.data.id) {
        localStorage.setItem("id", response.data.id);
      }
      // Log para depuración: verifica que el token se guarda correctamente
      console.log("🔑 Token guardado en localStorage:", localStorage.getItem("token"));

      await MySwal.fire({
        icon: "success",
        title: "¡Bienvenido/a!",
        text: "Inicio de sesión exitoso.",
        confirmButtonColor: "#a7f3d0",
        background: "#fff0f5",
      });

      if (
        response.data.rol === "Empleado" ||
        response.data.rol === "domiciliario" ||
        response.data.rol === "vendedor" ||
        response.data.rol === "administrador"
      ) {
        navigate("/PanelControl");
      } else if (response.data.rol === "cliente") {
        navigate("/");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      MySwal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: "Correo o contraseña incorrectos.",
        confirmButtonColor: "#fda4af", // rojo pastel
        background: "#fff1f2",
      });
    }
  };

return (
    <div className="relative h-screen overflow-hidden flex items-center justify-center bg-white">
      {/* Fondo Waves */}
      <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
        <WavesBackground />
      </div>

      {/* Formulario de login */}
      <div className="z-10 w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-pink-100">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={loginData.correo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
          <input
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            value={loginData.contrasena}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
          <ReCAPTCHA
            sitekey="6LfVFi4rAAAAAB6uL2mfebBzOhH5ua9lburpWMBn"
            onChange={handleRecaptchaChange}
          />
          <div className="flex justify-between">
            <NavLink className="text-sm text-pink-600 hover:underline" to="/Register">
              Registrarse
            </NavLink>
            <NavLink className="text-sm text-purple-600 hover:underline" to="/recuperarContrasena">
              Recuperar contraseña
            </NavLink>
          </div>
          <motion.button
            type="submit"
            className="inline-flex items-center justify-center
                       bg-gradient-to-r from-purple-400 to-pink-500
                       hover:from-purple-500 hover:to-pink-600
                       text-white font-semibold text-base sm:text-lg px-6 py-3 rounded-full
                       shadow-lg hover:shadow-xl
                       transform hover:scale-105 transition-all duration-300 ease-out
                       focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-75"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg className="w-4 h-4 mr-2 -ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            Iniciar Sesión
          </motion.button>
        </form>
      </div>
    </div>
  );
};