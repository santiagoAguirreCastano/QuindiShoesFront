import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // Usado para acceder a los parámetros de la URL

const VerificarCorreo = () => {
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams(); 
  const tokenUrl = searchParams.get('token');
  const tokenLocalStorage = localStorage.getItem('verificacionToken');

  useEffect(() => {
    if (tokenUrl && tokenLocalStorage === tokenUrl) {
      setMessage('Correo verificado correctamente.');
      localStorage.removeItem('verificacionToken'); 
    } else {
      setMessage('Token inválido o expirado.');
    }
  }, [tokenUrl, tokenLocalStorage]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Verificación de Correo</h2>
      <p className={`text-lg ${message.includes('correctamente') ? 'text-green-500' : 'text-red-500'}`}>
        {message}
      </p>
    </div>
  </div>
  );
};

export default VerificarCorreo;
