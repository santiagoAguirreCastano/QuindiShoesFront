import React, { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export const HistorialFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [facturaActivaId, setFacturaActivaId] = useState(null);

  // Filtros
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroUsuarioId, setFiltroUsuarioId] = useState('');
  const [orden, setOrden] = useState('relevancia');

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const facturasPorPagina = 10;

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const res = await fetch("http://localhost:3000/producto/facturas");
        const data = await res.json();
        const formateadas = data.map(f => ({
          ...f,
          contenido_factura: typeof f.contenido_factura === 'string' ? JSON.parse(f.contenido_factura) : f.contenido_factura,
        }));
        setFacturas(formateadas);
      } catch (error) {
        console.error("Error al obtener facturas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFacturas();
  }, []);

  const toggleFactura = (id) => {
    setFacturaActivaId(prev => (prev === id ? null : id));
  };

  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(Math.max(1, Math.min(nuevaPagina, totalPaginas)));
  };

  const facturasFiltradas = facturas
    .filter(f => {
      const coincideUsuario = !filtroUsuarioId || f.id_usuario === parseInt(filtroUsuarioId);
      const coincideFecha = !filtroFecha || new Date(f.fecha_pago).toISOString().slice(0, 10) === filtroFecha;
      return coincideUsuario && coincideFecha;
    })
    .sort((a, b) => {
      switch (orden) {
        case 'fecha_desc':
          return new Date(b.fecha_pago) - new Date(a.fecha_pago);
        case 'fecha_asc':
          return new Date(a.fecha_pago) - new Date(b.fecha_pago);
        case 'valor_desc':
          return b.valor - a.valor;
        case 'valor_asc':
          return a.valor - b.valor;
        default:
          return 0;
      }
    });

  const totalPaginas = Math.ceil(facturasFiltradas.length / facturasPorPagina);
  const indiceInicio = (paginaActual - 1) * facturasPorPagina;
  const facturasMostradas = facturasFiltradas.slice(indiceInicio, indiceInicio + facturasPorPagina);

  if (loading) return <div className="text-center mt-10 text-blue-400 font-semibold text-lg animate-pulse">Cargando historial... un momento por favor.</div>;

  return (
  <div className="relative z-10 py-8 px-2 sm:px-4 md:px-6 lg:px-8">
    <div className="max-w-6xl mx-auto bg-white bg-opacity-90 shadow-xl rounded-3xl p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-blue-700 mb-6 sm:mb-10">
        📊 Tu Historial de Ventas 📊
      </h2>

      {/* FILTROS */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 sm:p-6 rounded-2xl border border-blue-100 mb-8 sm:mb-10 shadow-md">
        <h3 className="text-lg sm:text-xl font-semibold text-blue-700 mb-4">
          🎯 Filtros de búsqueda
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Filtro Usuario */}
          <div>
            <label htmlFor="filtroUsuario" className="block text-sm font-medium text-blue-700 mb-1">
              Usuario ID
            </label>
            <input
              id="filtroUsuario"
              type="number"
              value={filtroUsuarioId}
              onChange={(e) => setFiltroUsuarioId(e.target.value)}
              placeholder="Ej: 103"
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Filtro Fecha */}
          <div>
            <label htmlFor="filtroFecha" className="block text-sm font-medium text-blue-700 mb-1">
              Fecha exacta
            </label>
            <input
              id="filtroFecha"
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Ordenar */}
          <div>
            <label htmlFor="orden" className="block text-sm font-medium text-blue-700 mb-1">
              Ordenar por
            </label>
            <select
              id="orden"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="relevancia">Relevancia</option>
              <option value="valor_desc">Mayor valor</option>
              <option value="valor_asc">Menor valor</option>
              <option value="fecha_desc">Fecha más reciente</option>
              <option value="fecha_asc">Fecha más antigua</option>
            </select>
          </div>
        </div>
      </div>

      {facturasMostradas.length === 0 ? (
        <div className="text-center text-gray-600 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-base sm:text-lg md:text-xl mb-2">No se encontraron registros con esos filtros.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6 sm:space-y-8">
            {facturasMostradas.map((factura) => {
              const activa = facturaActivaId === factura.id;
              return (
                <div
                  key={factura.id}
                  className="bg-gradient-to-r from-blue-100 to-green-100 border border-blue-200 rounded-2xl p-4 sm:p-6 shadow-md cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => toggleFactura(factura.id)}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="w-full sm:w-auto">
                      <p className="font-bold text-lg sm:text-xl text-blue-800 mb-1 sm:mb-2">Factura #{factura.id}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-700">
                        <p><span className="font-semibold text-blue-700">Valor Total:</span> <span className="text-green-600 font-bold text-base">${factura.valor}</span></p>
                        <p><span className="font-semibold text-blue-700">Método de Pago:</span> {factura.metodo_pago}</p>
                        <p><span className="font-semibold text-blue-700">Moneda:</span> {factura.moneda}</p>
                        <p><span className="font-semibold text-blue-700">ID Transacción:</span> {factura.transaction_id || 'N/A'}</p>
                        <p><span className="font-semibold text-blue-700">ID Usuario:</span> <span className="text-purple-600 font-bold">{factura.id_usuario}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full font-semibold shadow-sm ${
                        factura.estado === 'Aceptada' ? 'bg-green-200 text-green-700'
                        : factura.estado === 'Rechazada' ? 'bg-red-200 text-red-700'
                        : 'bg-yellow-200 text-yellow-700'
                      }`}>
                        {factura.estado}
                      </span>
                      <ChevronDownIcon
                        className={`w-5 sm:w-6 h-5 sm:h-6 text-blue-500 transition-transform ${activa ? 'rotate-180' : 'rotate-0'}`}
                      />
                    </div>
                  </div>

                  {/* Contenido expandido */}
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activa ? 'max-h-[1000px] opacity-100 mt-4 sm:mt-6' : 'max-h-0 opacity-0'}`}>
                    <h3 className="text-base sm:text-lg font-semibold text-green-600 mb-3 border-b border-green-200 pb-2">Productos Comprados:</h3>
                    <div className="space-y-3">
                      {Array.isArray(factura.contenido_factura) && factura.contenido_factura.map((item, i) => (
                        <div key={i} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3 sm:gap-4">
                            {item.imagen && (
                              <img
                                src={item.imagen}
                                alt={item.nombre_producto}
                                className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-lg border border-blue-100"
                              />
                            )}
                            <div>
                              <p className="text-gray-900 font-semibold text-base sm:text-lg">{item.nombre_producto}</p>
                              <p className="text-sm text-gray-500">Talla: <span className="font-medium text-blue-500">{item.talla}</span> | Cantidad: <span className="font-medium text-green-500">{item.cantidad}</span></p>
                            </div>
                          </div>
                          <p className="text-green-600 font-bold text-base sm:text-lg">${item.precio_producto}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginador */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 text-sm sm:text-base font-medium">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className={`px-4 py-2 rounded-full ${paginaActual === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-100 hover:bg-blue-200 text-blue-600'}`}
            >
              ← Anterior
            </button>
            <span className="text-blue-800">Página {paginaActual} de {totalPaginas}</span>
            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className={`px-4 py-2 rounded-full ${paginaActual === totalPaginas ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-100 hover:bg-blue-200 text-blue-600'}`}
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);

};
