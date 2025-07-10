import React from "react";
import { motion } from "framer-motion";
import nuestraHistoria from "../../assets/images/pexels-atahandemir-10323260.jpg";

export const Nosotros = () => {
  const abrirResenasGoogle = () => {
    const url = "https://www.google.com/maps/place/?q=place_id:ChIJKdhyZq71OI4RT_jZoEVZWcY";
    window.open(url, "_blank");
  };

  return (
    <div className="w-full bg-white text-gray-800 font-sans">
      {/* HERO */}
      <section className="relative h-[60vh] sm:h-[70vh] w-full overflow-hidden flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1549294413-26f195200c16"
          alt="Filosofía QuindiShoes"
          className="absolute w-full h-full object-cover object-center brightness-[0.5]"
        />
        <div className="relative z-10 text-center text-white px-4 sm:px-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Nuestra Filosofía</h1>
          <p className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed text-balance">
            Cada paso cuenta. Cada historia importa.
          </p>
        </div>
      </section>

{/* HISTORIA */}
<motion.section
  className="w-full px-4 sm:px-6 py-24 bg-white"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
>
  <div className="max-w-[1040px] mx-auto flex flex-col space-y-20">
    {/* Encabezado historia */}
    <div className="text-center space-y-6 max-w-[1040px] mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-[#c72c5e]">Nuestra Historia</h2>
      <p className="text-gray-700 text-base sm:text-lg leading-relaxed text-balance text-center">
        QuindiShoes nació en 2019 como un pequeño emprendimiento que operaba exclusivamente desde Instagram.
        En ese entonces no contábamos con local físico, pero sí con grandes sueños. Con el tiempo y gracias a
        la fidelidad de nuestros clientes, las ventas comenzaron a crecer. Esto nos permitió abrir nuestra
        primera tienda en la Cra. 16 #21-13, frente al Banco de la República, en Armenia (Quindío).
        Actualmente, además de nuestro punto físico, seguimos atendiendo con cercanía a través de WhatsApp,
        Instagram, Facebook y TikTok, y también ofrecemos venta al por mayor como proveedores.
        Seguimos caminando contigo.
      </p>
    </div>

    {/* Imagen + propósito */}
    <div className="flex flex-col md:flex-row gap-12 items-center max-w-[1040px] mx-auto">
      <div className="rounded-3xl overflow-hidden shadow-xl w-full md:w-1/2 h-auto md:h-[380px]">
        <img
          src={nuestraHistoria}
          alt="Nuestra historia"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-4 w-full md:w-1/2">
        <h3 className="text-2xl font-bold text-[#b65775]">Una tienda con propósito</h3>
        <p className="text-gray-700 text-base leading-relaxed text-balance">
          Elegimos cada par como si fuera para nosotros mismos. Más que vender zapatos, conectamos personas
          con estilo, seguridad y bienestar a través de una experiencia de compra cercana y moderna.
        </p>
        <p className="text-gray-700 text-base leading-relaxed text-balance">
          Nos aliamos con marcas comprometidas con el confort, la innovación y la responsabilidad.
          Porque creemos que cada paso puede ser más consciente.
        </p>
      </div>
    </div>
  </div>
</motion.section>




      {/* VALORES */}
      <motion.section
        className="bg-[#fef6f9] py-16 sm:py-20 px-4 sm:px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#c72c5e]">Nuestros pilares</h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-balance">
            No somos una marca de zapatos. Somos una tienda que selecciona cuidadosamente lo que usas, porque sabemos que cada paso refleja tu historia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {[
            {
              titulo: "Selección con criterio",
              texto:
                "Investigamos, probamos y elegimos marcas que cumplen con estándares de comodidad, estilo y durabilidad. Solo ofrecemos lo que realmente usaríamos.",
            },
            {
              titulo: "Belleza con conciencia",
              texto:
                "Priorizamos marcas que trabajan con materiales nobles, procesos responsables y una visión a largo plazo.",
            },
            {
              titulo: "Experiencia que acompaña",
              texto:
                "No se trata solo del producto: se trata de cómo te sientes cuando lo recibes, cuando lo usas, y cuando sabes que elegiste bien.",
            },
          ].map((val, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 sm:p-8 bg-white rounded-3xl shadow-md text-left border border-pink-100 h-full flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-[#b65775] mb-2">{val.titulo}</h3>
                <p className="text-gray-600 text-base leading-relaxed text-balance">{val.texto}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* MAPA */}
      <motion.section
        className="bg-[#fef6f9] py-16 sm:py-20 px-4 sm:px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#c72c5e]">¿Dónde encontrarnos?</h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-balance">
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

      {/* BOTÓN RESEÑAS */}
      <motion.section
        className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-[#c72c5e] mb-6 sm:mb-8">
          Lo que dicen nuestros clientes
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={abrirResenasGoogle}
          className="bg-[#c72c5e] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#a3224b] transition duration-300 text-sm sm:text-base"
        >
          Ver reseñas en Google
        </motion.button>
      </motion.section>

      {/* FRASE FINAL */}
      <motion.div
        className="py-28 sm:py-36 text-center px-4 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#c72c5e] max-w-2xl mx-auto leading-snug text-balance">
          Porque no se trata solo de vender zapatos. Se trata de ayudarte a caminar con confianza.
        </h2>
      </motion.div>
    </div>
  );
};
