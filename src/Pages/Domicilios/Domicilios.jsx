import { useEffect, useState } from "react";
import axiosClient from "../../api/axion";

const Domicilios = () => {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    axiosClient.get("/api/facturas/domicilios")
      .then(res => setFacturas(res.data))
      .catch(err => console.error("Error al cargar domicilios:", err));
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">📦 Pedidos con Domicilio</h1>

      {facturas.length === 0 ? (
        <p className="text-center text-gray-600">No hay pedidos para domicilio.</p>
      ) : (
        <div className="space-y-6">
          {facturas.map((factura) => (
            <div key={factura.id} className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Factura #{factura.id}</h2>
              <p><strong>Fecha:</strong> {new Date(factura.fecha_pago).toLocaleString()}</p>
              <p><strong>Usuario ID:</strong> {factura.id_usuario}</p>
              <p><strong>Valor total:</strong> ${factura.valor}</p>
              <p><strong>Descuento:</strong> {factura.descuento}%</p>

              <h3 className="mt-4 font-semibold">🛍 Productos:</h3>
             <ul className="ml-4 list-disc">
            {Array.isArray(factura.contenido_factura) ? (
              factura.contenido_factura.map((item, i) => (
                <li key={i}>
                  {item.nombre_producto} - Talla: {item.talla}, Cantidad: {item.cantidad}, Color: {item.color}
                </li>
              ))
            ) : (
              <li className="text-gray-500">Sin productos asociados</li>
            )}
          </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Domicilios;
