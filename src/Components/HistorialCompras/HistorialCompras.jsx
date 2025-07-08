import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axion";
import { motion, AnimatePresence } from "framer-motion";

export const HistorialCompras = ({ userId, onClose }) => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axiosClient.get(`/usuario/${userId}/historial-compras`)
      .then(res => setCompras(res.data))
      .catch(() => setCompras([]))
      .finally(() => setLoading(false));
  }, [userId]);

  // Ajusta este valor si tu header es más alto
  const HEADER_HEIGHT = 80;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex justify-center bg-black/30"
      style={{
        paddingTop: HEADER_HEIGHT + 32, // 32px extra de separación
        paddingBottom: 32,
        alignItems: "flex-start", // Para que el modal empiece debajo del header
        overflowY: "auto"
      }}
    >
      <motion.div
        initial={{ scale: 0.97, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.97, y: 40 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white/90 rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4 flex flex-col items-center"
        style={{
          minHeight: "400px",
          maxHeight: `calc(100vh - ${HEADER_HEIGHT + 64}px)`, // 64px = paddingTop + paddingBottom
          overflowY: "auto"
        }}
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-pink-500 hover:text-pink-700 text-2xl font-bold z-10"
          aria-label="Cerrar historial"
        >
          ×
        </button>
        <h2 className="text-3xl font-extrabold mb-6 text-center text-pink-600 drop-shadow">
          Historial de compras
        </h2>
        {loading ? (
          <div className="text-center text-pink-400 py-10 animate-pulse">Cargando historial...</div>
        ) : compras.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No tienes compras registradas.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <AnimatePresence>
              {compras.map((compra, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.5, delay: idx * 0.08, type: "spring", bounce: 0.2 }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 8px 32px 0 rgba(236, 72, 153, 0.15), 0 1.5px 8px 0 rgba(34,197,94,0.10)"
                  }}
                  className="bg-gradient-to-br from-pink-50 via-green-50 to-pink-100 border-2 border-pink-200 rounded-2xl shadow-xl p-6 flex flex-col items-center transition-all duration-300 hover:border-green-300"
                >
                  <div className="w-40 h-32 mb-4 flex items-center justify-center bg-white rounded-xl shadow-inner border border-green-100 overflow-hidden">
                    <img
                      src={compra.url_imagen || "/assets/images/sin-imagen.png"}
                      alt={compra.nombre_producto}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-bold text-lg text-green-700 mb-1 text-center">{compra.nombre_producto}</h3>
                  <p className="text-pink-600 mb-1 text-center">
                    {compra.tipo_producto} <span className="mx-1">•</span> {compra.color} <span className="mx-1">•</span> Talla {compra.talla}
                  </p>
                  <span className="text-green-700 font-bold text-lg mb-2 bg-green-100 px-3 py-1 rounded-xl shadow-sm">
                    ${Number(compra.precio_producto).toLocaleString()} x {compra.cantidad}
                  </span>
                  <span className="text-xs text-pink-500 mb-1">Fecha: {new Date(compra.fecha_compra).toLocaleDateString()}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.section>
  );
};