// Importaciones
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import axiosClient from "../../api/axion";
import { ContadorCarritoContext } from "../../Contexts/ContadorCarritoContext";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import ResenasProducto from "../../Components/ResenasProducto/ResenasProducto";
import { ParticlesBackground } from "../../Components/Particulas/ParticlesBackground";
import ColorThief from "colorthief";

declare global {
  interface Window {
    ePayco?: any;
  }
}

// Interfaces
interface Variante {
  id_variantes: number;
  id_talla: number;
  talla: string;
  id_color: number;
  color: string;
  stock: number;
}

interface DetalleProducto {
  id_producto: number;
  tipo_producto: string;
  nombre_producto: string;
  reseña_producto: string;
  genero_producto: string;
  precio_producto: number;
  imagenes: string[];
  colores: { id_color: number; color: string; codigo_hex: string }[];
  tallas: { id_talla: number; talla: string }[];
  variantes: Variante[];
  reserva_activa?: number | boolean;
  personalizacion_activa?: number | boolean;
}

// Funciones de conversión de color
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h: number, s: number, l: number) {
  s /= 100; l /= 100; h /= 360;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hacerPastel(rgb: number[]) {
  let [r, g, b] = rgb;
  let [h, s, l] = rgbToHsl(r, g, b);
  l = Math.min(l + 80, 90);
  s = Math.max(s - 20, 90);
  return hslToRgb(h, s, l);
}

// Componente principal
export function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incrementarContador } = useContext(ContadorCarritoContext);
  const usuario_id = localStorage.getItem("id");
  const usuario = usuario_id ? { id: Number(usuario_id) } : null;

  const [producto, setProducto] = useState<DetalleProducto | null>(null);
  const [colorSeleccionado, setColorSeleccionado] = useState<number | null>(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [esFavorito, setEsFavorito] = useState(false);
  const [bgColor, setBgColor] = useState<string>("#fdeef2");

  const imgRef = useRef<HTMLImageElement>(null);

  // Obtener detalle producto
  useEffect(() => {
    axiosClient.get(`/productoDetalle/${id}`)
      .then(res => setProducto(res.data))
      .catch(() => setProducto(null));
  }, [id]);

  // Agrega este useEffect para ver el valor de personalizacion_activa
  useEffect(() => {
    if (producto) {
      console.log("Estado de personalizacion_activa:", producto.personalizacion_activa);
    }
  }, [producto]);

  // Verificar si es favorito
  useEffect(() => {
    if (!producto) return;
    const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
    setEsFavorito(favoritos.some((p: any) => p.id_producto === producto.id_producto));
  }, [producto]);

  useEffect(() => {
  if (!window.ePayco) {
    const script = document.createElement("script");
    script.src = "https://checkout.epayco.co/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }
}, []);


  // Detectar color dominante y convertirlo en pastel
  useEffect(() => {
    if (!producto) return;
    const img = imgRef.current;
    if (!img) return;

    const colorThief = new ColorThief();

    const onLoad = () => {
      try {
        const dominantColor = colorThief.getColor(img);
        const pastelColor = hacerPastel(dominantColor);
        setBgColor(`rgb(${pastelColor[0]}, ${pastelColor[1]}, ${pastelColor[2]})`);
      } catch {
        setBgColor("#fdeef2");
      }
    };

    img.crossOrigin = "anonymous";
    img.complete ? onLoad() : img.addEventListener("load", onLoad);
    return () => img.removeEventListener("load", onLoad);
  }, [producto]);

  if (!producto) return <div className="text-center mt-20 text-xl animate-pulse">Cargando...</div>;

  const imagenPrincipal = producto.imagenes?.[0] || "https://via.placeholder.com/500x400?text=Sin+Imagen";

  const varianteSeleccionada = producto.variantes.find(v => v.id_color === colorSeleccionado && v.id_talla === tallaSeleccionada);
  const stockDisponible = varianteSeleccionada ? varianteSeleccionada.stock : 0;

  // Handlers
  const handleAgregarCarrito = () => {
    if (!colorSeleccionado || !tallaSeleccionada || cantidad > stockDisponible) {
      return Swal.fire({ icon: "warning", title: "Verifica color, talla y stock", confirmButtonColor: "#2563eb" });
    }

    const carritoActual = JSON.parse(localStorage.getItem("carrito") || "[]");
    const nuevaEntrada = {
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto,
      precio_producto: producto.precio_producto,
      imagen: imagenPrincipal,
      color: producto.colores.find(c => c.id_color === colorSeleccionado)?.color,
      talla: producto.tallas.find(t => t.id_talla === tallaSeleccionada)?.talla,
      id_color: colorSeleccionado,
      id_talla: tallaSeleccionada,
      cantidad,
      id_variante: varianteSeleccionada?.id_variantes,
      stock: varianteSeleccionada?.stock
    };

    const idx = carritoActual.findIndex((item: any) =>
      item.id_producto === nuevaEntrada.id_producto &&
      item.id_color === nuevaEntrada.id_color &&
      item.id_talla === nuevaEntrada.id_talla
    );

    if (idx >= 0) carritoActual[idx].cantidad += cantidad;
    else carritoActual.push(nuevaEntrada);

    localStorage.setItem("carrito", JSON.stringify(carritoActual));
    incrementarContador();
    Swal.fire({ icon: "success", title: "Agregado al carrito", timer: 1500, showConfirmButton: false });
  };

  const handleReservar = () => {
  if (!usuario_id) {
    Swal.fire({
      icon: "warning",
      title: "Inicia sesión para reservar",
      text: "Debes iniciar sesión para poder reservar este producto.",
      confirmButtonColor: "#2563eb"
    });
    return;
  }

  if (!window.ePayco) {
    alert("No se pudo cargar la pasarela de pagos. Intenta de nuevo.");
    return;
  }

  const varianteSeleccionada = producto?.variantes.find(
    v => v.id_color === colorSeleccionado && v.id_talla === tallaSeleccionada
  );

  if (!colorSeleccionado || !tallaSeleccionada || !varianteSeleccionada) {
    Swal.fire({
      icon: "warning",
      title: "Selecciona color y talla",
      text: "Por favor selecciona un color y una talla antes de reservar.",
      confirmButtonColor: "#2563eb"
    });
    return;
  }

  if (cantidad > varianteSeleccionada.stock) {
    Swal.fire({
      icon: "error",
      title: "Stock insuficiente",
      text: "No hay suficiente stock disponible para la cantidad seleccionada.",
      confirmButtonColor: "#2563eb"
    });
    return;
  }

  const handler = window.ePayco.checkout.configure({
    key: "76018558cee4255d423b4753fee3fdf1", // Tu llave pública
    test: true,
  });

  const reservaData = {
    name: producto.nombre_producto,
    description: `Reserva de ${producto.nombre_producto}`,
    invoice: "ORD-" + Date.now(),
    currency: "cop",
    amount: (producto.precio_producto * cantidad).toString(),
    tax_base: "0",
    tax: "0",
    country: "co",
    method: "POST",
    response: "https://quindi-shoes-frontend-yemj.vercel.app/pagos/respuesta",
    confirmation: "http://localhost:3000/api/pagos/confirmacion",
    external: "false",
    x_extra1: String(usuario_id),
    x_extra2: JSON.stringify({
      tipo: "reserva",
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto,
      color: producto.colores.find(c => c.id_color === colorSeleccionado)?.color,
      talla: producto.tallas.find(t => t.id_talla === tallaSeleccionada)?.talla,
      cantidad,
      id_variante: varianteSeleccionada.id_variantes,
    }),
  };

  handler.open(reservaData);
};

  const toggleFavorito = () => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
    const existe = favoritos.some((p: any) => p.id_producto === producto?.id_producto);
    const nuevos = existe ? favoritos.filter((p: any) => p.id_producto !== producto?.id_producto) : [...favoritos, producto];
    localStorage.setItem("favoritos", JSON.stringify(nuevos));
    setEsFavorito(!existe);
    window.dispatchEvent(new Event("favoritos-updated"));
  };

  return (
  <div
    className="w-full min-h-screen px-4 sm:px-8 md:px-12 lg:px-16 pt-16 pb-24 flex flex-col gap-16 transition-colors duration-700"
    style={{ background: `linear-gradient(to bottom right, ${bgColor}, white, ${bgColor})` }}
  >
    {/* Sección superior */}
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
      {/* Imagen */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center mt-10 lg:mt-[100px]">
        <img
          ref={imgRef}
          src={imagenPrincipal}
          alt={producto.nombre_producto}
          className="w-full max-w-[380px] sm:max-w-[440px] md:max-w-[480px] h-auto object-contain"
        />
        <div className="flex gap-3 mt-4 flex-wrap justify-center">
          {producto.imagenes.slice(1).map((img, idx) => (
            <img key={idx} src={img} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-gray-300 object-cover" />
          ))}
        </div>
      </div>

      {/* Detalles */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center mt-6 lg:mt-[100px] px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-3 break-words">{producto.nombre_producto}</h1>
        <p className="text-base sm:text-lg text-gray-600 mb-1">{producto.tipo_producto}</p>
        <p className="text-2xl sm:text-3xl font-black text-black mb-4">${producto.precio_producto}</p>

        {/* Colores */}
        <div className="flex gap-3 mb-4 flex-wrap">
          {producto.colores.map((c) => (
            <button
              key={c.id_color}
              onClick={() => setColorSeleccionado(c.id_color)}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 transition-all ${colorSeleccionado === c.id_color ? "border-black scale-110" : "border-gray-300"}`}
              style={{ backgroundColor: c.codigo_hex }}
            ></button>
          ))}
        </div>

        {/* Tallas */}
        {/* Tallas dinámicas según color seleccionado */}
<div className="flex gap-2 mb-4 flex-wrap">
  {producto.tallas.map((t) => {
    const variante = producto.variantes.find(
      (v) =>
        v.id_color === colorSeleccionado &&
        v.id_talla === t.id_talla &&
        v.stock > 0
    );

    const disponible = !!variante;

    return (
      <button
        key={t.id_talla}
        onClick={() => disponible && setTallaSeleccionada(t.id_talla)}
        disabled={!disponible}
        className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full text-sm border font-semibold transition-all
          ${
            !disponible
              ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed opacity-60"
              : tallaSeleccionada === t.id_talla
              ? "bg-pink-500 text-white border-pink-500"
              : "bg-white text-black border-gray-300 hover:bg-pink-100"
          }`}
      >
        {t.talla}
      </button>
    );
  })}
</div>


        {/* Cantidad */}
        <div className="flex gap-2 items-center mb-6">
          <label className="text-gray-700 font-medium">Cantidad:</label>
          <button onClick={() => setCantidad(c => Math.max(1, c - 1))} className="w-8 h-8 rounded-full border hover:bg-pink-200">-</button>
          <span>{cantidad}</span>
          <button onClick={() => setCantidad(c => Math.min(stockDisponible, c + 1))} className="w-8 h-8 rounded-full border hover:bg-green-200">+</button>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAgregarCarrito}
            className="w-full sm:w-auto flex-1 bg-pink-500 text-white py-3 rounded-full font-semibold shadow-lg hover:bg-pink-600 transition flex items-center justify-center gap-2"
          >
            Agregar al Carrito
            <FaShoppingCart className="text-lg" />
          </motion.button>

          {producto.reserva_activa && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReservar}
              className="w-full sm:w-auto flex-1 bg-white border-2 border-black text-black py-3 rounded-full font-semibold hover:bg-black hover:text-white transition"
            >
              Reservar
            </motion.button>
          )}

          {producto.personalizacion_activa === 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/personalizador", { state: { producto } })}
              className="w-full sm:w-auto flex-1 bg-indigo-600 text-white py-3 rounded-full font-semibold shadow-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              Personalizar
            </motion.button>
          )}
        </div>

        {/* Favorito */}
        <motion.button
          onClick={toggleFavorito}
          whileTap={{ rotate: 360, scale: 1.3 }}
          className="p-3 rounded-full text-pink-500 text-3xl shadow-md hover:scale-110 transition-transform self-center sm:self-start"
        >
          {esFavorito ? <FaHeart /> : <FaRegHeart />}
        </motion.button>
      </div>
    </div>

    {/* Sección reseñas */}
    <div className="w-full flex justify-center mt-10 px-2 sm:px-0">
      <div className="w-full max-w-3xl rounded-2xl shadow-2xl p-6 sm:p-8 bg-white/60 backdrop-blur-md border border-pink-200">
        <ParticlesBackground />
        <ResenasProducto id_producto={producto.id_producto} usuario={usuario} />
      </div>
    </div>
  </div>
);

}
