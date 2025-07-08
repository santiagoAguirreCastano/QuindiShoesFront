import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axion";
import { CartaProducto } from "../CartaProducto/CartaProducto";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaRegSadTear } from "react-icons/fa";

export const ParaTi = ({ userId }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    axiosClient
      .get(`/api/recomendados/${userId}`)
      .then((res) => setProductos(res.data))
      .catch(() => setProductos([]))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % productos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [productos]);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + productos.length) % productos.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % productos.length);
  };

  const MensajeInfo = ({ mensaje }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-16 px-6 rounded-xl bg-gradient-to-br from-pink-50 to-green-50 shadow-md"
    >
      <FaRegSadTear className="text-6xl text-pink-300 mb-4 animate-bounce" />
      <p className="text-lg text-gray-500 text-center font-medium max-w-md">{mensaje}</p>
    </motion.div>
  );

  const getVisibleItems = () => {
    const count = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 4 : 5;
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(productos[(index + i) % productos.length]);
    }
    return items;
  };

  return (
    <div className="my-12 px-4 sm:px-8 relative">
      <h2 className="text-3xl font-bold text-center text-pink-500 mb-10">Recomendados para ti</h2>

      {!userId ? (
        <MensajeInfo mensaje="Inicia sesión para descubrir productos recomendados especialmente para ti. ❤️" />
      ) : loading ? (
        <div className="text-center text-gray-400 py-10">Cargando recomendaciones...</div>
      ) : productos.length === 0 ? (
        <MensajeInfo mensaje="No hay recomendaciones disponibles por ahora. ¡Sigue explorando y pronto aparecerán! 🌟" />
      ) : (
        <div className="relative flex items-center justify-center">
          {/* Flechas */}
          <button
            className="absolute left-0 bg-white p-2 rounded-full shadow hover:bg-pink-100 z-10"
            onClick={handlePrev}
          >
            <FaChevronLeft className="text-pink-500" />
          </button>
          <button
            className="absolute right-0 bg-white p-2 rounded-full shadow hover:bg-pink-100 z-10"
            onClick={handleNext}
          >
            <FaChevronRight className="text-pink-500" />
          </button>

          {/* Carrusel visible */}
          <div className="flex gap-3 overflow-hidden w-full max-w-7xl px-10">
            <AnimatePresence mode="popLayout">
              {getVisibleItems().map((producto) => (
                <motion.div
                  key={producto.id_producto}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className=" rounded-3xl p-3 transition-transform">
                    <CartaProducto producto={producto} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
