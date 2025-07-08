import React, { useEffect } from 'react';

export const Accesibilidad = () => {
  useEffect(() => {
    // Configuración del widget de accesibilidad
    window.interdeal = {
      get sitekey() {
        return '4f87b42463faf00276d7aeedebf1262e'; // Clave original proporcionada
      },
      get domains() {
        return {
          js: 'https://cdn.equalweb.com/',
          acc: 'https://access.equalweb.com/',
        };
      },
      Position: 'left',
      Menulang: 'ES',
      draggable: true,
      btnStyle: {
        vPosition: ['50%', '80%'],
        margin: ['0', '0'],
        scale: ['0.5', '0.5'],
        color: {
          main: '#cc1ec1',
          second: '#ffffff',
        },
        icon: {
          outline: false,
          outlineColor: '#ffffff',
          type: 10, // Cambiado según tu versión original
          shape: 'semicircle',
        },
      },
    };

    // Cargar el script de EqualWeb
    const script = document.createElement('script');
    script.src = `${window.interdeal.domains.js}core/5.1.13/accessibility.js`;
    script.defer = true;
    script.integrity =
      'sha512-70/AbMe6C9H3r5hjsQleJEY4y5l9ykt4WYSgyZj/WjpY/ord/26LWfva163b9W+GwWkfwbP0iLT+h6KRl+LoXA==';
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-cfasync', 'true');

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // No renderiza ningún componente visual
};
