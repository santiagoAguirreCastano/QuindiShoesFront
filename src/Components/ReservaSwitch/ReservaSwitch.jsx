import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axion";
import Swal from "sweetalert2";

export const ReservaSwitch = ({ id_producto, reserva_activa, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [activo, setActivo] = useState(!!reserva_activa);

  // Sincroniza el estado local con la prop cuando cambia desde el padre
  useEffect(() => {
    setActivo(!!reserva_activa);
  }, [reserva_activa]);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await axiosClient.put(`/producto/${id_producto}/reserva`, { activa: !activo });
      setActivo(!activo); // Cambia el estado local inmediatamente
      if (onChange) onChange();
      Swal.fire({
        icon: "success",
        title: "Reserva actualizada",
        text: `La reserva ha sido ${!activo ? "activada" : "desactivada"} correctamente.`,
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.mensaje || "No se pudo actualizar la reserva.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={activo}
        onChange={handleToggle}
        disabled={loading}
        className="peer sr-only"
      />
      <div
        className={`w-12 h-7 rounded-full transition-colors duration-300
          ${activo ? "bg-green-400" : "bg-gray-300"}
          relative`}
      >
        <div
          className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300
            ${activo ? "translate-x-5" : ""}
          `}
        />
      </div>
      <span className={`font-semibold ${activo ? "text-green-600" : "text-gray-500"}`}>
        {activo ? "Reserva activa" : "Reserva inactiva"}
      </span>
    </label>
  );
};