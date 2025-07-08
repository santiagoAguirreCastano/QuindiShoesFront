// src/pages/RespuestaPago.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const RespuestaPago = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [estadoPago, setEstadoPago] = useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const codigoRespuesta = queryParams.get("x_cod_response");
    const estado = queryParams.get("x_transaction_state");
    const refPayco = queryParams.get("x_ref_payco");

    if (codigoRespuesta === "1") {
      setEstadoPago("✅ Pago aprobado");
    } else if (codigoRespuesta === "2") {
      setEstadoPago("❌ Pago rechazado");
    } else if (codigoRespuesta === "3") {
      setEstadoPago("⏳ Pago pendiente");
    } else {
      setEstadoPago("⚠️ Estado desconocido");
    }
  }, [location.search]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">Estado del Pago</h1>
      <p className="text-lg">{estadoPago}</p>

      <button
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        onClick={() => navigate("/")}
      >
        Volver al inicio
      </button>
    </div>
  );
};

