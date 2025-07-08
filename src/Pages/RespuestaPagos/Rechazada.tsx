// src/pages/FailurePage.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export function Rechazada() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paymentId = searchParams.get('payment_id');
    const preferenceId = searchParams.get('preference_id');
    const status = searchParams.get('status');

    if (paymentId && preferenceId && status) {
      // Verificamos el estado del pago con Axios en caso de que falle
      axios
        .post('http://localhost:3000/api/payment/verify_payment', { paymentId, preferenceId })
        .then((response) => {
          // Maneja la lógica si el pago está fallido
          if (response.data.status !== 'approved') {
            setErrorMessage('El pago no fue aprobado. Por favor, intentalo de nuevo.');
          }
        })
        .catch((error) => {
          setErrorMessage('Hubo un error al procesar el pago. Intenta nuevamente.');
          console.error(error);
        });
    }
  }, [location]);

  return (
    <div>
      <h1>Pago fallido</h1>
      {errorMessage ? (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      ) : (
        <p>Estamos procesando tu pago. Por favor, espera...</p>
      )}
    </div>
  );
}
