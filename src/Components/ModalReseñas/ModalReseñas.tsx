import React, { useState, useEffect } from "react";
import { FormularioResena } from "../FormularioReseña/FormularioReseña";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

interface ModalProps {
  abierto: boolean;
  cerrar: () => void;
  usuario_id?: number;
}

export const ModalReseñas: React.FC<ModalProps> = ({ abierto, cerrar, usuario_id }) => {
  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .modal-fade-in {
            animation: fadeIn 0.3s ease-out;
          }
          .modal-slide-up {
            animation: slideUp 0.4s ease-out;
          }
        `}
      </style>

      {abierto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 modal-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-3xl border border-pink-200 space-y-6 relative modal-slide-up">
            <button
              onClick={cerrar}
              className="absolute top-4 right-5 text-xl text-pink-500 hover:text-pink-700"
            >
              ✖
            </button>
            <h2 className="text-3xl font-extrabold text-green-700 text-center">
              Reseñas de usuarios
            </h2>
            <ListaResenas usuario_id={usuario_id} />
          </div>
        </div>
      )}
    </>
  );
};

export const ListaResenas: React.FC<{ usuario_id?: number }> = ({ usuario_id }) => {
  const [resenas, setResenas] = useState<any[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mensajeEdit, setMensajeEdit] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [yaTieneResena, setYaTieneResena] = useState(false);

  useEffect(() => {
    axios.get("https://quindishoes-backend-def.onrender.com/resena/todas")
      .then((res) => {
        setResenas(res.data);
        const yaTiene = res.data.some((r: any) => r.id_usuario === usuario_id);
        setYaTieneResena(yaTiene);
      })
      .catch(() => setResenas([]));
  }, [usuario_id]);

  const showAlert = (tipo: "success" | "error", mensaje: string) => {
    Swal.fire({
      icon: tipo,
      title: mensaje,
      toast: true,
      position: "top-end",
      timer: 2200,
      timerProgressBar: true,
      showConfirmButton: false,
      background: tipo === "success" ? "#e6f4ea" : "#fde2e2",
      color: tipo === "success" ? "#2e7d32" : "#c62828",
    });
  };

  const handleEnviar = async () => {
    if (!usuario_id || !mensajeEdit.trim()) return showAlert("error", "Escribe algo primero.");

    try {
      const fecha_resena = new Date().toISOString().slice(0, 19).replace("T", " ");
      await axios.post("https://quindishoes-backend-def.onrender.com/resena/agregar", {
        resena: mensajeEdit,
        fecha_resena,
        id_usuario: usuario_id,
      });
      setResenas((prev) => [
        ...prev,
        {
          id_usuario: usuario_id,
          resena: mensajeEdit,
          nombre: "Tú",
          fecha_resena,
        },
      ]);
      setMensajeEdit("");
      setYaTieneResena(true);
      showAlert("success", "¡Reseña enviada!");
    } catch {
      showAlert("error", "Error al enviar reseña.");
    }
  };

  const handleEditar = (r: any) => {
    setEditandoId(r.id_usuario);
    setMensajeEdit(r.resena);
  };

  const handleGuardar = async (id_usuario: number) => {
    if (!mensajeEdit.trim()) return showAlert("error", "La reseña no puede estar vacía.");
    setEnviando(true);
    try {
      const fecha_resena = new Date().toISOString().slice(0, 19).replace("T", " ");
      await axios.put("https://quindishoes-backend-def.onrender.com/resena/editar", {
        resena: mensajeEdit,
        fecha_resena,
        id_usuario,
      });
      setResenas((prev) =>
        prev.map((r) =>
          r.id_usuario === id_usuario ? { ...r, resena: mensajeEdit, fecha_resena } : r
        )
      );
      setEditandoId(null);
      setMensajeEdit("");
      showAlert("success", "¡Reseña editada!");
    } catch {
      showAlert("error", "No se pudo editar la reseña.");
    }
    setEnviando(false);
  };

  const handleEliminar = async (id_usuario: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar reseña?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa"
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete("https://quindishoes-backend-def.onrender.com/resena/eliminar", {
        data: { id_usuario },
      });
      setResenas((prev) => prev.filter((r) => r.id_usuario !== id_usuario));
      setYaTieneResena(false);
      setMensajeEdit("");
      setEditandoId(null);
      showAlert("success", "Reseña eliminada.");
    } catch {
      showAlert("error", "Error al eliminar la reseña.");
    }
  };

  const handleCancelar = () => {
    setEditandoId(null);
    setMensajeEdit("");
  };

  return (
    <div className="mt-6">
      {!yaTieneResena && usuario_id && (
        <div className="mb-8">
          <FormularioResena mensaje={mensajeEdit} onChange={setMensajeEdit} />
          <button
            className="bg-pink-400 text-white px-6 py-2 mt-2 rounded-md hover:bg-pink-500 transition"
            onClick={handleEnviar}
          >
            Enviar reseña
          </button>
        </div>
      )}

      {yaTieneResena && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-md font-medium mb-6">
          Ya escribiste una reseña. Puedes editarla o eliminarla abajo.
        </div>
      )}

      {resenas.length === 0 ? (
        <div className="text-gray-400 italic">No hay reseñas aún.</div>
      ) : (
        <ul className="space-y-6 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-pink-50">
          {resenas.map((r) => (
            <li
              key={r.id_usuario}
              className="bg-white border border-pink-100 rounded-xl shadow-md hover:shadow-lg transition p-6 group"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-gradient-to-br from-pink-300 to-pink-100 text-pink-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner shrink-0">
                  {(r.nombre || "U")[0]?.toUpperCase()}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-pink-700">{r.nombre || "Usuario"}</span>
                    <span className="text-xs text-gray-400">
                      {r.fecha_resena && new Date(r.fecha_resena).toLocaleString()}
                    </span>
                  </div>

                  {editandoId === r.id_usuario ? (
                    <>
                      <FormularioResena mensaje={mensajeEdit} onChange={setMensajeEdit} />
                      <div className="flex gap-2 mt-2">
                        <button
                          className="bg-green-300 text-green-900 px-4 py-1 rounded hover:bg-green-400 font-semibold"
                          onClick={() => handleGuardar(r.id_usuario)}
                          disabled={enviando}
                        >
                          {enviando ? "Guardando..." : "Guardar"}
                        </button>
                        <button
                          className="bg-pink-200 text-pink-800 px-4 py-1 rounded hover:bg-pink-300 font-semibold"
                          onClick={handleCancelar}
                          disabled={enviando}
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {r.resena}
                      </p>

                      {usuario_id === r.id_usuario && (
                        <div className="flex gap-3 mt-3">
                          <button
                            className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded hover:bg-green-200 transition"
                            onClick={() => handleEditar(r)}
                          >
                            Editar
                          </button>
                          <button
                            className="text-sm text-pink-700 bg-pink-100 px-3 py-1 rounded hover:bg-pink-200 transition flex items-center gap-1"
                            onClick={() => handleEliminar(r.id_usuario)}
                          >
                            <FaTrash className="text-xs" /> Eliminar
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
