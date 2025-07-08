import React, { useState, useEffect, useCallback } from 'react';
import FlappyBirdGame from '../../Layouts/Juego/Juego';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../../api/axion';

export const Juego = () => {
  const [topJugadores, setTopJugadores] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(true);

  const obtenerTopJugadores = useCallback(async () => {
    try {
      const res = await axiosClient.get("/juego");
      setTopJugadores(res.data[0]?.slice(0, 10) || []);
    } catch (error) {
      console.error("Error al obtener el top:", error);
    }
  }, []);

  useEffect(() => {
    obtenerTopJugadores();
  }, [obtenerTopJugadores]);

  return (
    <>
      {/* MODAL GLOBAL */}
      <AnimatePresence>
        {mostrarModal && (
          <motion.div
            className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white p-8 rounded-3xl shadow-2xl max-w-xl w-full border border-pink-300 relative"
            >
              <button
                onClick={() => setMostrarModal(false)}
                className="absolute top-4 right-4 text-pink-500 hover:text-pink-700 text-2xl font-bold transition-transform duration-200 hover:rotate-90"
                aria-label="Cerrar"
              >
                ✕
              </button>

              <h2 className="text-3xl font-extrabold text-pink-600 mb-4 text-center">
                🎁 ¡Juega y Gana Descuentos!
              </h2>

              <p className="text-gray-700 mb-3 text-base text-center">
                Cada vez que juegas, puedes conseguir descuentos exclusivos para tus compras:
              </p>

              <ul className="list-disc pl-6 mb-4 text-gray-700 text-base">
                <li><b>5 puntos</b> = <b>5%</b> de descuento</li>
                <li><b>10 puntos</b> = <b>10%</b> de descuento</li>
                <li><b>15 puntos</b> = <b>15%</b> de descuento</li>
              </ul>

              <p className="text-gray-700 text-sm text-center">
                Puedes usar tu descuento cuando quieras, pero si sigues jugando y superas tu récord, ¡puedes mejorarlo aún más!
              </p>

              <p className="text-pink-500 font-semibold mt-3 text-sm text-center">
                ⚠️ Debes iniciar sesión para recibirlo. Si usas tu descuento, ya no podrás mejorarlo hasta volver a jugar y alcanzar una nueva meta.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTENIDO PRINCIPAL */}
      <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-pink-50 to-indigo-100 text-gray-800 px-4 py-10 font-sans">
        <div className="max-w-4xl mx-auto flex flex-col items-center space-y-12">

          {/* Contenedor del juego */}
          <div className="flex items-center justify-center rounded-3xl shadow-2xl bg-white p-6 border-2 border-pink-200">
            <FlappyBirdGame onGameOver={obtenerTopJugadores} />
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-pink-600 tracking-wide drop-shadow-md">
            🐊 Flappy Gator
          </h1>

          {/* Ranking real */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full max-w-xl bg-white rounded-2xl shadow-xl border-2 border-pink-200 p-8"
          >
            <h2 className="text-2xl font-bold text-center text-pink-500 mb-6 flex items-center justify-center gap-2">
              <span role="img" aria-label="trofeo">🏆</span> ¡Top Aventureros!
            </h2>
            <ul className="space-y-3 max-h-[520px] overflow-y-auto scroll-invisible">
              <AnimatePresence>
                {topJugadores.length === 0 ? (
                  <motion.li
                    key="no-score"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-gray-400"
                  >
                    No hay puntajes aún.
                  </motion.li>
                ) : (
                  topJugadores.map((player, idx) => (
                    <motion.li
                      layout
                      key={player.usuarioId || idx}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`flex justify-between items-center px-6 py-3 rounded-xl border-2 shadow-sm transition
                        ${
                          idx === 0
                            ? "bg-gradient-to-r from-pink-200 via-amber-100 to-white border-pink-400"
                            : idx === 1
                            ? "bg-gradient-to-r from-indigo-100 via-pink-50 to-white border-indigo-200"
                            : idx === 2
                            ? "bg-gradient-to-r from-amber-100 via-pink-50 to-white border-amber-200"
                            : "bg-pink-50 border-pink-100"
                        }
                        hover:bg-pink-100`}
                    >
                      <span className={`font-bold text-lg flex items-center gap-2 ${
                        idx === 0
                          ? "text-pink-600"
                          : idx === 1
                          ? "text-indigo-500"
                          : idx === 2
                          ? "text-amber-500"
                          : "text-gray-700"
                      }`}>
                        {idx === 0 && <span>🥇</span>}
                        {idx === 1 && <span>🥈</span>}
                        {idx === 2 && <span>🥉</span>}
                        {idx + 1}. {player.nombre || player.username || 'Jugador'}
                      </span>
                      <span className={`font-extrabold text-xl ${
                        idx === 0
                          ? "text-pink-600"
                          : idx === 1
                          ? "text-indigo-500"
                          : idx === 2
                          ? "text-amber-500"
                          : "text-gray-700"
                      }`}>
                        {player.record} pts
                      </span>
                    </motion.li>
                  ))
                )}
              </AnimatePresence>
            </ul>
          </motion.div>
        </div>
      </div>
    </>
  );
};