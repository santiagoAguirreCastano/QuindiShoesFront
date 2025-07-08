import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const HistorialFacturas = () => {
  const [facturas, setFacturas] = useState([]);


  const CargarFacturas = () => {
    axios
      .get(`https://quindishoes-backend-def.onrender.com/facturas`)
      .then((res) => {
        setFacturas(res.data);
      })
      .catch((err) => {
        console.error("❌ Error al cargar facturas:", err);
      });
  };

  useEffect(() => {
    CargarFacturas();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Historial de Facturas</h2>
      {facturas.length === 0 ? (
        <p>No hay facturas registradas.</p>
      ) : (
        <ul className="space-y-4">
          {facturas.map((factura) => (
            <li key={factura.id} className="p-4 border rounded-lg shadow">
              <p>🧾 Ref Payco: {factura.ref_payco}</p>
              <p>💰 Valor: ${factura.valor}</p>
              <p>📅 Fecha: {new Date(factura.fecha_pago).toLocaleString()}</p>
              <p>🔄 Estado: {factura.estado}</p>
              <p>💳 Método de Pago: {factura.metodo_pago}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
