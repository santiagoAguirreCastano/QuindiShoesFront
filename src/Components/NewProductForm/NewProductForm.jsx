import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axion";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTimes } from "react-icons/fa";
import { tiposProductoPredeterminados } from "../../utils/tiposProducto";

export const NewProductForm = ({ onClose }) => {
    const [producto, setProducto] = useState({
        nombreProducto: "",
        generoProducto: "",
        stockProducto: 0,
        tallaProducto: "",
        precioProducto: 0,
        colorProducto: "",
        imagenProducto: "",
    });

    const [tipoProducto, setTipoProducto] = useState("");
    const [nuevoTipo, setNuevoTipo] = useState("");
    const [mostrarInputTipo, setMostrarInputTipo] = useState(false);

    const [tallas, setTallas] = useState([]);
    const [colores, setColores] = useState([]);
    const [nuevoColor, setNuevoColor] = useState("");
    const [nuevoHex, setNuevoHex] = useState("#000000");
    const [mostrarNuevoColor, setMostrarNuevoColor] = useState(false);

    useEffect(() => {
        cargarTallas();
        cargarColores();
    }, []);

    const cargarTallas = () => {
        axiosClient.get("/producto/tallas")
            .then(response => {
                const data = Array.isArray(response.data[0]) ? response.data[0] : response.data;
                setTallas(data);
            })
            .catch(error => console.error("Error al cargar tallas:", error));
    };

    const cargarColores = () => {
        axiosClient.get("/producto/colores")
            .then(response => {
                const data = Array.isArray(response.data[0]) ? response.data[0] : response.data;
                setColores(data);
            })
            .catch(error => console.error("Error al cargar colores:", error));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto(prev => ({
            ...prev,
            [name]: ["stockProducto", "precioProducto"].includes(name) ? Number(value) : value,
        }));
    };

    const handleAgregarColor = async () => {
        if (!nuevoColor || !nuevoHex) {
            Swal.fire("Campos incompletos", "Debes ingresar nombre y color", "warning");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            await axiosClient.post("/producto/colores", {
                color: nuevoColor,
                codigo_hex: nuevoHex,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            cargarColores();
            setNuevoColor("");
            setNuevoHex("#000000");
            setMostrarNuevoColor(false);
            Swal.fire("¡Éxito!", "Color registrado correctamente", "success");
        } catch (error) {
            Swal.fire("Error", "No se pudo registrar el color", "error");
        }
    };

    const handleSubmit = async (e) => {
  e.preventDefault();
  const tipoFinal = mostrarInputTipo ? nuevoTipo : tipoProducto;

  const {
    nombreProducto,
    generoProducto,
    stockProducto,
    tallaProducto,
    precioProducto,
    colorProducto,
    imagenProducto,
  } = producto;

  if (!tipoFinal || !nombreProducto || !generoProducto || !tallaProducto || !precioProducto || !colorProducto || !imagenProducto) {
    Swal.fire("Campos incompletos", "Por favor llena todos los campos", "warning");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    await axiosClient.post(
      "/producto",
      {
        tipoProducto: tipoFinal,
        nombreProducto,
        generoProducto,
        precioProducto,
        stockProducto,
        tallaProducto,
        colorProducto,
        imagenProducto,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    Swal.fire("¡Éxito!", "Producto registrado correctamente", "success");
    if (typeof onClose === "function") onClose();
  } catch (error) {
    console.error("Error al registrar producto:", error);
    Swal.fire("Error", "Hubo un problema al registrar el producto", "error");
  }
};

  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-md px-2 sm:px-4"
  >
    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl mx-4 relative transition-all duration-300 ease-in-out">
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-xl text-gray-500 hover:text-red-500 transition"
      >
        <FaTimes />
      </button>

      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-pink-600">
        Registrar Producto
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tipo de producto */}
        <div className="col-span-1 sm:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-700">Tipo de producto</label>
          {!mostrarInputTipo ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={tipoProducto}
                onChange={(e) => setTipoProducto(e.target.value)}
                className="w-full p-3 border rounded-md transition-all duration-300 ease-out focus:outline-pink-400 focus:shadow-md focus:scale-[1.01]"
              >
                <option value="">Seleccione un tipo</option>
                {tiposProductoPredeterminados.map((tipo, index) => (
                  <option key={index} value={tipo}>{tipo}</option>
                ))}
              </select>
              <motion.button
                type="button"
                onClick={() => setMostrarInputTipo(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus /> Otro
              </motion.button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Nuevo tipo de producto"
                value={nuevoTipo}
                onChange={(e) => setNuevoTipo(e.target.value)}
                className="w-full p-3 border rounded-md"
              />
              <button
                type="button"
                onClick={() => setMostrarInputTipo(false)}
                className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded-md"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        <input
          name="nombreProducto"
          placeholder="Nombre del producto"
          onChange={handleChange}
          className="p-3 border rounded-md transition-all duration-300 focus:outline-pink-400"
        />

        <select
          name="generoProducto"
          onChange={handleChange}
          value={producto.generoProducto}
          className="p-3 border rounded-md transition-all duration-300 ease-out focus:outline-pink-400 focus:shadow-md focus:scale-[1.01]"
        >
          <option value="">Seleccione género</option>
          <option value="Hombre">Hombre</option>
          <option value="Mujer">Mujer</option>
          <option value="Unisex">Unisex</option>
        </select>

        <input
          name="stockProducto"
          type="number"
          placeholder="Stock"
          onChange={handleChange}
          className="p-3 border rounded-md transition-all duration-300 focus:outline-pink-400"
        />

        <select
          name="tallaProducto"
          onChange={handleChange}
          value={producto.tallaProducto}
          className="p-3 border rounded-md transition-all duration-300 ease-out focus:outline-pink-400 focus:shadow-md focus:scale-[1.01]"
        >
          <option value="">Seleccione una talla</option>
          {tallas.map((t) => (
            <option key={t.id_talla} value={t.id_talla}>
              {t.talla}
            </option>
          ))}
        </select>

        <input
          name="precioProducto"
          type="number"
          placeholder="Precio"
          onChange={handleChange}
          className="p-3 border rounded-md transition-all duration-300 focus:outline-pink-400"
        />

        <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row gap-2 items-center">
          <select
            name="colorProducto"
            onChange={handleChange}
            value={producto.colorProducto}
            className="w-full p-3 border rounded-md transition-all duration-300 ease-out focus:outline-pink-400 focus:shadow-md focus:scale-[1.01]"
          >
            <option value="">Seleccione un color</option>
            {colores.map((c) => (
              <option key={c.id_color} value={c.id_color}>
                {c.color} ({c.codigo_hex})
              </option>
            ))}
          </select>

          <motion.button
            type="button"
            onClick={() => setMostrarNuevoColor(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full shadow-md"
            title="Agregar nuevo color"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus />
          </motion.button>
        </div>

        <AnimatePresence>
          {mostrarNuevoColor && (
            <motion.div
              className="col-span-1 sm:col-span-2 bg-gray-50 border rounded-md p-4 space-y-3 overflow-hidden origin-top"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="text"
                  placeholder="Nombre del color"
                  value={nuevoColor}
                  onChange={(e) => setNuevoColor(e.target.value)}
                  className="flex-1 p-2 border rounded-md w-full"
                />
                <input
                  type="color"
                  value={nuevoHex}
                  onChange={(e) => setNuevoHex(e.target.value)}
                  className="w-full sm:w-12 h-12 border rounded-md"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAgregarColor}
                  className="w-full sm:w-auto bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
                >
                  Guardar color
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarNuevoColor(false)}
                  className="w-full sm:w-auto bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          name="imagenProducto"
          placeholder="URL de imagen"
          onChange={handleChange}
          className="col-span-1 sm:col-span-2 p-3 border rounded-md transition-all duration-300 focus:outline-pink-400"
        />

        <button
          type="submit"
          className="col-span-1 sm:col-span-2 bg-pink-500 text-white py-3 rounded-md hover:bg-pink-600 transition"
        >
          Registrar Producto
        </button>
      </form>
    </div>
  </motion.div>
);

};
