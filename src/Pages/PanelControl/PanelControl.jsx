import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react'; // Flecha para volver a mostrar el panel
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
    case 'domicilios': return <Domicilios/>;
    case 'reservas': return <ReservasPanel/>;
    case 'mesrivas': return <VentasPorRango />;
    default: return null;
  }
};


  return (
    <>
    <BlobBackground />
    <div className="min-h-screen p-5 relative">
      <h1 className="text-3xl font-bold mb-10">Backoffice</h1>

      {/* Panel de botones con animación (mostrar/ocultar) */}
      <AnimatePresence>
        {mostrarPanel && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
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
          className="mt-10 p-6 rounded-2xl"
        >
          {renderContenido()}
        </motion.div>
      )}

      {/* Botón flotante para volver a mostrar los botones */}
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
    className="fixed bottom-6 left-6 z-50 bg-black/60 text-white border border-white/30 backdrop-blur-md rounded-full p-3 shadow-lg hover:scale-110 transition-all group"
    aria-label="Mostrar panel"
  >
    <ChevronRight className="w-7 h-7 transition-transform group-hover:rotate-180" />
  </motion.button>
)}
    </div>
    </>
  );
};
