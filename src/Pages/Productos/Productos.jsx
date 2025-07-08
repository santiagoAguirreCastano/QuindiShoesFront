import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axion";
import { FaEdit, FaTrash, FaPlus, FaPalette, FaCubes, FaList } from "react-icons/fa";
import ModalActualizarProducto from "./Modal/ModalActualizarProducto";
import { NewProductForm } from "../../Components/NewProductForm/NewProductForm";
import Swal from "sweetalert2";
import { FiltrosProducto } from "../../Components/FiltrosProducto/FiltrosProducto";
import { useNavigate } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import { ParticlesBackground } from "../../Components/Particulas/ParticlesBackground";
import VisorModeloGLB from "../../Components/VisorModeloGLB/VisorModeloGLB";
import { ColorNewForm } from "../../Components/ColorNewForm/ColorNewForm";

// CRUD de colores estilizado
const CrudColores = ({ colores, onActualizar, onEliminar }) => (
  <div className="bg-white rounded-2xl shadow-lg px-4 py-6 sm:p-6 md:p-8 mb-8 border border-pink-100 w-full">
    <h3 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 text-pink-700 justify-center sm:justify-start">
      <FaList /> CRUD de Colores
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {colores.map((color) => (
        <div
          key={color.id_color}
          className="flex flex-col sm:flex-row sm:items-center items-start gap-3 bg-gradient-to-tr from-pink-50 to-white p-4 rounded-xl shadow hover:shadow-lg transition"
        >
          <span
            className="inline-block w-10 h-10 rounded-full border-2 border-pink-200 shadow"
            style={{ backgroundColor: color.codigo_hex }}
            title={color.color}
          />
          <span className="font-semibold text-sm sm:text-base text-gray-700 text-left">
            {color.color}
          </span>
          <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
            <button
              className="w-full sm:w-auto flex-1 sm:flex-none px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs font-semibold shadow text-center"
              onClick={() => onActualizar(color)}
              title="Actualizar"
            >
              <FaEdit />
            </button>
            <button
              className="w-full sm:w-auto flex-1 sm:flex-none px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xs font-semibold shadow text-center"
              onClick={() => onEliminar(color.id_color)}
              title="Eliminar"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);



// Top colores más usados estilizado tipo podio
const TopColores = ({ colores }) => {
  if (!colores || colores.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-8 border border-indigo-100 w-full">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 text-indigo-700 justify-center sm:justify-start">
          <FaPalette /> Top colores más usados
        </h3>
        <span className="text-gray-500 text-center block">No hay datos aún.</span>
      </div>
    );
  }

  const podio = colores.slice(0, 3);
  const resto = colores.slice(3);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-8 border border-indigo-100 w-full">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 text-indigo-700 justify-center sm:justify-start">
        <FaPalette /> Top colores más usados
      </h3>

      {/* Podio */}
      <div className="flex flex-col md:flex-row justify-center items-center md:items-end gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Segundo lugar */}
        {podio[1] && (
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-lg font-bold text-gray-500 mb-1">2°</span>
            <span
              className="inline-block w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-indigo-300 shadow-lg mb-2"
              style={{ backgroundColor: podio[1].codigo_hex }}
              title={podio[1].color}
            />
            <span className="font-semibold text-indigo-700 text-sm sm:text-base">{podio[1].color}</span>
            <span className="text-xs text-gray-500">{podio[1].usos} usos</span>
          </div>
        )}

        {/* Primer lugar */}
        {podio[0] && (
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-extrabold text-yellow-500 mb-1">1°</span>
            <span
              className="inline-block w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-yellow-400 shadow-2xl mb-2"
              style={{ backgroundColor: podio[0].codigo_hex }}
              title={podio[0].color}
            />
            <span className="font-bold text-yellow-600 text-sm sm:text-base">{podio[0].color}</span>
            <span className="text-xs text-gray-500">{podio[0].usos} usos</span>
          </div>
        )}

        {/* Tercer lugar */}
        {podio[2] && (
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-lg font-bold text-gray-500 mb-1">3°</span>
            <span
              className="inline-block w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-orange-400 shadow-lg mb-2"
              style={{ backgroundColor: podio[2].codigo_hex }}
              title={podio[2].color}
            />
            <span className="font-semibold text-orange-700 text-sm sm:text-base">{podio[2].color}</span>
            <span className="text-xs text-gray-500">{podio[2].usos} usos</span>
          </div>
        )}
      </div>

      {/* Resto de colores */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
        {resto.map((color) => (
          <div
            key={color.id_color}
            className="flex flex-col items-center gap-1 bg-indigo-50 px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow border border-indigo-200 w-full max-w-[120px]"
          >
            <span
              className="inline-block w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-indigo-300 shadow"
              style={{ backgroundColor: color.codigo_hex }}
              title={color.color}
            />
            <span className="font-semibold text-indigo-700 text-xs sm:text-sm text-center">{color.color}</span>
            <span className="text-[10px] sm:text-xs text-gray-500 text-center">{color.usos} usos</span>
          </div>
        ))}
      </div>
    </div>
  );
};


// Modelos 3D guardados
const ModelosGuardados = ({ modelos }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6 w-full">
    <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 text-green-700 justify-center sm:justify-start">
      <FaCubes /> Modelos 3D guardados por usuarios
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {modelos.length === 0 ? (
        <span className="text-gray-500 text-center col-span-full">No hay modelos guardados.</span>
      ) : (
        modelos.map((modelo) => (
          <div
            key={modelo.id}
            className="bg-gray-50 rounded-xl p-3 sm:p-4 shadow flex flex-col w-full max-w-[320px] mx-auto"
          >
            <VisorModeloGLB
              url={`http://localhost:3000/personalizacion/modelo/${modelo.id}`}
            />
            {modelo.fecha && (
              <p className="mt-2 text-[11px] sm:text-xs text-gray-400">
                {new Date(modelo.fecha).toLocaleDateString()}
              </p>
            )}
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-[11px] sm:text-xs text-indigo-600 font-semibold flex items-center">
                <FaCubes className="inline mr-1" />
                {modelo.nombre_usuario || "Usuario desconocido"}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400">ID: {modelo.id_usuario}</span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);


const ProductoCard = ({ producto, onDelete, onUpdate, onTogglePersonalizacion, onToggleActivo }) => {

  const navigate = useNavigate();
  const BASE_URL = "http://localhost:3000";

  const handleCardClick = (e) => {
    if (e.target.closest("button")) return;
    navigate(`/producto/${producto.id_producto}/variantes`);
  };

  const imagenPrincipal =
    producto.imagenes?.[0]?.startsWith("/")
      ? BASE_URL + producto.imagenes[0]
      : producto.imagenes?.[0] || "https://via.placeholder.com/300x200?text=Sin+Imagen";

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className="rounded-2xl p-4 sm:p-5 bg-gradient-to-tr from-white to-pink-50 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer w-full max-w-[360px] mx-auto flex flex-col"
    >
      <img
        src={imagenPrincipal}
        alt={producto.nombre_producto}
        className="w-full h-40 sm:h-48 object-contain rounded-xl mb-3"
      />

      <h3 className="text-base sm:text-lg font-semibold text-pink-600 mb-1 truncate">
        {producto.nombre_producto}
      </h3>
      <p className="text-sm text-gray-500">Tipo: {producto.tipo_producto}</p>
      <p className="text-sm text-gray-500 mb-1">Género: {producto.genero_producto}</p>
      <p className="text-sm sm:text-md text-emerald-600 font-semibold mb-2">
        ${producto.precio_producto.toLocaleString("es-CO")}
      </p>

      {/* Botones estado/personalización */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-1">
        <button
          onClick={() => onTogglePersonalizacion(producto)}
          className={`w-full sm:w-auto px-3 py-1 rounded-full text-xs font-semibold shadow transition text-center ${
            producto.personalizacion_activa
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {producto.personalizacion_activa ? "Personalización Activada" : "Activar Personalización"}
        </button>
        <button
          onClick={() => onToggleActivo(producto)}
          className={`w-full sm:w-auto px-3 py-1 rounded-full text-xs font-semibold shadow transition text-center ${
            producto.activo == 1 ? "bg-green-600 text-white" : "bg-gray-400 text-white"
          }`}
        >
          {producto.activo == 1 ? "Activo" : "Inactivo"}
        </button>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdate();
          }}
          className="flex items-center justify-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm rounded-full shadow-sm w-full sm:w-auto"
        >
          <FaEdit /> Actualizar
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex items-center justify-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm rounded-full shadow-sm w-full sm:w-auto"
        >
          <FaTrash /> Eliminar
        </button>
      </div>
    </motion.div>
  );
};



export const ListaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [productoEditar, setProductoEditar] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [filtros, setFiltros] = useState({});
  const [seccion, setSeccion] = useState("productos");

  // Personalización
  const [colores, setColores] = useState([]);
  const [topColores, setTopColores] = useState([]);
  const [modelos, setModelos] = useState([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    if (seccion === "personalizacion") {
      cargarColores();
      cargarTopColores();
      cargarModelos();
    }
  }, [seccion]);

  // GET /producto
  const cargarProductos = () => {
    const token = localStorage.getItem("token");
    axiosClient
      .get("/producto", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al cargar productos:", err));
  };

  // GET /color
  const cargarColores = () => {
    axiosClient
      .get("/color")
      .then((res) => {
        const colores = res.data.map(c => ({
          id_color: c.id_color,
          color: c.nombre_color,
          codigo_hex: c.codigo_hax
        }));
        setColores(colores);
      })
      .catch(() => setColores([]));
  };

  // GET /color/top-usados
  const cargarTopColores = () => {
    axiosClient
      .get("/color/top-usados")
      .then((res) => {
        const topColores = res.data
          .map(c => ({
            id_color: c.id_color,
            color: c.nombre_color,
            codigo_hex: c.codigo_hax,
            usos: c.usos // <-- aquí el cambio
          }))
          .sort((a, b) => b.usos - a.usos); // Ordena de mayor a menor
        setTopColores(topColores);
      })
      .catch(() => setTopColores([]));
  };

  // GET /personalizacion/modelos
  const cargarModelos = () => {
    axiosClient
      .get("/personalizacion/modelos")
      .then((res) => setModelos(res.data))
      .catch(() => setModelos([]));
  };

  // DELETE /color/:id
  const handleEliminarColor = async (id_color) => {
    try {
      await axiosClient.delete(`/color/${id_color}`);
      setColores((prev) => prev.filter((c) => c.id_color !== id_color));
      cargarTopColores(); // <-- Recarga el top colores después de eliminar
      Swal.fire({ icon: "success", title: "Color eliminado", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error al eliminar color" });
    }
  };

  // PUT /color/:id
  const handleActualizarColor = (color) => {
    Swal.fire({
      title: `<span class="font-bold text-pink-700">Actualizar color</span>`,
      html: `
      <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" value="${color.color}" style="font-size:1.1rem; border-radius:0.75rem; border:2px solid #f472b6; margin-bottom:1rem;" />
      <div style="display:flex;justify-content:center;">
        <input id="swal-input-hex" class="swal2-input" type="color" value="${color.codigo_hex}" style="width:4rem;height:3rem;border-radius:1rem;border:2px solid #818cf8;background:#fff;padding:0;box-shadow:0 1px 6px #818cf855;margin-bottom:0;" />
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "rounded-2xl p-6",
        title: "text-2xl font-bold mb-4 flex items-center justify-center gap-2 text-pink-700",
        confirmButton: "bg-pink-600 text-white px-6 py-2 rounded-lg mx-2 font-semibold shadow hover:bg-pink-700 transition",
        cancelButton: "bg-gray-200 text-gray-700 px-6 py-2 rounded-lg mx-2 font-semibold shadow hover:bg-gray-300 transition",
      },
      buttonsStyling: false,
      preConfirm: () => {
        const nuevoNombre = document.getElementById("swal-input-nombre").value;
        const nuevoHex = document.getElementById("swal-input-hex").value;
        if (!nuevoNombre || !nuevoHex) {
          Swal.showValidationMessage("Debes ingresar nombre y color");
          return false;
        }
        return { nuevoNombre, nuevoHex };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        axiosClient
          .put(`/color/${color.id_color}`, {
            nombreColor: result.value.nuevoNombre,
            codigoHax: result.value.nuevoHex,
          })
          .then(() => {
            cargarColores();
            cargarTopColores();
            Swal.fire({
              icon: "success",
              title: "Color actualizado",
              timer: 1200,
              showConfirmButton: false,
              customClass: { popup: "rounded-xl" },
            });
          })
          .catch(() =>
            Swal.fire({
              icon: "error",
              title: "Error al actualizar color",
              customClass: { popup: "rounded-xl" },
            })
          );
      }
    });
  };

  const handleEliminar = (idProducto) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El producto se eliminará permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        axiosClient
          .delete(`/producto/${idProducto}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            setProductos(productos.filter((p) => p.id_producto !== idProducto));
            Swal.fire({
              icon: "success",
              title: "Eliminado",
              text: "El producto ha sido eliminado.",
              timer: 1200,
              showConfirmButton: false,
            });
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo eliminar el producto.",
            });
          });
      }
    });
  };

  const handleActualizar = (producto) => {
    setProductoEditar(producto);
    setMostrarModalEditar(true);
  };

  const filtrarProductos = (productos, filtros) => {
    return productos.filter((producto) => {
      if (
        filtros.nombre &&
        !producto.nombre_producto.toLowerCase().includes(filtros.nombre.toLowerCase())
      )
        return false;
      if (
        filtros.tipo &&
        producto.tipo_producto.trim().toLowerCase() !== filtros.tipo.trim().toLowerCase()
      )
        return false;
      if (
        filtros.genero &&
        producto.genero_producto.trim().toLowerCase() !== filtros.genero.trim().toLowerCase()
      )
        return false;
      return true;
    });
  };

  const productosFiltrados = filtrarProductos(productos, filtros);
  const productosPersonalizables = productos.filter(p => p.personalizacion_activa === 1);
  const productosActivos = productosFiltrados.filter(p => Number(p.activo) === 1);
  const productosInactivos = productosFiltrados.filter(p => Number(p.activo) === 0);


  // PUT /producto/:id/personalizacion
  const handleTogglePersonalizacion = async (producto) => {
    try {
      const token = localStorage.getItem("token");
      const nuevoEstado = producto.personalizacion_activa ? 0 : 1;
      await axiosClient.put(
        `/producto/${producto.id_producto}/personalizacion`,
        { personalizacion_activa: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProductos((prev) =>
        prev.map((p) =>
          p.id_producto === producto.id_producto
            ? { ...p, personalizacion_activa: nuevoEstado }
            : p
        )
      );
    } catch {
      alert("Error al actualizar la personalización");
    }
  };

  const handleToggleActivo = async (producto) => {
    try {
      const token = localStorage.getItem("token");
      const nuevoEstado = Number(producto.activo) === 1 ? 0 : 1;
      console.log("🔄 Cambiando estado a:", nuevoEstado);
      await axiosClient.put(
        `/producto/${producto.id_producto}/activo`,
        { activo: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProductos((prev) =>
        prev.map((p) =>
          p.id_producto === producto.id_producto
            ? { ...p, activo: nuevoEstado }
            : p
        )
      );
    } catch {
      Swal.fire({ icon: "error", title: "Error al cambiar estado del producto" });
    }
  };

  return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen relative py-12 px-4 sm:px-8 overflow-hidden"
  >
    <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl p-6 sm:p-10">
      {/* Botones para cambiar de sección */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center sm:justify-start">
        <button
          className={`px-6 py-2 rounded-full font-bold shadow transition-all flex items-center gap-2 ${seccion === "productos"
            ? "bg-pink-500 text-white scale-105"
            : "bg-white text-pink-600 border border-pink-300 hover:bg-pink-100"
            }`}
          onClick={() => setSeccion("productos")}
        >
          <FaPlus /> Productos
        </button>
        <button
          className={`px-6 py-2 rounded-full font-bold shadow transition-all flex items-center gap-2 ${seccion === "inactivos"
            ? "bg-gray-700 text-white scale-105"
            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          onClick={() => setSeccion("inactivos")}
        >
          💤 Inactivos
        </button>
        <button
          className={`px-6 py-2 rounded-full font-bold shadow transition-all flex items-center gap-2 ${seccion === "personalizacion"
            ? "bg-indigo-600 text-white scale-105"
            : "bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-100"
            }`}
          onClick={() => setSeccion("personalizacion")}
        >
          <FaPalette /> Personalización
        </button>
      </div>

      {/* Sección productos */}
      {seccion === "productos" && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-pink-600 text-center sm:text-left">Productos Disponibles</h2>
            <button
              onClick={() => setMostrarModalAgregar(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all shadow-md"
            >
              <FaPlus /> Nuevo Producto
            </button>
          </div>

          <FiltrosProducto onFiltrar={setFiltros} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

            {productosActivos.map((producto) => (
              <ProductoCard
                key={producto.id_producto}
                producto={producto}
                onDelete={() => handleEliminar(producto.id_producto)}
                onUpdate={() => handleActualizar(producto)}
                onTogglePersonalizacion={handleTogglePersonalizacion}
                onToggleActivo={handleToggleActivo}
              />
            ))}
          </div>
        </>
      )}

      {/* Sección personalización */}
      {seccion === "personalizacion" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
              <FaPalette /> Productos Personalizables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosPersonalizables.length === 0 ? (
                <span className="text-gray-500">No hay productos personalizables.</span>
              ) : (
                productosPersonalizables.map((producto) => (
                  <div key={producto.id_producto} className="bg-pink-50 rounded-xl p-4 shadow">
                    <img
                      src={
                        producto.imagenes?.[0]?.startsWith("/")
                          ? "http://localhost:3000" + producto.imagenes[0]
                          : producto.imagenes?.[0] || "https://via.placeholder.com/300x200?text=Sin+Imagen"
                      }
                      alt={producto.nombre_producto}
                      className="w-full h-40 object-contain rounded-lg mb-2"
                    />
                    <h4 className="font-bold text-pink-700">{producto.nombre_producto}</h4>
                    <p className="text-sm text-gray-500">{producto.tipo_producto}</p>
                    <p className="text-md text-emerald-600 font-semibold">
                      ${producto.precio_producto?.toLocaleString("es-CO")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <ColorNewForm onColorGuardado={() => { cargarColores(); cargarTopColores(); }} />

          <CrudColores
            colores={colores}
            onActualizar={handleActualizarColor}
            onEliminar={handleEliminarColor}
          />

          <TopColores colores={topColores} />

          <ModelosGuardados modelos={modelos} />
        </motion.div>
      )}

      {/* Sección inactivos */}
      {seccion === "inactivos" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-700">Productos Inactivos</h2>
          </div>

          {productosInactivos.length === 0 ? (
            <div className="text-gray-500 text-center mt-10">No hay productos inactivos.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
              {productosInactivos.map((producto) => (
                <ProductoCard
                  key={producto.id_producto}
                  producto={producto}
                  onDelete={() => handleEliminar(producto.id_producto)}
                  onUpdate={() => handleActualizar(producto)}
                  onTogglePersonalizacion={handleTogglePersonalizacion}
                  onToggleActivo={handleToggleActivo}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}

        {/* Sección personalización */}
        {seccion === "personalizacion" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
                <FaPalette /> Productos Personalizables
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {productosPersonalizables.length === 0 ? (
                  <span className="text-gray-500">No hay productos personalizables.</span>
                ) : (
                  productosPersonalizables.map((producto) => (
                    <div key={producto.id_producto} className="bg-pink-50 rounded-xl p-4 shadow">
                      <img
                        src={
                          producto.imagenes?.[0]?.startsWith("/")
                            ? "http://localhost:3000" + producto.imagenes[0]
                            : producto.imagenes?.[0] || "https://via.placeholder.com/300x200?text=Sin+Imagen"
                        }
                        alt={producto.nombre_producto}
                        className="w-full h-40 object-contain rounded-lg mb-2"
                      />
                      <h4 className="font-bold text-pink-700">{producto.nombre_producto}</h4>
                      <p className="text-sm text-gray-500">{producto.tipo_producto}</p>
                      <p className="text-md text-emerald-600 font-semibold">
                        ${producto.precio_producto?.toLocaleString("es-CO")}
                      </p>
                    </div>
                  ))
                )}
              </div>
      {/* Modal Editar */}
      <AnimatePresence>
        {mostrarModalEditar && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
              <button
                aria-label="Cerrar modal"
                onClick={() => setMostrarModalEditar(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                ×
              </button>
              <ModalActualizarProducto
                producto={productoEditar}
                onClose={() => setMostrarModalEditar(false)}
                onActualizar={cargarProductos}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Agregar */}
      <AnimatePresence>
        {mostrarModalAgregar && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
              <button
                aria-label="Cerrar modal"
                onClick={() => setMostrarModalAgregar(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                ×
              </button>
              <NewProductForm
                onClose={() => {
                  setMostrarModalAgregar(false);
                  cargarProductos();
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
);
}
