import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axion";
import { ReservaSwitch } from "../ReservaSwitch/ReservaSwitch";
import { ParticlesBackground } from "../Particulas/ParticlesBackground";

export const ReservasPanel = () => {
  const [productos, setProductos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [tab, setTab] = useState("productos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductos();
    cargarReservas();
  }, []);

  const cargarProductos = () => {
    setLoading(true);
    axiosClient.get("/producto")
      .then(res => setProductos(res.data))
      .finally(() => setLoading(false));
  };

  // Cambia la URL a "/reservas" si tu endpoint es así
  const cargarReservas = () => {
    axiosClient.get("/reservas")
      .then(res => setReservas(res.data))
      .catch(() => setReservas([]));
  };

  return (
    <div className="relative min-h-fit p-6 bg-gradient-to-br from-green-50 via-pink-50 to-green-100 rounded-2xl shadow-xl overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <ParticlesBackground />
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-pink-500 drop-shadow">Gestión de Reservas</h2>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-full font-semibold transition ${tab === "productos" ? "bg-pink-400 text-white" : "bg-white text-pink-400 border border-pink-200"}`}
            onClick={() => setTab("productos")}
          >
            Productos
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold transition ${tab === "reservas" ? "bg-green-400 text-white" : "bg-white text-green-400 border border-green-200"}`}
            onClick={() => setTab("reservas")}
          >
            Reservas realizadas
          </button>
        </div>
      </div>

      {tab === "productos" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map(producto => (
            <div key={producto.id_producto} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-pink-100">
              <img
                src={producto.imagenes?.[0] || "https://via.placeholder.com/200x150?text=Sin+Imagen"}
                alt={producto.nombre_producto}
                className="w-40 h-32 object-contain rounded-xl mb-4"
              />
              <h3 className="text-lg font-bold mb-2 text-pink-700">{producto.nombre_producto}</h3>
              <ReservaSwitch
                id_producto={producto.id_producto}
                reserva_activa={!!producto.reserva_activa}
                onChange={(nuevoEstado) => {
                  setProductos(prev =>
                    prev.map(p =>
                      p.id_producto === producto.id_producto
                        ? { ...p, reserva_activa: !p.reserva_activa }
                        : p
                    )
                  );
                }}
              />
            </div>
          ))}
        </div>
      )}

      {tab === "reservas" && (
        <div className="bg-white/80 rounded-2xl shadow-lg p-6 mt-4">
          <h3 className="text-xl font-bold text-green-600 mb-4">Reservas realizadas</h3>
          {reservas.length === 0 ? (
            <div className="text-center text-gray-400 py-10">No hay reservas registradas.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-100 text-green-700">
                  <th className="py-2 px-4 rounded-tl-xl">ID Reserva</th>
                  <th className="py-2 px-4">ID Producto</th>
                  <th className="py-2 px-4">ID Usuario</th>
                  <th className="py-2 px-4">Fecha</th>
                  <th className="py-2 px-4">Estado</th>
                  <th className="py-2 px-4">Monto</th>
                  <th className="py-2 px-4 rounded-tr-xl">Notificado</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map(reserva => (
                  <tr key={reserva.id_reserva}>
                    <td className="py-2 px-4">{reserva.id_reserva}</td>
                    <td className="py-2 px-4">{reserva.id_producto}</td>
                    <td className="py-2 px-4">{reserva.id_usuario}</td>
                    <td className="py-2 px-4">{new Date(reserva.fecha_reserva).toLocaleString()}</td>
                    <td className="py-2 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${reserva.estado === "Aceptada" ? "bg-green-200 text-green-700" : "bg-pink-200 text-pink-700"}`}>
                        {reserva.estado}
                      </span>
                    </td>
                    <td className="py-2 px-4">${Number(reserva.monto).toLocaleString()}</td>
                    <td className="py-2 px-4">{reserva.notificado ? "Sí" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};