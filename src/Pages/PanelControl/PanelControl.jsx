import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { LateralPanel } from '../../Layouts/LateralPanel/LateralPanel';
import { ListaProductos } from '../Productos/Productos';
import { ListaEmpleados } from '../Empleados/Empleados';
import { MetricasPages } from '../MetricasPage/MetricasPages';
import { HistorialFacturas } from '../HistorialVentas/historialventas';
import { BlobBackground } from '../../Components/FondoBlobs/FondoBlobs';
import VentasPorRango from '../../Components/Metricas/Metricas';
import { ReservasPanel } from '../../Components/Reservas/Reservas';
import Domicilios from '../Domicilios/Domicilios';

export const PanelControl = () => {
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('');
  const [mostrarPanel, setMostrarPanel] = useState(true);

  const renderContenido = () => {
    switch (seccionSeleccionada) {
      case 'usuarios': return <ListaEmpleados />;
      case 'inventario': return <ListaProductos />;
      case 'ventas': return <HistorialFacturas />;
      case 'domicilios': return <Domicilios />;
      case 'reservas': return <ReservasPanel />;
      case 'mesrivas': return <VentasPorRango />;
      default: return null;
    }
  };

  return (
    <>
      <BlobBackground />
      <div className="min-h-screen px-4 sm:px-6 md:px-10 py-5 relative">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-center sm:text-left">
          Backoffice
        </h1>

        {/* Panel de botones */}
        <AnimatePresence>
          {mostrarPanel && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <LateralPanel
                onSelectSection={(key) => {
                  setSeccionSeleccionada(key);
                  setMostrarPanel(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenido dinámico */}
        {!mostrarPanel && (
          <motion.div
            key="contenido"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className="mt-6 sm:mt-10 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/70 shadow-md overflow-auto max-h-[calc(100vh-150px)]"
          >
            {renderContenido()}
          </motion.div>
        )}

        {/* Botón flotante */}
        {!mostrarPanel && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              setMostrarPanel(true);
              setSeccionSeleccionada('');
            }}
            className="fixed bottom-5 left-5 z-50 bg-black/60 text-white border border-white/30 backdrop-blur-md rounded-full p-3 shadow-lg hover:scale-110 transition-all group"
            aria-label="Mostrar panel"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:rotate-180" />
          </motion.button>
        )}
      </div>
    </>
  );
};
