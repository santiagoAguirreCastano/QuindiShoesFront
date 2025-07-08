import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GuardarPersonalizado } from "./GuardarPersonalizado";
import { zonaDisplayNames, zonaMap } from "../PersonalizadorUtils/utils";
import axiosClient from "../../api/axion";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getZonaIdFromName, getColorHexFromStore } from "../PersonalizadorUtils/utils";
import Swal from "sweetalert2";

const exportarGLB = (scene, personalizacion, coloresDisponibles) => {
  return new Promise((resolve) => {
    // ✅ Aplica los colores directamente al scene original antes de exportar
    scene.traverse((child) => {
      if (child.isMesh && child.name) {
        const zonaId = getZonaIdFromName(child.name);
        const colorHex = getColorHexFromStore(zonaId, coloresDisponibles, personalizacion);
        if (colorHex) {
          child.material = child.material.clone(); // importante
          console.log("🎨 Aplicando color", colorHex, "a", child.name, "con zonaId", zonaId);
          child.material.color.set(colorHex);
        }
      }
    });

    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (gltf) => {
        const blob = new Blob([JSON.stringify(gltf)], {
          type: "model/gltf+json",
        });
        resolve(blob);
      },
      { binary: false }
    );
  });
};

export default function ZonaPersonalizar({ canvasRef }) {
  const { colores, personalizacion, setPersonalizacion } = GuardarPersonalizado();
  const zonasModelo = Object.entries(zonaMap).map(([nombre_malla, id_zona]) => ({
    id_zona,
    nombre_malla,
    display: zonaDisplayNames[nombre_malla] || nombre_malla,
  }));

  const [indexZonaActual, setIndexZonaActual] = useState(0);
  const zonaActual = zonasModelo[indexZonaActual];

  const cambiarZona = (direccion) => {
    setIndexZonaActual((prev) => {
      const nueva = prev + direccion;
      if (nueva < 0) return zonasModelo.length - 1;
      if (nueva >= zonasModelo.length) return 0;
      return nueva;
    });
  };

  const handleGuardar = async () => {
    const id_usuario = localStorage.getItem("id");
    if (!id_usuario) {
      Swal.fire({
        icon: "warning",
        title: "Debes iniciar sesión para guardar tu personalización.",
        confirmButtonColor: "#6366f1",
        customClass: { popup: "rounded-xl" },
      });
      return;
    }
    const coloresSeleccionados = Object.values(personalizacion)
      .map((zona) => colores.find((c) => c.id_color === zona.colorId)?.nombre_color)
      .filter(Boolean);

    await axiosClient.post("/color/sumar-uso", {
      colores: coloresSeleccionados,
    });

    console.log("🟡 Enviando colores:", coloresSeleccionados);

    const scene = canvasRef.current?.getScene?.();
    if (!scene) {
      Swal.fire({
        icon: "error",
        title: "No se capturó el modelo",
        confirmButtonColor: "#e11d48",
        customClass: { popup: "rounded-xl" },
      });
      return;
    }

    const glbBlob = await exportarGLB(scene, personalizacion, colores);
    const formData = new FormData();
    formData.append("modelo", glbBlob, "personalizacion.glb");
    formData.append("id_usuario", id_usuario);

    // Mostrar alerta de carga con barra de progreso
    Swal.fire({
      title: "Subiendo modelo...",
      html: `
        <div id="swal-progress-text" class="mb-2 text-indigo-600 font-semibold">0%</div>
        <div class="w-full bg-indigo-100 rounded-full h-3">
          <div id="swal-progress-bar" class="bg-indigo-500 h-3 rounded-full transition-all" style="width:0%"></div>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      customClass: { popup: "rounded-xl" },
      didOpen: () => {
        Swal.showLoading();
      }
    });

    let fakePercent = 0;
    let fakeInterval = setInterval(() => {
      // Solo avanza hasta 95% para no llegar al 100% antes de tiempo
      if (fakePercent < 95) {
        fakePercent += Math.random() * 2 + 1; // avanza entre 1% y 3% cada vez
        if (fakePercent > 95) fakePercent = 95;
        const progressBar = document.getElementById("swal-progress-bar");
        const progressText = document.getElementById("swal-progress-text");
        if (progressBar) progressBar.style.width = fakePercent + "%";
        if (progressText) progressText.textContent = Math.floor(fakePercent) + "%";
      }
    }, 120);

    await axiosClient.post("/personalizacion/guardar-modelo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        // Si quieres, puedes mezclar el real con el fake, pero aquí solo usamos el fake
      }
    });

    clearInterval(fakeInterval);
    // Al terminar, pon el progreso al 100%
    const progressBar = document.getElementById("swal-progress-bar");
    const progressText = document.getElementById("swal-progress-text");
    if (progressBar) progressBar.style.width = "100%";
    if (progressText) progressText.textContent = "100%";

    Swal.fire({
      icon: "success",
      title: "¡Personalización guardada correctamente!",
      showConfirmButton: false,
      timer: 1500,
      customClass: { popup: "rounded-xl" },
    });
  };

  return (
    <div className="w-full absolute bottom-20 left-0 px-4 pb-4 z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 space-y-4 border border-gray-200"
      >
        {/* Navegación entre zonas */}
        <div className="flex items-center justify-center gap-6 px-2">
          <button
            onClick={() => cambiarZona(-1)}
            className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 shadow transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <span className="font-semibold text-gray-700 text-lg text-center">
            {zonaActual.display} ({indexZonaActual + 1}/{zonasModelo.length})
          </span>

          <button
            onClick={() => cambiarZona(1)}
            className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 shadow transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Selector de colores */}
        <div className="flex justify-center flex-wrap gap-3 px-2 min-h-[48px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={zonaActual.id_zona}
              className="flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {colores.map((color, idx) => {
                const seleccionado = personalizacion[zonaActual.id_zona]?.colorId === color.id_color;
                return (
                  <motion.button
                    layout
                    key={color.id_color}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: idx * 0.03, duration: 0.2 }}
                    onClick={() =>
                      setPersonalizacion(zonaActual.id_zona, color.id_color, undefined)
                    }
                    title={color.nombre_color}
                    className={`w-10 h-10 rounded-full border-2 transition duration-200 ${
                      seleccionado
                        ? "ring-2 ring-indigo-500 border-black scale-110"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.codigo_hax }}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Botón de guardar */}
        <div className="flex justify-center pt-2">
          <button
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            onClick={handleGuardar}
          >
            Guardar Personalización
          </button>
        </div>
      </motion.div>
    </div>
  );
}
