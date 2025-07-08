import React, { useState } from "react";
import { ModalReseñas } from "../../Components/ModalReseñas/ModalReseñas";

export const SeccionReseñas = () => {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón con animación de estrella a cinco estrellas */}
      <button
        onClick={() => setMostrar(true)}
        className="relative flex items-center justify-center w-12 h-12 rounded-full bg-pink-200 text-green-700 hover:w-28 transition-all duration-500 overflow-hidden shadow-lg group hover:bg-green-200"
        aria-label="Abrir reseñas"
      >
        <span className="absolute transition-opacity duration-300 opacity-100 group-hover:opacity-0 text-2xl">
          ⭐
        </span>
        <span className="flex gap-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
        </span>
      </button>

      <ModalReseñas abierto={mostrar} cerrar={() => setMostrar(false)} />
    </div>
  );
};
