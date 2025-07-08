import React from 'react'


export const BtnAgregarCarrito = ({contenido,onClick,icono}) => {
  return (
     <button
              onClick={onClick}
              className="bg-blue-300 text-white px-3 py-1 rounded-md hover:bg-red-600 flex items-center gap-1"
            >
              {icono && React.createElement(icono)} {contenido}
            </button>
  )
}
