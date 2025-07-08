import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import ModalActualizarColor from "./Modal/ModalActualizarColor";

const token = localStorage.getItem("token");

const ColorCard = ({ color, onDelete, onUpdate }) => (
  <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-start">
    <h3 className="text-lg font-bold">{color.nombre_color}</h3>
    <div className="flex gap-3 mt-3">
      <button
        onClick={onUpdate}
        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 flex items-center gap-1"
      >
        <FaEdit /> Actualizar
      </button>
      <button
        onClick={onDelete}
        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 flex items-center gap-1"
      >
        <FaTrash /> Eliminar
      </button>
    </div>
  </div>
);

export const ListaColores = () => {
  const [colores, setColores] = useState([]);
  const [colorEditar, setColorEditar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarColores = () => {
    axios
      .get("https://quindishoes-backend-def.onrender.com/color", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setColores(res.data))
      .catch((err) => console.error("Error al cargar colores:", err));
  };

  useEffect(() => {
    cargarColores();
  }, []);

  const handleEliminar = (id) => {
    axios
      .delete(`https://quindishoes-backend-def.onrender.com/color/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => cargarColores())
      .catch((err) => console.error("Error al eliminar color:", err));
  };

  const handleActualizar = (color) => {
    setColorEditar({ ...color });
    setMostrarModal(true);
  };

  return (
    <>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {colores.map((col) => (
          <ColorCard
            key={col.id_color}
            color={col}
            onDelete={() => handleEliminar(col.id_color)}
            onUpdate={() => handleActualizar(col)}
          />
        ))}
      </div>

      {mostrarModal && colorEditar && (
        <ModalActualizarColor
          color={colorEditar}
          onClose={() => setMostrarModal(false)}
          onActualizar={() => {
            setMostrarModal(false);
            cargarColores();
          }}
        />
      )}
    </>
  );
};
