// src/pages/HistorialPersonalizaciones.jsx
import { useEffect, useState } from "react";
import axiosClient from "../../api/axion";
import VisorModeloGLB from "../../Components/VisorModeloGLB/VisorModeloGLB";
import { motion, AnimatePresence } from "framer-motion";

export const HistorialPersonalizaciones = () => {
  const [modelos, setModelos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const BASE_URL = "https://quindishoes-backend-def.onrender.com";

  useEffect(() => {
    const id_usuario = localStorage.getItem("id");
    if (!id_usuario) {
      setCargando(false);
      return;
    }

    // Simula un tiempo mínimo de carga para que la animación se vea bien
    setCargando(true);
    const cargarDatos = async () => {
      const inicio = Date.now();
      try {
        const res = await axiosClient.get(`/personalizacion/historialGLB/${id_usuario}`);
        setModelos(res.data || []);
      } catch (err) {
        console.error("Error al obtener modelos:", err);
      } finally {
        const duracion = Date.now() - inicio;
        const tiempoMinimo = 1200; // milisegundos
        setTimeout(() => setCargando(false), Math.max(0, tiempoMinimo - duracion));
      }
    };
    cargarDatos();
  }, []);

  // Función para formatear fecha tipo ISO a DD/MM/YYYY
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    if (isNaN(fecha)) return "";
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <div className="relative min-h-screen bg-[#232b36] py-10 px-2 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-10 text-center tracking-tight">
          Historial de Personalizaciones
        </h1>
        <AnimatePresence>
          {cargando ? (
            <motion.div
              key="cargando"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <svg className="animate-spin h-12 w-12 text-emerald-400 mb-4" viewBox="0 0 50 50">
                <circle
                  className="opacity-25"
                  cx="25"
                  cy="25"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M25 5a20 20 0 0120 20h-6a14 14 0 10-14 14v6A20 20 0 0125 5z"
                />
              </svg>
              <p className="text-lg text-emerald-300 font-semibold animate-pulse">
                Cargando tus diseños personalizados...
              </p>
            </motion.div>
          ) : modelos.length === 0 ? (
            <motion.div
              key="vacio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-slate-400 py-10 text-lg"
            >
              No tienes personalizaciones guardadas.
            </motion.div>
          ) : (
            <motion.div
              key="contenido"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-22"
            >
              {modelos.map((modelo, idx) => (
                <motion.div
                  key={modelo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  whileHover={{
                    y: -18,
                    scale: 1.045,
                    boxShadow: "0 8px 40px 0 #f9a8d4, 0 0px 32px 0 #6ee7b7, 0 8px 32px 0 rgba(31,38,135,0.18)",
                    borderColor: "#f472b6",
                  }}
                  className="
                    bg-white/80 rounded-3xl shadow-2xl border border-white/60
                    flex flex-col justify-between
                    p-7 aspect-[4/5] min-h-[420px] max-h-[520px]
                    transition-all duration-300 cursor-pointer
                    group overflow-hidden relative
                  "
                >
                  {/* Aura animada detrás del modelo */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-28 rounded-full bg-gradient-to-br from-pink-200 via-emerald-100 to-white blur-2xl opacity-40 pointer-events-none z-0 animate-pulse" />
                  {/* Fondo glassmorphism para el modelo 3D */}
                  <div className="w-full h-[210px] flex items-center justify-center mb-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-inner relative z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 via-emerald-100/20 to-white/10 pointer-events-none" />
                    <VisorModeloGLB
                      url={`${BASE_URL}/personalizacion/modelo/${modelo.id}`}
                      initialRotation={{ x: 0.35, y: 0.7, z: 0 }}
                      animateOnHover
                    />
                  </div>
                  {/* Nombre grande */}
                  <p className="font-extrabold text-2xl text-[#232b36] mb-2 truncate text-center w-full z-10 tracking-wide">
                    {modelo.nombre || "Personalización"}
                  </p>
                  {/* Detalles minimalistas */}
                  <div className="flex justify-between items-center text-xs text-slate-400 mt-2 w-full z-10">
                    <span>
                      {modelo.fecha ? formatearFecha(modelo.fecha) : ""}
                    </span>
                  </div>
                  {/* Glow al hacer hover */}
                  <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300"
                    style={{
                      boxShadow: "0 0 48px 12px #f9a8d4, 0 0 32px 8px #6ee7b7",
                      zIndex: 1,
                    }}
                  />
                  <style>
                    {`
                      @keyframes pulseSlow { 0%,100%{opacity:.3;} 50%{opacity:.5;} }
                      .animate-pulse { animation: pulseSlow 8s ease-in-out infinite; }
                    `}
                  </style>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
