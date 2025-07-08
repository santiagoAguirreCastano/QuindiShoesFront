import React from "react";
import { TituloFooter } from "../../Components/TituloFooter/TituloFooter";
import { RedesFooter } from "../../Components/RedesFooter/RedesFooter";
import { FormularioContacto } from "../../Components/FormularioContacto/FormularioContacto";

export const Footer = () => {
  return (
    <footer className="bg-[#fef6f9] text-[#4a4a4a] pt-14 pb-6 px-4 sm:px-6 font-sans overflow-hidden">
      {/* Bloque superior */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-y-10 md:gap-x-12">
        {/* Newsletter */}
        <div className="flex-1 min-w-[260px] max-w-sm mx-auto md:mx-0">
          <TituloFooter />
          <FormularioContacto />
        </div>

        {/* Logo y lema */}
        <div className="flex-1 min-w-[260px] max-w-sm flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <svg className="w-12 h-12 sm:w-14 sm:h-14 animate-float" viewBox="0 0 64 64" fill="none">
              <path d="M10 30 L54 10 L40 54 L32 32 Z" fill="#d68ba0" opacity="0.9" />
            </svg>
            <span className="text-2xl sm:text-3xl font-bold tracking-wide text-[#b65775]">QuindiShoes</span>
          </div>
          <p className="text-[#7d7d7d] text-sm">
            El diseño atemporal encuentra su camino en cada paso que das.
          </p>
        </div>

        {/* Redes y contacto */}
        <div className="flex-1 min-w-[260px] max-w-sm flex flex-col items-center md:items-end justify-center gap-4 text-center md:text-right mx-auto md:mx-0">
          <RedesFooter />
          <div className="text-[#7d7d7d] text-sm">
            <p>Calle Principal 123</p>
            <p>+57 3135874697</p>
            <p>QuindiShoes@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Enlaces inferiores */}
      <div className="max-w-7xl mx-auto mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 text-sm text-[#7d7d7d] px-2">
        {[
          { title: "Empresa", links: ["Sobre nosotros", "Blog", "Carreras"] },
          { title: "Soporte", links: ["Centro de ayuda", "Envíos", "Pagos"] },
          { title: "Legal", links: ["Política de privacidad", "Términos de uso"] },
          { title: "Extras", links: ["Afiliados", "Novedades", "Descuentos"] },
        ].map((col, i) => (
          <div key={i}>
            <h4 className="font-semibold text-[#b65775] mb-2">{col.title}</h4>
            <ul className="space-y-1">
              {col.links.map((link) => (
                <li key={link} className="hover:text-[#c72c5e] transition cursor-pointer">{link}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Línea inferior */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#f3d5da] flex flex-col sm:flex-row justify-between items-center text-xs text-[#999] gap-2 text-center px-4">
        <span>&copy; {new Date().getFullYear()} QuindiShoes. Todos los derechos reservados.</span>
        <div className="flex gap-3 flex-wrap justify-center">
          <span className="hover:text-[#c72c5e] cursor-pointer">Política de privacidad</span>
          <span className="hover:text-[#c72c5e] cursor-pointer">Términos</span>
        </div>
      </div>

      <style>
        {`
          .animate-float {
            animation: float 2.5s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}
      </style>
    </footer>
  );
};
