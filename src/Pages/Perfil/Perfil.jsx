import React, { useState, useEffect } from "react";
import CambiarContraseñaForm from "../../Components/CambiarContraseñaForm/CambiarContraseñaForm";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../../api/axion";
import { useNavigate } from "react-router-dom";
import { WavesBackground } from "../../Components/Particulas2/Particulas2"; // Asegúrate de que esta es la ruta correcta para WavesBackground
import { Footer } from "../../Layouts/Footer/Footer";
import { WavesBackground2 } from "../../Components/Particulas2.0/Particulas2.0";
import { HistorialCompras } from "../../Components/HistorialCompras/HistorialCompras";
import EditarDatosUsuario from "../../Components/EditarDatosUsuario/EditarDatosUsuario"; // Asegúrate de que esta es la ruta correcta

const Perfil = () => {
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [historialAbierto, setHistorialAbierto] = useState(false);
  const [editarDatosAbierto, setEditarDatosAbierto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAutenticacion = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setCargando(false);
        return;
      }

      try {
        const response = await axiosClient.get("/profile");
        setUsuario(response.data);
      } catch (error) {
        console.error("Token inválido o expirado:", error);
        localStorage.removeItem("token");
      } finally {
        setCargando(false);
      }
    };

    verificarAutenticacion();
  }, []);

  const redirigirLogin = () => navigate("/Login");

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    navigate("/Login");
  };

  return (
    // Main wrapper for the entire Perfil page
    // Using pastel pink/purple background colors
    <div className="relative min-h-screen flex flex-col">
      {/* WavesBackground fixed to the bottom */}
      <div className="pt-30">
        <WavesBackground2 /> 
      </div>
      {/* Using WavesBackground2 as per your latest code */}

      {/* Main content area, flex-grow to take available space, relative z-index to appear above waves */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        {cargando && (
          <div className="flex items-center justify-center min-h-screen-content">
            <motion.div
              className="text-center text-lg font-medium text-slate-500 flex items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <svg
                className="animate-spin h-5 w-5 mr-3 text-pink-400" // Pink color
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Verificando sesión...
            </motion.div>
          </div>
        )}

        {!cargando && !usuario && (
          <div className="flex items-center justify-center min-h-screen-content py-16 px-4">
            <motion.div
              className="relative z-10 w-full max-w-xl mx-auto p-12 sm:p-16
                         bg-white bg-opacity-75 backdrop-blur-xl shadow-4xl rounded-3xl
                         border border-pink-200 text-center
                         transform transition-all duration-500 ease-out"
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-5xl font-extrabold text-pink-600 mb-6 leading-tight drop-shadow-lg"> {/* Pink color */}
                <span className="block mb-2">¡Ups!</span>
                <span className="block">Acceso Denegado</span>
              </h2>
              <p className="text-slate-700 text-xl sm:text-2xl mb-10 leading-relaxed font-light">
                Parece que no has iniciado sesión. Para acceder a tu perfil y todas las
                funciones, por favor, inicia sesión.
              </p>
              <motion.button
                onClick={redirigirLogin}
                className="inline-flex items-center justify-center
                           bg-gradient-to-r from-purple-400 to-pink-500 {/* Pink gradient */}
                           hover:from-purple-500 hover:to-pink-600
                           text-white font-bold text-xl sm:text-2xl px-10 py-5 rounded-full
                           shadow-xl hover:shadow-2xl
                           transform hover:scale-105 transition-all duration-300 ease-out
                           focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-75" // Purple focus ring
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.98 }}
              >
                <svg
                  className="w-6 h-6 mr-3 -ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Iniciar Sesión
              </motion.button>
            </motion.div>
          </div>
        )}

        {!cargando && usuario && (
          <div className="flex flex-col items-center justify-center py-12 px-4 w-full">
            <motion.div
              className="relative z-10 w-full max-w-4xl bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-12 border border-pink-100 flex flex-col md:flex-row gap-10 items-center my-8" // Pink border
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* User Information Section */}
              <motion.div
                className="flex-1 text-center md:text-left"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              >
                <motion.h1
                  className="text-5xl font-extrabold text-pink-600 mb-4 drop-shadow-md" // Pink color
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  ¡Hola, {usuario.nombre} {usuario.apellido}!
                </motion.h1>
                <p className="text-xl text-slate-700 mb-6 leading-relaxed">
                  Bienvenido a tu espacio personal. Aquí puedes gestionar tu
                  información y preferencias.
                </p>

                <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-2xl shadow-inner border border-purple-100"> {/* Pink gradient & border */}
                  <p className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
                    <span className="mr-2 text-pink-400">✉️</span> {/* Pink icon */}
                    <strong className="text-slate-800">Correo:</strong> {usuario.correo}
                  </p>
                  <p className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
                    <span className="mr-2 text-purple-400">📞</span> {/* Purple icon */}
                    <strong className="text-slate-800">Teléfono:</strong> {usuario.telefono}
                  </p>
                  <p className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                    <span className="mr-2 text-rose-400">🏠</span> {/* Rose icon */}
                    <strong className="text-slate-800">Dirección:</strong> {usuario.direccion}
                  </p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                  <motion.button
                    onClick={cerrarSesion}
                    className="bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white px-7 py-3 rounded-full shadow-lg text-lg font-medium transform hover:scale-105 transition-all duration-300 ease-out" // Kept red for logout
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cerrar Sesión
                  </motion.button>
                  <motion.button
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white px-7 py-3 rounded-full shadow-lg text-lg font-medium transform hover:scale-105 transition-all duration-300 ease-out" // Pink gradient
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {mostrarFormulario ? "Ocultar Formulario" : "Cambiar Contraseña"}
                  </motion.button>
                  <motion.button
                    onClick={() => setEditarDatosAbierto(true)}
                    className="bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white px-7 py-3 rounded-full shadow-lg text-lg font-medium transform hover:scale-105 transition-all duration-300 ease-out"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Editar datos
                  </motion.button>
                </div>
              </motion.div>

              {/* Change Password Form Section */}
              <AnimatePresence mode="wait">
                {mostrarFormulario && (
                  <motion.div
                    className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center items-center"
                    initial={{ opacity: 0, x: 50, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, x: 50, height: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl border border-pink-100 w-full max-w-md"> {/* Pink border */}
                      <h3 className="text-3xl font-bold text-center text-purple-600 mb-6"> {/* Purple color */}
                        Actualizar Contraseña
                      </h3>
                      <CambiarContraseñaForm />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Botón vistoso para abrir historial */}
            <div className="flex justify-center my-8 gap-4 flex-wrap">
              <button
                onClick={() => setHistorialAbierto(true)}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-pink-200 text-pink-800 font-bold text-lg shadow-lg hover:bg-pink-300 transition-all border-2 border-pink-300"
              >
                <svg className="w-7 h-7 text-pink-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ver historial de compras
              </button>
              <button
                onClick={() => navigate("/historial-personalizaciones")}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-pink-200 text-pink-800 font-bold text-lg shadow-lg hover:bg-pink-300 transition-all border-2 border-pink-300"
              >
                <svg className="w-7 h-7 text-pink-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Historial de Personalizaciones
              </button>
            </div>

            {/* Panel animado del historial */}
            <AnimatePresence>
              {historialAbierto && (
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 60 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
                >
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/90 rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative"
                  >
                    <button
                      onClick={() => setHistorialAbierto(false)}
                      className="absolute top-4 right-4 text-pink-500 hover:text-pink-700 text-2xl font-bold"
                      aria-label="Cerrar historial"
                    >
                      ×
                    </button>
                    <HistorialCompras userId={usuario?.id_usuario} onClose={() => setHistorialAbierto(false)}/>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Componente para editar datos de usuario */}
            <AnimatePresence>
              {editarDatosAbierto && (
                <EditarDatosUsuario
                  usuario={usuario}
                  onClose={() => setEditarDatosAbierto(false)}
                  onUpdate={(usuarioActualizado) => {
                    setUsuario(usuarioActualizado);
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer is outside the main content area, likely handled by a parent Layout */}
      <Footer />
    </div>
  );
};

export default Perfil;