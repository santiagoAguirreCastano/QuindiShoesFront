import { useEffect, useRef } from 'react';
import { GuardarPersonalizado } from '../../Components/Personalizador3D/GuardarPersonalizado';
import PersonalizadorCanvas from '../../Components/Personalizador3D/PersonalizadorCanvas';
import ZonaPersonalizar from '../../Components/Personalizador3D/ZonaPersonalizar';

export default function PersonalizadorLayout() {
  const fetchData = GuardarPersonalizado((state) => state.fetchData);
  const canvasRef = useRef(null); // ✅ referencia al canvas

  useEffect(() => {
    fetchData(); // Carga colores y materiales
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-100 relative overflow-x-hidden">
      <div className="flex-1 h-1/2 md:h-full bg-white border-b md:border-b-0 md:border-r border-gray-300 ">
        <PersonalizadorCanvas ref={canvasRef} /> {/* ✅ se pasa como ref */}
      </div>
      <div>
        <ZonaPersonalizar canvasRef={canvasRef} /> {/* ✅ se pasa como prop */}
      </div>
    </div>
  );
}
