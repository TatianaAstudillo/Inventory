import { api } from '@/services/api';
import { Models } from '@/types/types';

export type Detalle = Models['Detalles'];

const ENDPOINT = '/api/detalles';

export const detallesService = {
  getAll: async (): Promise<Detalle[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching detalles:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: string): Promise<Detalle> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching detalle by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (detalle: Partial<Detalle>): Promise<Detalle> => {
    try {
      // Create a cleaned version of the data to send
      const cleanedData: Partial<Detalle> = {
        Material: detalle.Material,
        cantidaSolicitada: typeof detalle.cantidaSolicitada === 'string' ? 
          parseInt(detalle.cantidaSolicitada as string) : detalle.cantidaSolicitada,
        descripcion: detalle.descripcion,
        PersonaEncargada: detalle.PersonaEncargada,
        PersonaSolicita: detalle.PersonaSolicita,
        PersonaAprueba: detalle.PersonaAprueba
      };
      
      console.log('Creating new detalle with data:', JSON.stringify(cleanedData, null, 2));
      
      const response = await api.post(ENDPOINT, cleanedData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating detalle:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: string, detalle: Partial<Detalle>): Promise<Detalle> => {
    try {
      // Create a cleaned version of the data to send
      const cleanedData: Partial<Detalle> = {
        Material: detalle.Material,
        cantidaSolicitada: typeof detalle.cantidaSolicitada === 'string' ? 
          parseInt(detalle.cantidaSolicitada as string) : detalle.cantidaSolicitada,
        descripcion: detalle.descripcion,
        PersonaEncargada: detalle.PersonaEncargada,
        PersonaSolicita: detalle.PersonaSolicita,
        PersonaAprueba: detalle.PersonaAprueba,
        fechaActualización: new Date()
      };
      
      console.log('Updating detalle with ID:', id);
      console.log('Cleaned data being sent:', JSON.stringify(cleanedData, null, 2));
      
      const response = await api.put(`${ENDPOINT}/${id}`, cleanedData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating detalle:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting detalle:', error.response?.data || error.message);
      throw error;
    }
  },
};