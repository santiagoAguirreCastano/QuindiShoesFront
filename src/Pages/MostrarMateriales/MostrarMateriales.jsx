// ListaMateriales.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ModalActualizarMaterial from "./Modal/ModalActualizarMaterial";

const MaterialCard = ({ material, onDelete, onUpdate }) => (
  <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-start">
    <h3 className="text-lg font-bold">{material.nombre_material}</h3>
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

export const ListaMateriales = () => {
  const [materiales, setMateriales] = useState([]);
  const [materialEditar, setMaterialEditar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const token = localStorage.getItem("token");

  const cargarMateriales = () => {
    axios
      .get("http://localhost:3000/material", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setMateriales(res.data))
      .catch((err) => console.error("Error al cargar materiales:", err));
  };

  useEffect(() => {
    cargarMateriales();
  }, []);

  const handleEliminar = (id) => {
    axios
      .delete(`http://localhost:3000/material/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => cargarMateriales())
      .catch((err) => console.error("Error al eliminar material:", err));
  };

  const handleActualizar = (material) => {
    setMaterialEditar({ ...material });
    setMostrarModal(true);
  };

  return (
    <>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {materiales.map((mat) => (
          <MaterialCard
            key={mat.id_material}
            material={mat}
            onDelete={() => handleEliminar(mat.id_material)}
            onUpdate={() => handleActualizar(mat)}
          />
        ))}
      </div>

      {mostrarModal && materialEditar && (
        <ModalActualizarMaterial
          material={materialEditar}
          onClose={() => setMostrarModal(false)}
          onActualizar={() => {
            setMostrarModal(false);
            cargarMateriales();
          }}
        />
      )}
    </>
  );
};
