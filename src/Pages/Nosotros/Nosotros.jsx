
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft, FaHeart } from "react-icons/fa";
import nuestraHistoria from "../../assets/images/pexels-atahandemir-10323260.jpg";
import nuestraFilosofia from "../../assets/images/style.jpeg";
import nuestraFelicidad from "../../assets/images/calzadofeliz.jpeg";

export const Nosotros = () => {
  const abrirResenasGoogle = () => {
    const url =
      "https://www.google.com/maps/place/?q=place_id:ChIJKdhyZq71OI4RT_jZoEVZWcY";
    window.open(url, "_blank");
  };

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="w-full font-sans text-gray-800 bg-white">
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">

        {/* NUESTRA FILOSOFÍA */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 min-h-screen bg-[#fff1f5] snap-start items-center">
          <motion.div
            className="w-full h-[40vh] md:h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <img
              src={nuestraFilosofia}
              alt="Nuestra filosofía"
              className="object-cover w-full h-full"
            />
          </motion.div>

          <div className="flex flex-col justify-center items-start px-6 sm:px-10 lg:px-20 py-10 text-left">
            <motion.div
              className="max-w-xl"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#d95b83] mb-6 leading-tight">
                Nuestra Filosofía
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                En QuindiShoes creemos que cada paso tiene un propósito. Nuestra filosofía está centrada en
                seleccionar calzado que inspire confianza, estilo y bienestar. No vendemos simplemente zapatos,
                ofrecemos una experiencia que acompaña tu camino con calidad, amor y autenticidad.
              </p>
            </motion.div>
          </div>
        </section>

        {/* NUESTRA FELICIDAD */}
        <motion.section
          className="w-full bg-[#fff9fb] px-6 sm:px-10 lg:px-20 py-24 snap-start min-h-screen flex items-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#d95b83] leading-tight">
                Nuestra felicidad
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Nada nos alegra más que ver a nuestros clientes satisfechos, felices con su compra y listos
                para seguir caminando. Cada sonrisa al recibir su pedido es nuestro motor. QuindiShoes
                no solo vende calzado, también comparte felicidad.
              </p>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-[#f3cbd8] w-full">
                <img
                  src={nuestraFelicidad}
                  alt="Nuestra felicidad"
                  className="w-full h-auto md:h-[50vh] object-cover"
                />
                <div className="absolute bottom-0 left-0 bg-[#d95b83]/90 text-white px-6 py-2 rounded-tr-3xl text-sm font-semibold">
                  Siente el estilo
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* HISTORIA */}
        <motion.section
          className="w-full bg-gradient-to-br from-[#fff4f7] via-white to-[#ffeef3] px-6 sm:px-10 lg:px-20 py-24 snap-start min-h-screen flex items-center relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-noise.png')]" />
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
            <div className="order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-[#f3cbd8] w-full">
                <img
                  src={nuestraHistoria}
                  alt="Nuestra historia"
                  className="w-full h-auto md:h-[50vh] object-cover"
                />
                <div className="absolute bottom-0 left-0 bg-[#d95b83]/90 text-white px-6 py-2 rounded-tr-3xl text-sm font-semibold">
                  Camino con alegría
                </div>
              </div>
            </div>
            <div className="order-2 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#d95b83] leading-tight">
                Nuestro origen
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
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

        {/* PILARES */}
        <motion.section
          className="bg-[#fff7fa] py-24 px-6 sm:px-10 lg:px-20 snap-start min-h-screen flex items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="w-full max-w-7xl mx-auto">
            <div className="text-center mb-14 space-y-4 px-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#d95b83]">Nuestros pilares</h2>
              <p className="text-base text-gray-700">
                No somos una marca de zapatos. Somos una tienda que selecciona cuidadosamente lo que usas,
                porque sabemos que cada paso refleja tu historia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                  className="p-6 bg-white rounded-3xl shadow-lg border border-pink-100 min-h-[320px] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <FaStar className="text-[#d95b83] text-2xl sm:text-3xl animate-bounce" />
                    <h3 className="text-lg sm:text-xl font-semibold text-[#d95b83]">{val.titulo}</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{val.texto}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* MAPA */}
        <motion.section
          className="bg-[#fff1f5] py-24 px-6 sm:px-10 lg:px-20 snap-start min-h-screen flex items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="w-full max-w-5xl mx-auto">
            <div className="text-center mb-10 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#d95b83]">¿Dónde encontrarnos?</h2>
              <p className="text-base text-gray-600">
                Ven a conocernos frente al Banco de la República: Cra. 16 #21-13, Armenia, Quindío.
              </p>
            </div>
            <div className="w-full rounded-3xl overflow-hidden shadow-lg border-4 border-[#f3cbd8] aspect-video hover:scale-105 transition-transform duration-500">
              <iframe
                width="100%"
                height="100%"
                className="w-full h-full"
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAvRLtgYaWD3tQSpKCtjhx-P3AMg_K-vXg&q=place_id:ChIJKdhyZq71OI4RT_jZoEVZWcY`}
              ></iframe>
            </div>
          </div>
        </motion.section>

        {/* FRASE FINAL */}
        <motion.div
          className="bg-[#fae4ec] text-gray-800 py-20 px-6 text-center snap-start min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <FaQuoteLeft className="text-[#d95b83] text-3xl sm:text-4xl mx-auto animate-pulse" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug">
              Porque no se trata solo de vender zapatos. Se trata de ayudarte a caminar con confianza.
            </h2>
            <p className="text-base sm:text-lg text-gray-600">Gracias por ser parte de este recorrido.</p>
            <div className="flex justify-center gap-4 text-[#d95b83] text-xl sm:text-2xl">
              <FaHeart className="animate-bounce" />
              <FaStar className="animate-spin-slow" />
              <FaHeart className="animate-bounce delay-300" />
            </div>
          </div>
        </motion.div>

        {/* RESEÑAS */}
        <motion.section
          className="bg-gradient-to-r from-[#f4b9c2] to-[#fddde9] text-gray-800 text-center py-24 px-6 snap-start min-h-screen flex items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="flex flex-col items-center space-y-6 w-full">
            <h2 className="text-3xl sm:text-4xl font-bold">Lo que dicen nuestros clientes</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={abrirResenasGoogle}
              className="flex items-center gap-3 bg-white text-[#d95b83] px-6 py-3 rounded-full shadow-md text-sm sm:text-base font-semibold"
            >
              <FaStar className="text-[#d95b83] animate-ping" /> Ver reseñas en Google
            </motion.button>
          </div>
        </motion.section>

      </div>
    </div>
  );
};
