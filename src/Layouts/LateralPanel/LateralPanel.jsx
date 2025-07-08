import React from 'react';
import { BtnPanelControl } from '../../Components/BtnPanelControl/BtnPanelControl';
import userIcon from '../../assets/images/ChatGPT_Image_26_may_2025__09_52_39_a.m.-removebg-preview.png'; // Iconos personalizados como en la imagen
import productIcon from '../../assets/images/ChatGPT_Image_26_may_2025__10_00_48_a.m.-removebg-preview.png';
import ventasIcon from '../../assets/images/ChatGPT_Image_26_may_2025__10_57_23_a.m.-removebg-preview.png';
import mesrivasIcon from '../../assets/images/ChatGPT_Image_26_may_2025__10_50_44_a.m.-removebg-preview2.png';
import mietasIcon from '../../assets/images/ChatGPT_Image_26_may_2025__11_07_40_a.m.-removebg-preview.png';
import reservaIcon from '../../assets/images/ChatGPT_Image_26_may_2025__11_23_24_a.m.-removebg-preview.png';


export const LateralPanel = ({ onSelectSection }) => {
  const sections = [
    { title: 'Usuarios', bgColor: 'bg-[#ffb3b3]', icon: userIcon ,key: 'usuarios' },
    { title: 'Productos', bgColor: 'bg-[#7de2c5]', icon: productIcon ,key: 'inventario' },
    { title: 'Ventas', bgColor: 'bg-[#ffe6b3]', icon: ventasIcon,key: 'ventas' },
    { title: 'Metricas', bgColor: 'bg-[#f5f5fa]', icon: mesrivasIcon, key: 'mesrivas' },
    { title: 'Domicilios', bgColor: 'bg-[#d1b3ff]',icon: mietasIcon ,key: 'domicilios' }, // Nuevo color pastel rosa claro
    { title: 'Reservas', bgColor: 'bg-[#7db7e2]',icon:reservaIcon  ,key: 'reservas', textColor: 'text-white' }
  ];

  return (
    <div className="grid grid-cols-3 gap-10 p-7 justify-items-center ">
      {sections.map(({ title, icon, bgColor, key, textColor }) => (
        <BtnPanelControl
          key={key}
          title={title}
          icon={icon}
          bgColor={`${bgColor} ${textColor || ''}`}
          onClick={() => onSelectSection(key)}
        />
      ))}
    </div>
  );
};
