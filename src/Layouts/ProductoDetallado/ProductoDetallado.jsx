import React from 'react';
import { useLocation } from 'react-router-dom';
import { BtnAgregarCarrito } from '../../Components/BtnAgregarCarrito/BtnAgregarCarrito';
import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { useContext } from 'react';
import { ContadorCarritoContext } from '../../Contexts/ContadorCarritoContext';
import axios from 'axios';

export function ProductoDetallado() {

  const location = useLocation();
  const { imagen, nombre, marca, precio, descripcion, contenido , icono, onClick  } = location.state || {};

  const { incrementarContador } = useContext(ContadorCarritoContext);

 const handleAgregarAlCarrito = () => {
  const producto = {
    imagen_producto: imagen,
    nombre_producto: nombre,
    marca,
    precio_producto: precio,
    descripcion,
  };
  incrementarContador()
  const carritoActual = JSON.parse(localStorage.getItem("carrito") || "[]");
  const existe = carritoActual.some(p => p.nombre_producto === producto.nombre_producto);
  if (!existe) {
    carritoActual.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carritoActual));
    console.log(`Producto agregado: ${producto.nombre_producto}`);
  } else {
    console.log("Producto ya existe en el carrito");
  }
};


  return (
    <div className='w-full h-full flex items-center'>
      <div><img src={imagen} alt={nombre} /></div>
      <div className='flex flex-col '>
        <h1 className='text-9xl'>{nombre}</h1>
        <p className='text-5xl'>{marca}</p>
        <h3 className="bg-zinc-900  text-white w-45 h-10 text-4xl rounded-full flex justify-center">{precio}</h3>
        <div className='grid grid-cols-2 grid-rows-2 gap-4'>
          <div>color</div>
          <div>{descripcion}</div>
          <div>tallas</div>
        </div>
        <div>Añadir favoritos  <BtnAgregarCarrito contenido={contenido} onClick={handleAgregarAlCarrito} icono={FaShoppingCart} /> </div>
      </div>
    </div>
  );
}
