import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ContadorCarritoContext } from "../../Contexts/ContadorCarritoContext";
import axiosClient from "../../api/axion";
import { motion } from "framer-motion";

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();
  const [metodoEntrega, setMetodoEntrega] = useState("recoger_en_tienda");
  const [userId, setUserId] = useState(null);
  const { resetear } = useContext(ContadorCarritoContext);
  const [descuento, setDescuento] = useState(0);
  const [productoConDescuento, setProductoConDescuento] = useState(null);
  const [descuentoUsado, setDescuentoUsado] = useState(false);



  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const id = decoded.data?.id;
      setUserId(id);

      // 🔄 Obtener porcentaje de descuento
      axiosClient
        .get("/profile/recompensa")
        .then((res) => setDescuento(res.data.recompensa_juego || 0))
        .catch(() => setDescuento(0));

      // 🔄 Verificar si el descuento ya fue usado
      axiosClient
        .get(`/juego/${id}/descuento-estado`)
        .then((res) => setDescuentoUsado(res.data.descuento_usado))
        .catch(() => setDescuentoUsado(false));
        
    } catch (error) {
      console.error("Token inválido:", error);
    }
  }

  const script = document.createElement("script");
  script.src = "https://checkout.epayco.co/checkout.js";
  script.async = true;
  document.body.appendChild(script);
}, []);


  const totalVisual = carrito.reduce((acc, p, idx) => {
    if (productoConDescuento === idx && descuento > 0) {
      const precioConDescuento = p.precio_producto * (1 - descuento / 100);
      return acc + p.cantidad * Math.max(0, precioConDescuento);
    }
    return acc + p.cantidad * p.precio_producto;
  }, 0);

  useEffect(() => {
    const datosGuardados = localStorage.getItem("carrito");
    if (datosGuardados) {
      setCarrito(JSON.parse(datosGuardados));
    }
  }, []);


  const handlePSEPayment = () => {
    if (!userId) return;

    const carritoReducido = carrito.map(
      ({ id_producto, nombre_producto, precio_producto, talla, id_color, id_talla, cantidad, imagen }) => ({
        id_producto,
        nombre_producto,
        precio_producto,
        talla,
        id_color,
        id_talla,
        cantidad,
        imagen
      })
    );

    const total = carrito.reduce((acc, p, idx) => {
      if (productoConDescuento === idx && descuento > 0) {
        const precioConDescuento = p.precio_producto * (1 - descuento / 100);
        return acc + p.cantidad * Math.max(0, precioConDescuento);
      }
      return acc + p.cantidad * p.precio_producto;
    }, 0);

    const handler = window.ePayco.checkout.configure({
      key: "76018558cee4255d423b4753fee3fdf1",
      test: true
    });

    const data = {
      name: "Pago de productos",
      description: "Compra en QuindiShoes",
      invoice: "ORD-" + Date.now(),
      currency: "cop",
      amount: total.toString(),
      tax_base: "0",
      tax: "0",
      country: "co",
      method: "POST",
      response: "https://quindi-shoes-frontend-def.vercel.app/",
      confirmation: "http://localhost:3000/api/pagos/confirmacion",
      external: "false",
      x_extra1: userId.toString(),
      x_extra2: JSON.stringify(carritoReducido),
      x_extra3: productoConDescuento !== null && descuento > 0 ? descuento : 0,
      x_extra4: metodoEntrega
    };

    handler.open(data);
  };

  const vaciarCarrito = () => {
    localStorage.removeItem("carrito");
    setCarrito([]);
    resetear();
  };

  const irAProductos = () => navigate("/Productospages");

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50 px-4 py-8 flex justify-center items-start">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-[40px] p-10 space-y-12">
        <h2 className="text-5xl font-extrabold text-center text-[#1D3124]">🛍️ Tu Carrito</h2>
        {descuentoUsado && (
          <div className="text-yellow-800 bg-yellow-100 p-3 rounded-lg text-center font-medium shadow">
            🎁 Ya usaste tu recompensa del juego.
          </div>
        )}


        {carrito.length === 0 ? (
          <div className="text-center text-xl text-gray-600 flex flex-col items-center">
            No tienes productos en tu carrito aún.
            <button
              onClick={irAProductos}
              className="mt-6 w-[20rem] px-8 py-3 bg-pink-500 text-white font-bold rounded-full shadow hover:bg-pink-600 transition"
            >
              Explorar productos
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-10">
              {carrito.map((producto, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-white to-pink-50 border border-pink-100 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8"
                >
                  <div className="flex items-center gap-8 w-full md:w-2/3">
                    <div className="bg-transparent w-40 h-40 flex items-center justify-center">
                      <img
                        src={producto.imagen}
                        alt={producto.nombre_producto}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="flex flex-col gap-2 text-[#1D3124]">
                      <h3 className="text-3xl font-extrabold tracking-tight">{producto.nombre_producto}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-1 text-sm text-gray-600 font-medium gap-10">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">🎨</span>
                          <span>Color:</span>
                          <span className="font-semibold text-[#1D3124]">{producto.color}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">👟</span>
                          <span>Talla:</span>
                          <span className="font-semibold text-[#1D3124]">{producto.talla}</span>
                        </div>
                      </div>
                      <p className="text-2xl font-extrabold text-pink-600 mt-2">
                        ${productoConDescuento === index && descuento > 0
                          ? (producto.precio_producto * (1 - descuento / 100)).toFixed(2)
                          : producto.precio_producto}
                      </p>
                    </div>
                  </div>

                  {/* 🔄 NUEVA DISTRIBUCIÓN DE CONTROLES */}
                  <div className="flex flex-col gap-8 w-full md:w-auto md:min-w-[200px]">
                    {/* Cantidad */}
                    <div className="flex items-center justify-between bg-pink-100 px-4 py-2 rounded-full shadow">
                      <button
                        onClick={() => {
                          const nuevo = [...carrito];
                          if (nuevo[index].cantidad > 1) {
                            nuevo[index].cantidad--;
                            setCarrito(nuevo);
                            localStorage.setItem("carrito", JSON.stringify(nuevo));
                          }
                        }}
                        className="text-pink-700 text-xl font-bold hover:text-pink-900"
                      >
                        −
                      </button>
                      <span className="text-lg font-semibold text-[#1D3124]">{producto.cantidad}</span>
                      <button
                        onClick={() => {
                          const nuevo = [...carrito];
                          if (nuevo[index].cantidad < producto.stock) {
                            nuevo[index].cantidad++;
                            setCarrito(nuevo);
                            localStorage.setItem("carrito", JSON.stringify(nuevo));
                          }
                        }}
                        className="text-white bg-pink-500 px-3 py-1 rounded-full text-xl hover:bg-pink-600"
                      >
                        +
                      </button>
                    </div>

                    {/* Entrega */}
                    <div className="grid grid-cols-2 gap-5">
                      <button
                        onClick={() => setMetodoEntrega("recoger_en_tienda")}
                        className={`w-full py-2 rounded-full font-medium text-sm shadow transition ${
                          metodoEntrega === "recoger_en_tienda"
                            ? "bg-blue-200 text-blue-900"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        🏬 Recoger
                      </button>
                      <button
                        onClick={() => setMetodoEntrega("domicilio")}
                        className={`w-[150px] py-2 rounded-full font-medium text-sm shadow transition ${
                          metodoEntrega === "domicilio"
                            ? "bg-green-200 text-green-900"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        🚚 Domicilio
                      </button>
                    </div>

                    {/* Descuento */}
                    <button
                      onClick={() =>
                        setProductoConDescuento(productoConDescuento === index ? null : index)
                      }
                      disabled={descuento === 0 || descuentoUsado}
                      className={`w-full py-2 rounded-full text-sm font-semibold shadow transition ${
                        productoConDescuento === index
                          ? "bg-yellow-200 text-yellow-900"
                          : "bg-yellow-50 text-gray-600"
                      } ${descuento === 0 || descuentoUsado ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      🎁 {
                        descuentoUsado
                          ? "Descuento ya usado"
                          : productoConDescuento === index
                            ? `Descuento aplicado (-${descuento}%)`
                            : `Aplicar descuento`
                      }
                    </button>


                    {/* Eliminar */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const nuevoCarrito = carrito.filter((_, i) => i !== index);
                        setCarrito(nuevoCarrito);
                        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
                      }}
                      className="w-full bg-red-100 text-red-600 py-2 rounded-full text-sm font-medium shadow hover:bg-red-200"
                    >
                      🗑 Eliminar
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total y acciones */}
            <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-3xl font-extrabold text-[#1D3124]">
                Total: <span className="text-pink-600">${totalVisual.toFixed(2)}</span>
              </div>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={vaciarCarrito}
                  className="px-6 py-3 bg-red-100 text-red-700 rounded-full font-semibold hover:bg-red-200 transition"
                >
                  Vaciar Carrito
                </button>
                
                <button
                  onClick={irAProductos}
                  className="px-8 py-3 bg-pink-500 text-white font-bold rounded-full shadow-md hover:bg-pink-600 transition"

                >
                  Seguir comprando
                </button>
                <button
                  onClick={handlePSEPayment}
                  className="px-6 py-3 bg-green-200 text-green-800 rounded-full font-semibold hover:bg-green-300 transition"

                >
                  Comprar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Carrito;
