import React, { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  onChange: (mensaje: string) => void;
  mensaje: string;
}

export const FormularioResena: React.FC<Props> = ({ mensaje, onChange }) => {
  return (
    <textarea
      className="border border-pink-300 rounded-md p-2 w-full mb-2"
      rows={4}
      value={mensaje}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Escribe tu reseña aquí..."
    />
  );
};
