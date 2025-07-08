import React, { useEffect, useState } from "react";
import axios from "axios";
import { MostrarProducto } from "../CartaProducto/CartaProducto";

export const BuscadorProductos = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [filtros, setFiltros] = useState({ precioMin: "", precioMax: "", marca: "", color: "", sexo: "", talla: "", tipo: "" });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const todosLosFiltrosVacios = () => {
    return !nombre.trim() &&
      !filtros.precioMin &&
      !filtros.precioMax &&
      !filtros.marca.trim() &&
      !filtros.color.trim() &&
      !filtros.sexo.trim() &&
      !filtros.talla.trim() &&
      !filtros.tipo.trim();
  };

  useEffect(() => {
    if (todosLosFiltrosVacios()) {
      obtenerTodosLosProductos();
    } else {
      buscarProductos();
    }
  }, [nombre, filtros]);

  const obtenerTodosLosProductos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/producto/public");
      setProductos(res.data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };

  const buscarProductos = async () => {
    try {
      const res = await axios.post("http://localhost:3000/buscadorProducto", { nombre, ...filtros });
      setProductos(res.data);
    } catch (err) {
      console.error("Error en búsqueda:", err);
    }
  };

  const handleInputChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  return (
    <div className="px-8 py-6 space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Buscar por nombre"
          className="rounded-xl px-4 py-2 border border-gray-300 shadow-sm w-64"
        />
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="bg-black text-white rounded-xl px-4 py-2 hover:bg-gray-800 transition"
        >
          {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
        </button>
      </div>

      {mostrarFiltros && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["categoria", "precioMin", "precioMax", "marca", "color", "sexo", "talla", "tipo"].map((campo) => (
            <input
              key={campo}
              name={campo}
              placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
              value={filtros[campo]}
              onChange={handleInputChange}
              className="rounded-xl px-4 py-2 border border-gray-300 shadow-sm"
            />
          ))}
        </div>
      )}

      <MostrarProducto productosProp={productos} />
    </div>
  );
};
