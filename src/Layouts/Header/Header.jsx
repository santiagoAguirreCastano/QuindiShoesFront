import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { ContadorCarritoContext } from "../../Contexts/ContadorCarritoContext";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const { contador } = useContext(ContadorCarritoContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const menuVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 }
  };

  return (
    <header className="bg-white shadow-md top-0 z-50 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-800">QuindiShoes</h1>

        {/* Botón hamburguesa (solo móvil) */}
        <button onClick={toggleMenu} className="md:hidden text-2xl text-gray-600 focus:outline-none">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navegación principal en desktop */}
        <nav className="hidden md:flex space-x-10 font-semibold text-gray-700">
          <NavLink to="/" className="hover:text-black">Inicio</NavLink>
          <NavLink to="/juego" className="hover:text-black">VideoJuego</NavLink>
          <NavLink to="/nosotros" className="hover:text-black">Nosotros</NavLink>
          <NavLink to="/Productospages" className="hover:text-black">Productos</NavLink>
        </nav>

        {/* Iconos en desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink to="/favoritos" className="text-xl text-gray-600 hover:text-pink-400">
            <FaHeart />
          </NavLink>
          <NavLink to="/carrito" className="relative text-2xl text-gray-600 hover:text-green-400">
            <FaShoppingCart />
            {contador > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {contador}
              </span>
            )}
          </NavLink>
          <NavLink to="/perfil" className="text-xl text-gray-600 hover:text-blue-400">
            <FaUser />
          </NavLink>
        </div>
      </div>

      {/* Menú desplegable móvil animado */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            transition={{ duration: 0.3 }}
            className="absolute top-[70px] right-4 w-[75vw] max-w-sm bg-white shadow-xl rounded-2xl p-6 space-y-5 text-gray-700 font-medium z-40"
          >
            <NavLink to="/" onClick={closeMenu} className="block hover:text-black">Inicio</NavLink>
            <NavLink to="/nosotros" onClick={closeMenu} className="block hover:text-black">Nosotros</NavLink>
            <NavLink to="/Productospages" onClick={closeMenu} className="block hover:text-black">Productos</NavLink>
            <NavLink to="/favoritos" onClick={closeMenu} className="block hover:text-pink-500">❤️ Favoritos</NavLink>
            <NavLink to="/carrito" onClick={closeMenu} className="block hover:text-green-500">
              🛒 Carrito {contador > 0 && <span className="ml-1 bg-red-500 text-white px-2 rounded-full text-xs font-bold">{contador}</span>}
            </NavLink>
            <NavLink to="/perfil" onClick={closeMenu} className="block hover:text-blue-500">👤 Perfil</NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
