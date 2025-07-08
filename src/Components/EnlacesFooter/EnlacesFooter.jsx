import React from "react";

const secciones = [
  {
    titulo: "Empresa",
    enlaces: ["Sobre nosotros", "Empleos"]
  },
  {
    titulo: "Recursos",
    enlaces: ["FAQ", "Contacto"]
  },
  {
    titulo: "Recursos",
    enlaces: ["Blog", "Guías"]
  },
  {
    titulo: "Legal",
    enlaces: ["Política de privacidad", "Términos del servicio"]
  }
];

export const EnlacesFooter = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-white text-center sm:text-left">
    {secciones.map((seccion, i) => (
      <div key={i}>
        <h3 className="font-bold mb-2">{seccion.titulo}</h3>
        <ul className="space-y-1">
          {seccion.enlaces.map((enlace, j) => (
            <li key={j} className="hover:text-green-400 cursor-pointer">{enlace}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);