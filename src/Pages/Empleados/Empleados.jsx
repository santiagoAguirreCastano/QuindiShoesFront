import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import axiosClient from "../../api/axion";
import ModalActualizarEmpleado from "./Modal/Modal";
import { FormEmpleados } from "../../Components/FormEmpleados/FormEmpleados";

// Componente de una tarjeta individual del empleado
const EmpleadoCard = ({ empleado, onUpdate, onDelete }) => {
  const inicial = empleado.nombre?.charAt(0)?.toUpperCase() || "?";

  const confirmarEliminar = () => {
    Swal.fire({
      title: "¿Eliminar empleado?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E53935",
      cancelButtonColor: "#9e9e9e",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete();
        Swal.fire({
          icon: "success",
          title: "Empleado eliminado",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-green-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col sm:flex-row gap-5"
    >
      {/* Inicial */}
      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 text-green-700 font-bold text-2xl sm:text-3xl flex items-center justify-center shadow-inner mx-auto sm:mx-0">
        {inicial}
      </div>

      {/* Información */}
      <div className="flex flex-col justify-between flex-grow text-center sm:text-left">
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              {empleado.nombre} {empleado.apellido}
            </h2>
            <span className="text-xs font-medium text-white bg-green-600 px-3 py-1 rounded-full shadow w-fit mx-auto sm:mx-0">
              {empleado.rol}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 mt-2">
            <div>
              <p className="text-xs text-gray-500">ID del Empleado</p>
              <p className="font-medium">{empleado.id_usuario}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Correo</p>
              <p className="font-medium break-words">{empleado.correo}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Teléfono</p>
              <p className="font-medium">{empleado.telefono}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Dirección</p>
              <p className="font-medium break-words">{empleado.direccion}</p>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start mt-5">
          <button
            onClick={onUpdate}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow-md transition-all"
          >
            <FaEdit /> Actualizar
          </button>
          <button
            onClick={confirmarEliminar}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg shadow-md transition-all"
          >
            <FaTrash /> Eliminar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmpleadoCard;



export const ListaEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [mostrarModalActualizar, setMostrarModalActualizar] = useState(false);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [empleadoEditar, setEmpleadoEditar] = useState(null);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = () => {
    axiosClient
      .get("/empleado")
      .then((res) => setEmpleados(res.data))
      .catch((err) => console.error("Error:", err));
  };

  const handleEliminar = (id) => {
    const token = localStorage.getItem("token");
    axiosClient
      .delete(`/empleado/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => cargarEmpleados())
      .catch((err) => console.error("Error al eliminar empleado:", err));
  };

  const handleActualizar = (empleado) => {
    setEmpleadoEditar({
      id: empleado.id_usuario,
      nombres: empleado.nombre,
      apellidos: empleado.apellido,
      telefono: empleado.telefono,
      direccion: empleado.direccion,
      correo: empleado.correo,
      rol: empleado.rol,
    });
    setMostrarModalActualizar(true);
  };

  return (
    <>
      {/* Lista de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4 py-10 w-full max-w-7xl mx-auto">
        {empleados.map((empleado) => (
          <EmpleadoCard
            key={empleado.id_usuario}
            empleado={empleado}
            onUpdate={() => handleActualizar(empleado)}
            onDelete={() => handleEliminar(empleado.id_usuario)}
          />
        ))}
      </div>

      {/* Botón flotante para agregar */}
      <button
        onClick={() => setMostrarModalCrear(true)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all"
        title="Agregar Empleado"
      >
        <FaPlus size={20} />
      </button>

      {/* Modal para actualizar */}
      {mostrarModalActualizar && empleadoEditar && (
        <ModalActualizarEmpleado
          empleado={empleadoEditar}
          onClose={() => setMostrarModalActualizar(false)}
          onActualizar={cargarEmpleados}
        />
      )}

      {/* Modal para crear */}
      {mostrarModalCrear && (
        <FormEmpleados
          modoModal
          onClose={() => {
            setMostrarModalCrear(false);
            cargarEmpleados();
          }}
        />
      )}
    </>
  );
};
