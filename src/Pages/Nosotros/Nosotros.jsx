import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import nuestraHistoria from "../../assets/images/pexels-atahandemir-10323260.jpg";

export const Nosotros = () => {
  const abrirResenasGoogle = () => {
    const url = "https://www.google.com/maps/place/?q=place_id:ChIJKdhyZq71OI4RT_jZoEVZWcY";
    window.open(url, "_blank");
  };

  return (
    <div className="w-full font-sans text-gray-800 bg-white">
      {/* HERO */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[50vh] md:min-h-[60vh]">
        <div className="bg-[#f9e6eb] flex flex-col justify-center items-center py-10 px-4 text-center md:text-left">
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-[#d95b83] to-[#f48ca5] bg-clip-text text-transparent drop-shadow-md leading-tight">
              Nuestra <br /> Filosofía
            </h1>
          </motion.div>
        </div>

        <motion.div
          className="w-full h-full max-h-[60vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img
            src="https://images.unsplash.com/photo-1549294413-26f195200c16"
            alt="Filosofía QuindiShoes"
            className="object-cover w-full h-full"
          />
        </motion.div>
      </section>

      {/* HISTORIA */}
      <motion.section
        className="w-full bg-gradient-to-br from-[#fff4f7] via-white to-[#ffeef3] px-6 py-32 relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-noise.png')]" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 items-center">
          
          {/* Imagen a la izquierda SIEMPRE */}
          <div className="order-1 md:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-[#f3cbd8] w-full h-full">
              <img
                src={nuestraHistoria}
                alt="Nuestra historia"
                className="w-full h-auto md:h-[50vh] object-cover"
              />
              <div className="absolute bottom-0 left-0 bg-[#d95b83]/90 text-white px-6 py-3 rounded-tr-3xl text-sm font-semibold tracking-wide">
                Siente el estilo
              </div>
            </div>
          </div>

          {/* Texto a la derecha */}
          <div className="order-2 md:order-2 space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#d95b83] leading-tight">
              Nuestro origen
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              QuindiShoes nació en 2019 como un pequeño emprendimiento que operaba exclusivamente desde Instagram.
              En ese entonces no contábamos con local físico, pero sí con grandes sueños. Con el tiempo y gracias a
              la fidelidad de nuestros clientes, las ventas comenzaron a crecer. Esto nos permitió abrir nuestra
              primera tienda en la Cra. 16 #21-13, frente al Banco de la República, en Armenia (Quindío).
              Actualmente, además de nuestro punto físico, seguimos atendiendo con cercanía a través de WhatsApp,
              Instagram, Facebook y TikTok, y también ofrecemos venta al por mayor como proveedores.
              Seguimos caminando contigo.
            </p>
          </div>
        </div>
      </motion.section>


      {/* VALORES */}
      <motion.section
        className="bg-[#fff7fa] py-24 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <h2 className="text-4xl font-bold text-[#d95b83]">Nuestros pilares</h2>
          <p className="text-gray-700 text-base leading-relaxed">
            No somos una marca de zapatos. Somos una tienda que selecciona cuidadosamente lo que usas,
            porque sabemos que cada paso refleja tu historia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[{
            titulo: "Selección con criterio",
            texto: "Investigamos, probamos y elegimos marcas que cumplen con estándares de comodidad, estilo y durabilidad. Solo ofrecemos lo que realmente usaríamos.",
          }, {
            titulo: "Belleza con conciencia",
            texto: "Priorizamos marcas que trabajan con materiales nobles, procesos responsables y una visión a largo plazo.",
          }, {
            titulo: "Experiencia que acompaña",
            texto: "No se trata solo del producto: se trata de cómo te sientes cuando lo recibes, cuando lo usas, y cuando sabes que elegiste bien.",
          }].map((val, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="p-8 bg-white rounded-3xl shadow-lg border border-pink-100 min-h-[320px] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <FaStar className="text-[#d95b83] text-3xl" />
                <h3 className="text-xl font-semibold text-[#d95b83]">{val.titulo}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{val.texto}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* MAPA */}
      <motion.section
        className="bg-[#fff1f5] py-24 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#d95b83]">¿Dónde encontrarnos?</h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Ven a conocernos frente al Banco de la República: Cra. 16 #21-13, Armenia, Quindío.
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-lg border border-pink-100 aspect-[16/9]">
          <iframe
            width="100%"
            height="100%"
            className="w-full h-full"
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAvRLtgYaWD3tQSpKCtjhx-P3AMg_K-vXg&q=place_id:ChIJKdhyZq71OI4RT_jZoEVZWcY`}
          ></iframe>
        </div>
      </motion.section>

      {/* RESEÑAS */}
      <motion.section
        className="bg-gradient-to-r from-[#f4b9c2] to-[#fddde9] text-gray-800 text-center py-24 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">Lo que dicen nuestros clientes</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={abrirResenasGoogle}
            className="flex items-center gap-3 bg-white text-[#d95b83] px-6 py-3 rounded-full shadow-md text-sm sm:text-base font-semibold"
          >
            <FaStar className="text-[#d95b83]" /> Ver reseñas en Google
          </motion.button>
        </div>
      </motion.section>

      {/* FRASE FINAL */}
      <motion.div
        className="bg-[#fae4ec] text-gray-800 py-20 px-6 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <FaQuoteLeft className="text-[#d95b83] text-4xl mx-auto" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
            Porque no se trata solo de vender zapatos. Se trata de ayudarte a caminar con confianza.
          </h2>
        </div>
      </motion.div>
    </div>
  );
};
