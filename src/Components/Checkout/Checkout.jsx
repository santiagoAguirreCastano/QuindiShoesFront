import React, { useEffect, useRef, useState } from "react";

const TEST_USER_EMAIL = "test_user_12345678@testuser.com";
const AMOUNT = 10000;

const PaymentBrick = React.memo(() => {
  const [preferenceId, setPreferenceId] = useState(null);
  const brickBuilderRef = useRef(null);

  useEffect(() => {
    const fetchPreferenceId = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/create_preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: [
              {
                title: "Producto de prueba",
                quantity: 1,
                unit_price: AMOUNT,
                currency_id: "COP",
              },
            ],
            payer: {
              email: TEST_USER_EMAIL,
            },
          }),
        });
        const data = await response.json();
        // El backend responde { preference: mpResponse }
        setPreferenceId(data.preference?.id || data.preferenceId || data.id);
        console.log("[fetchPreferenceId] preferenceId recibido:", data.preference?.id || data.preferenceId || data.id);
      } catch (error) {
        console.error("Error al obtener preferenceId:", error);
      }
    };

    fetchPreferenceId();
  }, []);

  useEffect(() => {
    if (!preferenceId) return;

    let isMounted = true;

    const initializeBrick = async () => {
      if (!isMounted) return;

      const mp = new window.MercadoPago("TEST-29b38254-defe-4eaf-8a78-2296e12fe210", {
        locale: "es-CO",
      });


      const bricksBuilder = mp.bricks();
      brickBuilderRef.current = bricksBuilder;

      await bricksBuilder.create("payment", "payment-brick-container", {
        initialization: {
          amount: AMOUNT,
          preferenceId: preferenceId,
          payer: {
            email: TEST_USER_EMAIL,
          },
        },
        customization: {
          visual: {
            style: {
              theme: "default",
            },
          },
          paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            ticket: "all",
            bankTransfer: "all",
            atm: "all",
            maxInstallments: 1,
          },
        },
        callbacks: {
          onReady: () => {
            console.log("Brick listo");
          },
          onSubmit: async ({ selectedPaymentMethod, formData }) => {
            console.log("onSubmit ejecutado", formData);

            // Envía el token y datos al backend para crear el pago real
            const response = await fetch("http://localhost:3000/api/process_payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: formData.token,
                issuer_id: formData.issuer_id,
                payment_method_id: formData.payment_method_id,
                transaction_amount: formData.transaction_amount,
                installments: formData.installments,
                payer: {
                  email: TEST_USER_EMAIL,
                  identification: formData.identification || { type: "C.C.", number: "123456789" },
                },
                preferenceId,
              }),
            });

            const result = await response.json();
            console.log("Respuesta del backend al procesar pago:", result);

            if (result.status === "approved") {
              return Promise.resolve();
            } else {
              return Promise.reject({ message: "El pago no fue aprobado" });
            }
          },
          onPaymentApproved: async (payment) => {
            console.log("onPaymentApproved ejecutado:", payment);

            const paymentData = {
              payment_id: payment.id,
              status: payment.status,
              preference_id: payment.preference_id,
              payer: payment.payer,
            };

            console.log("Enviando al backend:", paymentData);

            fetch("http://localhost:3000/api/process_payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(paymentData),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("Pago procesado:", data);
              })
              .catch((error) => {
                console.error("Error al procesar el pago:", error);
              });
          },
          onError: (error) => {
            console.error("Error en el Brick de pago:", error);
            alert(JSON.stringify(error));
          },
        },
      });
    };

    if (!window.MercadoPago) {
      const script = document.createElement("script");
      script.src = "https://sdk.mercadopago.com/js/v2";
      script.onload = initializeBrick;
      document.body.appendChild(script);
    } else {
      initializeBrick();
    }

    return () => {
      isMounted = false;
      if (window.MercadoPago?.bricks && brickBuilderRef.current) {
        brickBuilderRef.current.unmount("payment-brick-container");
        brickBuilderRef.current = null;
      }
    };
  }, [preferenceId]);

  return <div id="payment-brick-container" style={{ minHeight: "100px" }} />;
});

export default PaymentBrick;