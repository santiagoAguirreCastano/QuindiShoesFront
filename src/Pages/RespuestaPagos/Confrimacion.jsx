import React from "react";
import { useLocation } from "react-router-dom";

export function Confirmacion() {
  // Extraer query params para mostrar detalles
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const estado = query.get("estado") || "desconocido";
  const facturaId = query.get("facturaId") || "N/A";
  const mensaje = query.get("mensaje") || "";

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Confirmación de Pago</h2>
      <p><strong>Estado del pago:</strong> {estado}</p>
      {facturaId !== "N/A" && <p><strong>Factura ID:</strong> {facturaId}</p>}
      {mensaje && <p>{mensaje}</p>}
      <button onClick={() => window.location.href = "/"}>Volver al inicio</button>
    </div>
  );
}


