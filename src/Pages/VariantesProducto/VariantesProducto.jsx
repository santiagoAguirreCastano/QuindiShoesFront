import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../api/axion";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

export const VariantesProducto = () => {
  const { id } = useParams();
  const [variantes, setVariantes] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [colores, setColores] = useState([]);
  const [filtroTalla, setFiltroTalla] = useState("");
  const [filtroColor, setFiltroColor] = useState("");
  const [filtroStock, setFiltroStock] = useState("");
  // Estados para agregar color desde el modal de variante

  useEffect(() => {
    cargarVariantes();
    cargarTallas();
    cargarColores();
    // eslint-disable-next-line
  }, [id]);

  const cargarVariantes = () => {
    axiosClient
      .get(`/variantes/${id}`)
      .then((res) => setVariantes(res.data))
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Error al cargar variantes",
          text: err.message,
          confirmButtonColor: "#2563eb"
        });
      });
  };

  const cargarTallas = () => {
    axiosClient
      .get("/producto/tallas")
      .then((res) => {
        const tallasData = Array.isArray(res.data[0]) ? res.data[0] : res.data;
        setTallas(tallasData);
      })
      .catch(() => setTallas([]));
  };

  const cargarColores = () => {
    axiosClient
      .get("/producto/colores")
      .then((res) => {
        const coloresData = Array.isArray(res.data[0]) ? res.data[0] : res.data;
        setColores(coloresData);
      })
      .catch(() => setColores([]));
  };

  // (Eliminada función getSelectHTML porque no se utiliza)

  // Handler para agregar color desde el modal

  const handleDelete = (idVariante) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta variante se eliminará permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" }
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí iría la petición de borrado
        setVariantes(variantes.filter(v => v.id_variantes !== idVariante));
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "La variante ha sido eliminada.",
          timer: 1200,
          showConfirmButton: false
        });
        const token = localStorage.getItem("token");
        axiosClient
          .delete(`/variantes/${idVariante}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(() => {
            setVariantes(variantes.filter(v => v.id_variantes !== idVariante));
            Swal.fire({
              icon: "success",
              title: "Eliminado",
              text: "La variante ha sido eliminada.",
              timer: 1200,
              showConfirmButton: false,
              showClass: { popup: "animate__animated animate__fadeInDown" },
              hideClass: { popup: "animate__animated animate__fadeOutUp" }
            });
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo eliminar la variante.",
              confirmButtonColor: "#2563eb",
              showClass: { popup: "animate__animated animate__shakeX" }
            });
          });
      }
    });
  };
 const handleUpdate = (variante) => {
  Swal.fire({
    title: `<span class="text-pink-500 font-bold text-2xl">Editar Variante</span>`,
    html: `
      <div class="flex flex-col gap-6 items-center text-left min-w-[320px]">

        <!-- Chips de talla -->
        <div class="w-full">
          <label class="block font-semibold text-green-500 mb-2">Talla:</label>
          <div id="tallas-chips" class="flex flex-wrap gap-2">
            ${tallas
              .map(
                (t) => `
              <button 
                type="button" 
                class="chip-talla px-4 py-2 rounded-full border-2 border-green-300 bg-green-50 text-green-600 font-semibold hover:bg-green-100 transition"
                data-id="${t.id_talla}" 
                ${t.id_talla === variante.id_talla ? 'data-selected="true"' : ''}
              >
                ${t.talla}
              </button>
            `
              )
              .join("")}
          </div>
          <input type="hidden" id="id_talla" value="${variante.id_talla}" />
        </div>

        <!-- Círculos de color -->
        <div class="w-full">
          <label class="block font-semibold text-pink-400 mb-2">Color:</label>
          <div id="colores-circulos" class="flex flex-wrap gap-3">
            ${colores
              .map(
                (c) => `
              <div 
                class="color-circle w-9 h-9 rounded-full border-[2.5px] border-pink-300 shadow-md cursor-pointer transition-all" 
                title="${c.color} (${c.codigo_hex})" 
                style="background:${c.codigo_hex}" 
                data-id="${c.id_color}"
                ${c.id_color === variante.id_color ? 'data-selected="true"' : ''}
              ></div>
            `
              )
              .join("")}
          </div>
          <input type="hidden" id="id_color" value="${variante.id_color}" />
        </div>

        <!-- Campo Stock -->
        <div class="w-full">
          <label class="block font-semibold text-green-500 mb-2">Stock:</label>
          <input 
            id="stock" 
            type="number" 
            min="1" 
            value="${variante.stock}" 
            class="swal2-input w-full rounded-xl border-2 border-green-200 bg-green-50 placeholder:text-gray-400 text-green-700 font-bold focus:ring-2 focus:ring-green-300"
            placeholder="Stock"
          />
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Actualizar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#86efac",
    cancelButtonColor: "#fbcfe8",
    customClass: {
      popup: "rounded-3xl bg-white border border-pink-100 shadow-xl animate__animated animate__fadeInDown",
      confirmButton: "bg-green-300 hover:bg-green-400 text-white px-6 py-2 rounded-xl font-bold",
      cancelButton: "bg-pink-200 hover:bg-pink-300 text-pink-700 px-6 py-2 rounded-xl font-bold"
    },
    didOpen: () => {
      // Resaltar chip de talla actual
      const chips = document.querySelectorAll(".chip-talla");
      chips.forEach((chip) => {
        if (chip.dataset.selected === "true") {
          chip.classList.add("bg-green-400", "text-white");
        }

        chip.onclick = () => {
          chips.forEach((c) => {
            c.classList.remove("bg-green-400", "text-white");
            c.classList.add("bg-green-50", "text-green-600");
          });
          chip.classList.remove("bg-green-50", "text-green-600");
          chip.classList.add("bg-green-400", "text-white");
          document.getElementById("id_talla").value = chip.getAttribute("data-id");
        };
      });

      // Resaltar color actual
      const circles = document.querySelectorAll(".color-circle");
      circles.forEach((circle) => {
        if (circle.dataset.selected === "true") {
          circle.classList.add("outline", "outline-4", "outline-pink-300", "shadow-lg");
        }

        circle.onclick = () => {
          circles.forEach((c) =>
            c.classList.remove("outline", "outline-4", "outline-pink-300", "shadow-lg")
          );
          circle.classList.add("outline", "outline-4", "outline-pink-300", "shadow-lg");
          document.getElementById("id_color").value = circle.getAttribute("data-id");
        };
      });
    },
    preConfirm: () => {
      const id_talla = document.getElementById("id_talla").value.trim();
      const id_color = document.getElementById("id_color").value.trim();
      const stock = document.getElementById("stock").value.trim();

      if (!id_talla || !id_color || !stock || isNaN(stock) || Number(stock) < 1) {
        Swal.showValidationMessage(
          "Todos los campos son obligatorios y el stock debe ser mayor a 0."
        );
        return false;
      }

      return { id_talla, id_color, stock };
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const token = localStorage.getItem("token");
      axiosClient
        .put(`/variantes/${variante.id_variantes}`, {
          id_talla: result.value.id_talla,
          id_color: result.value.id_color,
          stock: result.value.stock
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "¡Actualizado!",
            text: "La variante fue actualizada correctamente.",
            timer: 1200,
            showConfirmButton: false,
            background: "#f0fdf4",
            color: "#166534",
            customClass: {
              popup: "rounded-2xl shadow-lg animate__animated animate__fadeInUp"
            }
          });
          cargarVariantes();
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo actualizar la variante",
            confirmButtonColor: "#2563eb",
            customClass: {
              popup: "animate__animated animate__shakeX rounded-xl bg-red-50 text-red-800"
            }
          });
        });
    }
  });
};


 const handleAdd = () => {
  Swal.fire({
    title: `<span class="text-lime-500 font-bold text-2xl">Agregar Variante</span>`,
    html: `
      <div class="flex flex-col gap-6 items-center w-full text-left">
        <div class="w-full">
          <label class="text-lime-500 font-semibold mb-1 block">Talla:</label>
          <div id="tallas-chips" class="flex flex-wrap gap-3">
            ${tallas
              .map(
                (t) => `
                <button type="button" data-id="${t.id_talla}"
                  class="chip-talla px-4 py-2 rounded-full border-2 border-lime-400 bg-lime-50 text-lime-500 font-semibold hover:bg-lime-100 transition">
                  ${t.talla}
                </button>`
              )
              .join("")}
          </div>
          <input type="hidden" id="id_talla" />
        </div>

        <div class="w-full">
          <label class="text-pink-500 font-semibold mb-1 block">Color:</label>
          <div id="colores-circulos" class="flex flex-wrap gap-3 items-center">
            ${colores
              .map(
                (c) => `
                <div title="${c.color}" data-id="${c.id_color}"
                  class="color-circle w-9 h-9 rounded-full cursor-pointer border-2 border-pink-300 shadow-md"
                  style="background:${c.codigo_hex};">
                </div>`
              )
              .join("")}
            <button type="button" id="btn-nuevo-color"
              class="w-9 h-9 rounded-full bg-pink-400 text-white text-lg font-bold flex items-center justify-center shadow-md hover:bg-pink-500 transition">+</button>
          </div>
          <input type="hidden" id="id_color" />

          <div id="form-nuevo-color" class="mt-3 hidden flex gap-3">
            <input id="nuevoColor" placeholder="Nombre del color"
              class="swal2-input bg-pink-50 border border-pink-300 text-pink-600 placeholder-pink-400 font-semibold rounded-lg" />
            <input id="nuevoHex" type="color" value="#000000" class="swal2-input w-20 rounded-md" />
            <button type="button" id="btn-guardar-color"
              class="bg-lime-400 text-white px-4 py-2 rounded-md font-bold hover:bg-lime-500 transition">Guardar</button>
          </div>
        </div>

        <div class="w-full">
          <label class="text-lime-500 font-semibold mb-1 block">Stock:</label>
          <input id="stock" type="number" min="1" placeholder="Stock"
            class="swal2-input w-full bg-lime-50 border-2 border-lime-300 text-lime-600 font-bold placeholder-lime-400 rounded-xl focus:ring-2 focus:ring-lime-400" />
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Agregar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#a3e635",
    cancelButtonColor: "#f472b6",
    customClass: {
      popup:
        "rounded-3xl shadow-2xl border border-green-100 bg-white animate__animated animate__fadeInDown",
      confirmButton:
        "bg-lime-400 hover:bg-lime-500 text-white px-6 py-2 rounded-xl font-bold",
      cancelButton:
        "bg-pink-200 hover:bg-pink-300 text-pink-700 px-6 py-2 rounded-xl font-bold"
    },
    didOpen: () => {
      const chips = document.querySelectorAll(".chip-talla");
      chips.forEach((chip) => {
        chip.onclick = () => {
          chips.forEach((c) =>
            c.classList.remove("bg-lime-400", "text-white")
          );
          chips.forEach((c) =>
            c.classList.add("bg-lime-50", "text-lime-500")
          );
          chip.classList.add("bg-lime-400", "text-white");
          chip.classList.remove("bg-lime-50", "text-lime-500");
          document.getElementById("id_talla").value =
            chip.getAttribute("data-id");
        };
      });

      const circles = document.querySelectorAll(".color-circle");
      circles.forEach((circle) => {
        circle.onclick = () => {
          circles.forEach((c) =>
            c.classList.remove("ring-4", "ring-pink-300")
          );
          circle.classList.add("ring-4", "ring-pink-300");
          document.getElementById("id_color").value =
            circle.getAttribute("data-id");
        };
      });

      const btnNuevoColor = document.getElementById("btn-nuevo-color");
      const formNuevoColor = document.getElementById("form-nuevo-color");
      if (btnNuevoColor && formNuevoColor) {
        btnNuevoColor.onclick = () => {
          formNuevoColor.classList.remove("hidden");
          formNuevoColor.classList.add("flex");
        };
      }

      const btnGuardarColor = document.getElementById("btn-guardar-color");
      if (btnGuardarColor) {
        btnGuardarColor.onclick = async () => {
          const color = document
            .getElementById("nuevoColor")
            .value.trim();
          const hex = document.getElementById("nuevoHex").value;
          if (!color || !hex) {
            Swal.showValidationMessage(
              "Debes ingresar el nombre y el código hexadecimal del color."
            );
            return;
          }
          try {
            const token = localStorage.getItem("token");
            await axiosClient.post(
              "/producto/colores",
              { color, codigo_hex: hex },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            cargarColores();
            Swal.fire({
              icon: "success",
              title: "Color registrado",
              text: "Color registrado correctamente",
              timer: 1200,
              showConfirmButton: false
            });
            formNuevoColor.classList.add("hidden");
          } catch {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error al registrar el color"
            });
          }
        };
      }
    },
    preConfirm: () => {
      const id_talla = document.getElementById("id_talla").value.trim();
      const id_color = document.getElementById("id_color").value.trim();
      const stock = document.getElementById("stock").value.trim();
      if (
        !id_talla ||
        !id_color ||
        !stock ||
        isNaN(stock) ||
        Number(stock) < 1
      ) {
        Swal.showValidationMessage(
          "Todos los campos son obligatorios y el stock debe ser mayor a 0."
        );
        return false;
      }
      return { id_talla, id_color, stock };
    },
    showClass: { popup: "animate__animated animate__fadeInDown" },
    hideClass: { popup: "animate__animated animate__fadeOutUp" }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const token = localStorage.getItem("token");
      axiosClient
        .post(
          `/variantes`,
          {
            id_producto: id,
            id_talla: result.value.id_talla,
            id_color: result.value.id_color,
            stock: result.value.stock
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Agregado",
            text: "Variante agregada correctamente",
            timer: 1200,
            showConfirmButton: false
          });
          cargarVariantes();
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo agregar la variante",
            confirmButtonColor: "#2563eb"
          });
        });
    }
  });
};


  // Filtrado de variaciones
  const variantesFiltradas = variantes.filter(v => {
    if (filtroTalla && v.talla !== filtroTalla) return false;
    if (filtroColor && v.color !== filtroColor) return false;
    if (filtroStock === "bajo" && v.stock >= 5) return false;
    if (filtroStock === "agotado" && v.stock > 0) return false;
    if (filtroStock === "disponible" && v.stock === 0) return false;
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-white to-green-50 py-16 px-6">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-white">
        <h2 className="text-4xl font-bold text-center text-pink-600 mb-10 animate-fade-in-down">
          Gestión de Variantes del Producto
        </h2>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <select value={filtroTalla} onChange={e => setFiltroTalla(e.target.value)} className="p-3 rounded-xl border shadow-inner bg-white focus:outline-none focus:ring-2 focus:ring-pink-300">
            <option value="">Filtrar por talla</option>
            {tallas.map(t => (
              <option key={t.id_talla} value={t.talla}>{t.talla}</option>
            ))}
          </select>
          <select value={filtroColor} onChange={e => setFiltroColor(e.target.value)} className="p-3 rounded-xl border shadow-inner bg-white focus:outline-none focus:ring-2 focus:ring-green-300">
            <option value="">Filtrar por color</option>
            {colores.map(c => (
              <option key={c.id_color} value={c.color}>{c.color}</option>
            ))}
          </select>
          <select value={filtroStock} onChange={e => setFiltroStock(e.target.value)} className="p-3 rounded-xl border shadow-inner bg-white focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option value="">Filtrar por stock</option>
            <option value="bajo">Stock bajo (&lt;5)</option>
            <option value="agotado">Agotado</option>
            <option value="disponible">Disponible</option>
          </select>
        </div>

        {/* Tabla de variantes */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-separate border-spacing-y-3">
            <thead>
              <tr className="text-pink-600 text-lg bg-pink-100/40 rounded-xl">
                <th className="py-4">Talla</th>
                <th>Color</th>
                <th>Código Hex</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {variantesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400 italic">No hay variantes registradas.</td>
                </tr>
              ) : (
                variantesFiltradas.map((v) => (
                  <tr key={v.id_variantes} className="bg-white shadow-lg rounded-xl hover:shadow-pink-200 transition-all duration-300">
                    <td className="py-4 font-semibold">{v.talla}</td>
                    <td className="font-semibold">{v.color}</td>
                    <td>
                      <span
                        className="inline-block px-3 py-1 rounded-full text-sm font-mono text-white"
                        style={{
                          backgroundColor: v.codigo_hex,
                          textShadow: "0 1px 2px #0006",
                          border: "1px solid #eee"
                        }}
                      >
                        {v.codigo_hex}
                      </span>
                    </td>
                    <td className="text-green-600 font-bold">{v.stock}</td>
                    <td className="flex justify-center gap-3 py-3">
                      <button onClick={() => handleUpdate(v)} className="p-2 bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 shadow">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(v.id_variantes)} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 shadow">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Botón agregar */}
        <div className="flex justify-end mt-10">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold shadow-xl transition-all duration-300"
          >
            <FaPlus /> Agregar Variante
          </button>
        </div>
      </div>
    </div>
  );

};