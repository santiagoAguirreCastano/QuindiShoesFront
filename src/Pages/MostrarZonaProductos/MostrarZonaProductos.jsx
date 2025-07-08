import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import ModalActualizarZona from "./Modal/ModalActualizarZona";

const token = localStorage.getItem("token");

export const ListaZonas = () => {
  const [zonas, setZonas] = useState([]);
  const [zonaEditar, setZonaEditar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarZonas = () => {
    axios
      .get("http://localhost:3000/zonaProducto", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setZonas(res.data))
      .catch((err) => console.error("Error al cargar zonas:", err));
  };

  useEffect(() => {
    cargarZonas();
  }, []);

  const handleEliminar = (id) => {
    axios
      .delete(`http://localhost:3000/zonaProducto/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => cargarZonas())
      .catch((err) => console.error("Error al eliminar zona:", err));
  };

  const handleActualizar = (zona) => {
    setZonaEditar({ ...zona });
    setMostrarModal(true);
  };

  const handleActualizarZona = () => {
    setMostrarModal(false);  // Cierra modal
    cargarZonas();           // Recarga lista actualizada
  };

  return (
    <>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {zonas.map((zona) => (
          <div
            key={zona.id_zonaProductos}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col items-start"
          >
            <h3 className="text-lg font-bold">{zona.nombre_zona}</h3>
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleActualizar(zona)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 flex items-center gap-1"
              >
                <FaEdit /> Actualizar
              </button>
              <button
                onClick={() => handleEliminar(zona.id_zonaProductos)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 flex items-center gap-1"
              >
                <FaTrash /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {mostrarModal && zonaEditar && (
        <ModalActualizarZona
          zona={zonaEditar}
          onClose={() => setMostrarModal(false)}
          onActualizar={handleActualizarZona}
        />
      )}
    </>
  );
};
