import React, { useState } from "react";
import { tiposProductoPredeterminados } from "../../utils/tipoProducto";
import { FaPlus } from "react-icons/fa";

export const FiltrosProducto = ({ onFiltrar }) => {
  const [filtros, setFiltros] = useState({
    nombre: "",
    tipo: "",
    genero: "",
  });

  const [mostrarInputTipo, setMostrarInputTipo] = useState(false);
  const [tipoPersonalizado, setTipoPersonalizado] = useState("");

  const aplicarFiltro = (nuevosFiltros) => {
    const filtrosActualizados = {
      ...nuevosFiltros,
      tipo: mostrarInputTipo ? tipoPersonalizado : nuevosFiltros.tipo,
    };
    onFiltrar(filtrosActualizados);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nuevosFiltros = { ...filtros, [name]: value };
    setFiltros(nuevosFiltros);
    aplicarFiltro(nuevosFiltros);
  };

  const handleTipoPersonalizado = (e) => {
    const value = e.target.value;
    setTipoPersonalizado(value);
    aplicarFiltro({ ...filtros, tipo: value });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-xl shadow-md mb-6 items-center">
      <input
        type="text"
        name="nombre"
        placeholder="Buscar por nombre"
        className="border p-2 rounded w-full sm:w-auto"
        onChange={handleChange}
      />

      {!mostrarInputTipo ? (
        <div className="flex gap-2">
          <select
            name="tipo"
            className="border p-2 rounded"
            onChange={handleChange}
          >
            <option value="">Tipo</option>
            {tiposProductoPredeterminados.map((tipo, index) => (
              <option key={index} value={tipo}>{tipo}</option>
            ))}
          </select>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all shadow-md"
            onClick={() => setMostrarInputTipo(true)}
          >
            <FaPlus />Otro
          </button>
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Tipo personalizado"
            value={tipoPersonalizado}
            onChange={handleTipoPersonalizado}
            className="border p-2 rounded"
          />
          <button
            type="button"
            className="text-sm px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={() => {
              setMostrarInputTipo(false);
              setTipoPersonalizado("");
              aplicarFiltro({ ...filtros, tipo: "" });
            }}
          >
            Cancelar
          </button>
        </div>
      )}

      <select
        name="genero"
        className="border p-2 rounded"
        onChange={handleChange}
      >
        <option value="">Genero</option>
        <option value="Femenino">Femenino</option>
        <option value="Masculino">Masculino</option>
        <option value="Unisex">Unisex</option>
      </select>
    </div>
  );
};