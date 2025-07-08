import React from 'react';
import { motion } from 'framer-motion';

export const BtnPanelControl = ({ icon, title, bgColor, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`flex flex-col items-center justify-center rounded-3xl p-4 sm:p-5 h-[280px] sm:h-[320px] md:h-[360px] w-full max-w-[240px] cursor-pointer transition-all shadow-md ${bgColor}`}
      onClick={onClick}
    >
      <div className="mb-4 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24">
        <img
          src={icon}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="font-semibold text-neutral-800 text-xl sm:text-2xl text-center">
        {title}
      </h3>
    </motion.div>
  );
};
