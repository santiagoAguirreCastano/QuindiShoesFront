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
  <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
      📦 Pedidos con Domicilio
    </h1>

    {facturas.length === 0 ? (
      <p className="text-center text-gray-600 text-sm sm:text-base">
        No hay pedidos para domicilio.
      </p>
    ) : (
      <div className="space-y-6">
        {facturas.map((factura) => (
          <div
            key={factura.id}
            className="bg-white p-4 sm:p-6 rounded-2xl shadow-md transition hover:shadow-lg"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              Factura #{factura.id}
            </h2>
            <div className="text-sm sm:text-base space-y-1">
              <p>
                <strong className="text-blue-600">Fecha:</strong>{" "}
                {new Date(factura.fecha_pago).toLocaleString()}
              </p>
              <p>
                <strong className="text-blue-600">Usuario ID:</strong>{" "}
                {factura.id_usuario}
              </p>
              <p>
                <strong className="text-blue-600">Valor total:</strong>{" "}
                <span className="text-green-600 font-bold">${factura.valor}</span>
              </p>
              <p>
                <strong className="text-blue-600">Descuento:</strong> {factura.descuento}%
              </p>
            </div>

            <h3 className="mt-4 font-semibold text-gray-700 text-sm sm:text-base">
              🛍 Productos:
            </h3>
            <ul className="ml-5 mt-2 list-disc text-sm sm:text-base space-y-1">
              {Array.isArray(factura.contenido_factura) ? (
                factura.contenido_factura.map((item, i) => (
                  <li key={i}>
                    {item.nombre_producto} - Talla:{" "}
                    <span className="text-blue-500">{item.talla}</span>, Cantidad:{" "}
                    <span className="text-green-600">{item.cantidad}</span>, Color:{" "}
                    <span className="text-pink-500">{item.color}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400">Sin productos asociados</li>
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
