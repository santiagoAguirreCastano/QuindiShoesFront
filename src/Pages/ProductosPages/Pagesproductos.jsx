import React, { useEffect, useState } from 'react';
import { MostrarProducto } from '../../Components/CartaProducto/CartaProducto';
import axiosClient from '../../api/axion';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticlesBackground } from '../../Components/Particulas/ParticlesBackground';

export const Pagesproductos = () => {
  const [productos, setProductos] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const [filtros, setFiltros] = useState({
    nombre: '',
    color: '',
    precioMax: '',
    genero: '',
    tipo: '',
    ordenar: '',
  });

  const obtenerProductosFiltrados = async () => {
    try {
      const { data } = await axiosClient.get('/producto/filtrados', {
        params: filtros,
      });
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener productos filtrados:', error);
    }
  };

  useEffect(() => {
    obtenerProductosFiltrados();
  }, [filtros]);

  const productosActivos = productos.filter(producto => producto.activo === 1 || producto.activo === '1' || producto.activo === true);


  const colores = [
    { nombre: 'Negro', hex: 'bg-black' },
    { nombre: 'Gris', hex: 'bg-gray-600' },
    { nombre: 'Rojo', hex: 'bg-red-500' },
    { nombre: 'Verde Oscuro', hex: 'bg-green-500' },
    { nombre: 'Azul', hex: 'bg-blue-500' },
    { nombre: 'Morado', hex: 'bg-violet-600' },
    { nombre: 'Rosa', hex: 'bg-pink-400' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticlesBackground />
      <div className="flex flex-col lg:flex-row p-6 gap-6 relative z-10">

        {/* Panel de filtros */}
        <motion.div
          key="contenedor-filtros"
          initial={{ height: 'auto' }}
          animate={{ height: mostrarFiltros ? 'auto' : 'min-content' }}
          transition={{ duration: 0.4 }}
          className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg overflow-hidden"
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Filtrar productos</h2>
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className={`px-3 py-1 rounded-full shadow-sm transition-all text-sm font-medium ${mostrarFiltros ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {mostrarFiltros ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            <input
              type="text"
              placeholder="Buscar productos..."
              value={filtros.nombre}
              onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <AnimatePresence>
              {mostrarFiltros && (
                <motion.div
                  key="filtros"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-1 text-gray-700">Colores</p>
                    <div className="flex gap-2 flex-wrap">
                      {colores.map((color) => (
                        <div
                          key={color.nombre}
                          className={`w-6 h-6 rounded-full ${color.hex} border-2 ${filtros.color === color.nombre ? 'border-black' : 'border-white'} shadow-md cursor-pointer`}
                          onClick={() => setFiltros((prev) => ({
                            ...prev,
                            color: prev.color === color.nombre ? '' : color.nombre,
                          }))}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-1 text-gray-700">Precio máximo</p>
                    <input
                      type="range"
                      min={0}
                      max={1000000}
                      value={filtros.precioMax || 1000000}
                      onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Hasta: ${filtros.precioMax || '1.000.000'}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-1 text-gray-700">Género</p>
                    <select
                      className="w-full px-3 py-2 border rounded-lg"
                      value={filtros.genero}
                      onChange={(e) => setFiltros({ ...filtros, genero: e.target.value })}
                    >
                      <option value="">Todos</option>
                      <option value="Hombre">Hombre</option>
                      <option value="Mujer">Mujer</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-1 text-gray-700">Tipo de calzado</p>
                    <select
                      className="w-full px-3 py-2 border rounded-lg"
                      value={filtros.tipo}
                      onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                    >
                      <option value="">Todos</option>
                      <option value="Tenis">Tenis</option>
                      <option value="Sandalias">Sandalias</option>
                      <option value="Botas">Botas</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-1 text-gray-700">Ordenar por</p>
                    <select
                      className="w-full px-3 py-2 border rounded-lg"
                      value={filtros.ordenar}
                      onChange={(e) => setFiltros({ ...filtros, ordenar: e.target.value })}
                    >
                      <option value="">Sin ordenar</option>
                      <option value="precioAsc">Precio: menor a mayor</option>
                      <option value="precioDesc">Precio: mayor a menor</option>
                      <option value="nombreAsc">Nombre: A-Z</option>
                      <option value="nombreDesc">Nombre: Z-A</option>
                    </select>
                  </div>

                  <button
                    className="mt-6 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg shadow transition text-sm"
                    onClick={() => setFiltros({ nombre: '', color: '', precioMax: '', genero: '', tipo: '', ordenar: '' })}
                  >
                    Restablecer filtros
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Sección de productos */}
        <div className="flex-1">
          {productosActivos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full mt-20 text-gray-600 animate-fade-in">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="No productos"
                className="w-32 h-32 mb-4 opacity-70"
              />
              <h3 className="text-xl font-semibold mb-2">¡Ups! No encontramos ningún producto</h3>
              <p className="text-sm text-center max-w-md px-4">
                Intenta modificar los filtros o busca otro nombre.
              </p>
              <button
                className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition"
                onClick={() => setFiltros({ nombre: '', color: '', precioMax: '', genero: '', tipo: '', ordenar: '' })}
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
           <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-6">
  <MostrarProducto productosProp={productosActivos} />
</div>

          )}
        </div>
      </div>
    </div>
  );
};
