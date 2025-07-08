import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export  function RespuestaPagos() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const estado = params.get("x_response");

  useEffect(() => {
    console.log("Datos de ePayco:", Object.fromEntries(params));
  }, []);

  return (
    <div>
      <h2>Estado del pago: {estado}</h2>
    </div>
  );
}