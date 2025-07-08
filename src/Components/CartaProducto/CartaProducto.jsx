import React, { useEffect, useRef, useState } from "react";
import { ContadorCarritoContext } from "../../Contexts/ContadorCarritoContext";
import { useNavigate } from "react-router-dom";
import ColorThief from "colorthief";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axiosClient from "../../api/axion";

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100; h /= 360;

  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hacerPastel(rgb) {
  let [r, g, b] = rgb;
  let [h, s, l] = rgbToHsl(r, g, b);
  l = Math.min(l + 80, 90);
  s = Math.max(s - 20, 90);
  return hslToRgb(h, s, l);
}

export const CartaProducto = ({ producto }) => {
  //const { incrementarContador } = useContext(ContadorCarritoContext);
  const navigate = useNavigate();
 // const usuario_id = localStorage.getItem("id");

  const [bgColor, setBgColor] = useState("#fde8f0");
  const [esFavorito, setEsFavorito] = useState(false);
  const [promedio, setPromedio] = useState(null);
  const imgRef = useRef(null);

  const imagenPrincipal =
    producto.url_imagen ||
    (producto.imagenes?.[0] ?? "https://via.placeholder.com/300x200?text=Sin+Imagen");

  const irADetalle = () => navigate(`/producto/${producto.id_producto}`);

  useEffect(() => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    setEsFavorito(favoritos.some(p => p.id_producto === producto.id_producto));
  }, [producto.id_producto]);

  const toggleFavorito = (e) => {
    e.stopPropagation();
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const yaExiste = favoritos.some(p => p.id_producto === producto.id_producto);

    const nuevosFavoritos = yaExiste
      ? favoritos.filter(p => p.id_producto !== producto.id_producto)
      : [...favoritos, producto];

    localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos));
    setEsFavorito(!yaExiste);
    window.dispatchEvent(new Event("favoritos-updated"));
  };

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const colorThief = new ColorThief();

    const onLoad = () => {
      try {
        const color = colorThief.getColor(img);
        const pastel = hacerPastel(color);
        setBgColor(`rgb(${pastel[0]}, ${pastel[1]}, ${pastel[2]})`);
      } catch {
        setBgColor("#fde8f0");
      }
    };

    img.crossOrigin = "anonymous";
    img.complete ? onLoad() : img.addEventListener("load", onLoad);
    return () => img.removeEventListener("load", onLoad);
  }, [imagenPrincipal]);

  useEffect(() => {
    axiosClient.get(`/resenaProducto/producto/${producto.id_producto}`)
      .then(res => {
        const puntuaciones = (res.data || []).map(r => Number(r.puntuacion)).filter(Boolean);
        setPromedio(puntuaciones.length > 0 ? (puntuaciones.reduce((a, b) => a + b, 0) / puntuaciones.length).toFixed(1) : null);
      })
      .catch(() => setPromedio(null));
  }, [producto.id_producto]);

  return (
    <div
  onClick={irADetalle}
  style={{ backgroundColor: bgColor }}
  className="rounded-3xl p-5 shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.015] hover:shadow-2xl border border-white/30 backdrop-blur-md w-90"
>
  <div className="relative group">
    <img
      ref={imgRef}
      src={imagenPrincipal}
      alt={producto.nombre_producto}
      className="w-full h-56 object-contain mb-4 rounded-2xl transition-transform duration-300 group-hover:scale-105 mix-blend-multiply"
    />
    <button
      onClick={toggleFavorito}
      className="absolute top-3 right-3 bg-white/80 hover:bg-white text-pink-400 hover:text-pink-600 p-2 rounded-full shadow-md transition duration-300 z-10"
    >
      {esFavorito ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
    </button>
    <span className="absolute bottom-3 left-3 bg-white/60 text-gray-800 text-[11px] font-medium px-2 py-0.5 rounded-full shadow">
      {producto.genero_producto}
    </span>
  </div>

  {/* Contenido que define la altura */}
  <div className="space-y-2 min-h-[180px] flex flex-col justify-between">
    <div>
      <h3 className="text-xl font-semibold text-gray-800 truncate">{producto.nombre_producto}</h3>
      <p className="text-sm text-gray-500 capitalize">Tipo: {producto.tipo_producto}</p>

      <div className="flex justify-between items-center pt-2">
        <p className="text-lg font-bold text-green-700">${producto.precio_producto}</p>
        {producto.personalizacion_activa === 1 && (
          <button
            className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-semibold hover:bg-indigo-700 transition"
            onClick={e => {
              e.stopPropagation();
              navigate(`/personalizador`, { state: { producto } });
            }}
          >
            Personalizar
          </button>
        )}
      </div>

      {!!producto.reserva_activa && (
        <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full shadow animate-bounce">
          ¡Reserva disponible!
        </span>
      )}
    </div>

    <div className="flex items-center gap-1 mt-2">
      {promedio ? (
        <>
          <span className="text-yellow-500 text-sm">{promedio}</span>
          {[1, 2, 3, 4, 5].map(i => (
            <svg
              key={i}
              className={`w-4 h-4 ${i <= Math.round(promedio) ? "text-yellow-400" : "text-gray-300"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.564-.955L10 0l2.948 5.955 6.564.955-4.756 4.635 1.122 6.545z" />
            </svg>
          ))}
          <span className="text-xs text-gray-500">({promedio} / 5)</span>
        </>
      ) : (
        <span className="text-xs text-gray-400">Sin valoraciones</span>
      )}
    </div>
  </div>
</div>

  );
};


import { motion, AnimatePresence } from 'framer-motion';

export const MostrarProducto = ({ productosProp }) => {
  const [productos, setProductos] = React.useState([]);

  React.useEffect(() => {
    if (!productosProp || productosProp.length === 0) {
      cargarProductos();
    }
  }, [productosProp]);

  const cargarProductos = () => {
    import("axios").then(({ default: axios }) => {
      axios
        .get("https://quindishoes-backend-def.onrender.com/producto/public")
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : res.data.productos || [];
          setProductos(data);
        })
        .catch((err) => console.error("Error al cargar productos:", err));
    });
  };

  const productosMostrar =
    Array.isArray(productosProp) && productosProp.length > 0
      ? productosProp
      : Array.isArray(productos) ? productos : [];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

   return (
    <motion.div
      className="flex-1"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-2 
        lg:grid-cols-2 
        xl:grid-cols-2
        2xl:grid-cols-4 
        gap-6 
        gap-y-8
      ">
        <AnimatePresence>
          {productosMostrar.map((producto) => (
            <motion.div
              key={producto.id_producto}
              variants={itemVariants}
              exit={{ opacity: 0, y: 20 }}
              className="w-full"
            >
              <CartaProducto producto={producto} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


