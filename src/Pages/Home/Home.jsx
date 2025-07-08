import React, { useState, useRef } from 'react';
import { BuscadorProductos } from '../../Components/BuscadorProducto.ts/BuscadorProducto';
import ChatWidget from '../../Components/ChatBot/ChatBot';
import { BotonReseñas } from '../../Components/BotonReseñas/BotonReseñas';
import { ModalReseñas } from '../../Components/ModalReseñas/ModalReseñas';
import { MostrarProducto } from '../../Components/CartaProducto/CartaProducto';
import { motion } from 'framer-motion';
import heroImage from '../../assets/images/women2.webp';
import marketingImage from '../../assets/images/stock-promo.jpg';
import movementImage from '../../assets/images/exclusive-pair.jpg';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { ParaTi } from '../../Components/ParaTi/ParaTi';
export const Home = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
 const navigate = useNavigate();

// dentro del componente
const productosRef = useRef(null);

 const irANosotros = () => {
    navigate("/nosotros");
  };
  // Obtén el id del usuario autenticado
 const token = localStorage.getItem("token");
let usuario_id;

if (token) {
  try {
    const decoded = jwtDecode(token);
    usuario_id = decoded.data?.id;
  } catch (error) {
    console.error("❌ Token inválido:", error);
  }
}
console.log("🧪 TOKEN:", token);
console.log("🧪 USUARIO_ID:", usuario_id);
  return (
    <div className="w-full min-h-screen bg-white font-sans">

      {/* HERO SECTION */}
      <section className="relative w-full h-[100vh] overflow-hidden flex items-center justify-center">
        <motion.img
          src={heroImage}
          alt="Portada"
          className="absolute w-full h-full object-cover object-center brightness-[0.5]"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
        />
        <motion.div
          className="relative z-10 text-center text-white px-6 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
        >
          <h1 className="text-6xl md:text-8xl font-serif italic drop-shadow-xl">Enriquece tu día</h1>
          <p className="text-lg md:text-2xl font-light">Estilo, elegancia y comodidad para todos los días.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            
            <motion.button
              className="px-6 py-3 border border-white rounded-full hover:bg-white hover:text-black transition font-medium"
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                const top = productosRef.current?.offsetTop || 0;
                window.scrollTo({ top, behavior: 'smooth' });
              }}>
              Ver más
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* MARKETING */}
      <motion.section
        className="grid md:grid-cols-2 items-center gap-12 px-8 md:px-16 py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        variants={{
          hidden: { opacity: 0, y: 60 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <motion.img
          src={marketingImage}
          alt="Material Premium"
          className="rounded-3xl shadow-2xl object-cover w-full h-[500px]"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.4 }}
        />
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-800">Eleva cada paso</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Camina con seguridad y propósito. Con materiales sostenibles, diseño atemporal y un enfoque absoluto en la comodidad.
          </p>
          <ul className="text-gray-700 list-disc list-inside space-y-2">
            <li>📦 Envíos rápidos y seguros</li>
            <li>💳 Pago contra entrega disponible</li>
            <li>📞 Soporte 24/7 personalizado</li>
          </ul>
        </div>
      </motion.section>

      {/* NUEVA SECCIÓN: MOVIMIENTO */}
      <motion.section
        className="flex flex-col md:flex-row items-center justify-between gap-10 px-6 md:px-20 py-24 bg-pink-50"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
            ref={productosRef}

      >
        <motion.div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h3 className="text-4xl md:text-5xl font-extrabold text-pink-700 leading-tight">Únete al movimiento</h3>
          <p className="text-gray-700 text-lg">
            No solo es calzado, es una forma de expresarte. Cada par que eliges transforma tu paso en una declaración de principios.
          </p>
          <motion.button
            className="mt-4 px-6 py-3 bg-pink-600 text-white rounded-full shadow-md hover:bg-pink-700 transition font-semibold"
            whileHover={{ scale: 1.05 }}
            onClick={irANosotros}
          >
            Conoce nuestra filosofía
          </motion.button>
        </motion.div>
        <motion.img
          src={movementImage}
          alt="Movimiento"
          className="rounded-3xl w-full md:w-[500px] shadow-xl object-cover"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5 }}
        />
      </motion.section>

      {/* PARA TI */}
      <section    className="py-20 px-4 md:px-16 bg-white">
        <motion.h2
          className="text-4xl font-bold text-center text-gray-800 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          
        </motion.h2>
        <ParaTi userId={usuario_id} />

      </section>

      {/* CHAT Y RESEÑAS */}
      <ChatWidget />
      <div className="fixed bottom-6 right-6 z-50">
        <BotonReseñas onClick={() => setModalAbierto(true)} />
      </div>
      {/* MODAL DE RESEÑAS */}
      <ModalReseñas abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        usuario_id={usuario_id} />
    </div>
  );
};
