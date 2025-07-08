import { create } from 'zustand';
import axiosClient from '../../api/axion';

export const GuardarPersonalizado = create((set, get) => ({
  colores: [],
  materiales: [],
  personalizacion: {},

  // Carga todos los datos del backend usando axiosClient
  fetchData: async () => {
    try {
      const [resColores, resMateriales] = await Promise.all([
        axiosClient.get('/color'),
        axiosClient.get('/material'),
      ]);

      set({
        colores: resColores.data,
        materiales: resMateriales.data,
      });
    } catch (error) {
      console.error('Error al cargar datos del backend:', error);
    }
  },

  // Establece color y material para una zona específica
  setPersonalizacion: (zonaId, colorId, materialId) => {
    set((state) => ({
      personalizacion: {
        ...state.personalizacion,
        [zonaId]: { colorId, materialId },
      },
    }));
  },

  // Para enviar al backend (opcional por ahora)
  getPersonalizacionPayload: () => {
    const { personalizacion } = get();
    return Object.entries(personalizacion).map(([zonaId, { colorId, materialId }]) => ({
      zonaId: parseInt(zonaId),
      colorId,
      materialId,
    }));
  },
}));
