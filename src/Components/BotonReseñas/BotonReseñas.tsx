import { useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

export const BotonReseñas = ({ onClick }: { onClick: () => void }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        fixed bottom-11 left-6 
        rounded-full 
        shadow-2xl 
        transition-all duration-300
        overflow-hidden 
        border border-pink-100
        backdrop-blur-md
        bg-gradient-to-r from-pink-100 via-white to-green-100
      `}
      style={{
        width: hovered ? "180px" : "64px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: hovered ? "space-evenly" : "center",
        padding: "0 10px",
      }}
    >
      {/* Estrella fija principal */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: hovered ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <FaStar size={26} color="#22c55e" style={{ filter: "drop-shadow(0 1px 2px #a7f3d0)" }} />
      </motion.div>

      {/* Estrellas extra solo en hover */}
      {hovered &&
        [...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { delay: (i + 1) * 0.1 },
            }}
          >
            <FaStar
              size={22}
              color="#22c55e"
              style={{ filter: "drop-shadow(0 1px 2px #bbf7d0)" }}
            />
          </motion.div>
        ))}
    </motion.button>
  );
};
