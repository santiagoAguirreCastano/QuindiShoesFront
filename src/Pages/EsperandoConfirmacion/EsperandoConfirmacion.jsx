import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const EsperandoConfirmacion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const yaProcesado = useRef(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (!token) {
      setMensaje(" Registro en proceso. Revisa tu correo para confirmar.");
      return;
    }

    const confirmarCorreo = async () => {
      if (yaProcesado.current) return;
      yaProcesado.current = true;

      try {
        setMensaje("🔄 Confirmando correo...");
        await axios.get(`http://localhost:3000/verificar-correo?token=${token}`);
        setMensaje("✅ Correo confirmado con éxito. Redirigiendo al login...");
        setError(false);
        setTimeout(() => navigate("/login"), 3000);
      } catch {
        setMensaje("❌ Error al confirmar el correo. El token es inválido o ha expirado.");
        setError(true);
      }
    };

    confirmarCorreo();
  }, [location.search, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-100 text-gray-800 font-sans">
      <div className="text-center p-8 bg-white rounded-3xl shadow-2xl border-2 border-green-100 w-[90%] max-w-md animate-fade-in">
        
        {/* Loader si no hay error ni éxito aún */}
        {!error && !mensaje.includes("Correo confirmado") && (
          <div className="mb-6 flex justify-center">
            <div className="w-12 h-12 border-4 border-green-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Icono de éxito */}
        {!error && mensaje.includes("Correo confirmado") && (
          <div className="mb-4 text-4xl animate-pulse text-green-500">✅</div>
        )}

        {/* Icono de error */}
        {error && (
          <div className="mb-4 text-4xl text-red-400">⚠️</div>
        )}

        <p className={`text-lg ${error ? "text-red-500" : "text-gray-700"} font-medium`}>
          {mensaje}
        </p>
      </div>
    </div>
  );
};

export default EsperandoConfirmacion;
