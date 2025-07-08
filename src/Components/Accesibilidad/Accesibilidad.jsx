import React, { useEffect } from 'react';

export const Accesibilidad = () => {
  useEffect(() => {
    // Configuración del widget de accesibilidad (nueva)
    window.interdeal = {
      get sitekey() {
        return '90cf43a9587416a40f69488555fe005d';
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
        vPosition: ['80%', '80%'],
        margin: ['0', '0'],
        scale: ['0.5', '0.5'],
        color: {
          main: '#cc1ec1',
          second: '#ffffff',
        },
        icon: {
          outline: false,
          outlineColor: '#ffffff',
          type: 11,
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
      // Limpieza cuando se desmonte el componente
      document.body.removeChild(script);
    };
  }, []);

  return null; // No renderiza ningún componente visual
};
