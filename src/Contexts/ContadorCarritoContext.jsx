import React, { createContext, useState } from "react";

export const ContadorCarritoContext = createContext({
  contador: 0,
  incrementarContador: () => {},
  resetear: () => {},   
});

export const ContadorCarritoContextProvider = ({ children }) => {
  const [contador, setContador] = useState(0);

  const incrementarContador = () => setContador((c) => c + 1);
  const resetear = () => setContador(0);

  return (
    <ContadorCarritoContext.Provider value={{ contador, incrementarContador, resetear }}>
      {children}
    </ContadorCarritoContext.Provider>
  );
};
