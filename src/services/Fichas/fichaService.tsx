import { api } from '@/services/api';
import { Models } from '@/types/types';

export type Ficha = Models['Ficha'];

const ENDPOINT = '/api/fichas';

export const fichaService = {
  getAll: async (): Promise<Ficha[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching fichas:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: string): Promise<Ficha> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching ficha by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (ficha: Partial<Ficha>): Promise<Ficha> => {
    try {
      // Create a cleaned version of the data to send with proper type conversion
      const cleanedData: Partial<Ficha> = {
        numFicha: typeof ficha.numFicha === 'string' ? parseInt(ficha.numFicha) : ficha.numFicha,
        cantidadAprendices: typeof ficha.cantidadAprendices === 'string' ? 
          parseInt(ficha.cantidadAprendices) : ficha.cantidadAprendices
      };
      
      console.log('Creating new ficha with data:', JSON.stringify(cleanedData, null, 2));
      
      const response = await api.post(ENDPOINT, cleanedData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating ficha:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: string, ficha: Partial<Ficha>): Promise<Ficha> => {
    try {
      // Create a cleaned version of the data to send with proper type conversion
      const cleanedData: Partial<Ficha> = {
        numFicha: typeof ficha.numFicha === 'string' ? parseInt(ficha.numFicha) : ficha.numFicha,
        cantidadAprendices: typeof ficha.cantidadAprendices === 'string' ? 
          parseInt(ficha.cantidadAprendices) : ficha.cantidadAprendices
      };
      
      console.log('Updating ficha with ID:', id);
      console.log('Cleaned data being sent:', JSON.stringify(cleanedData, null, 2));
      
      const response = await api.put(`${ENDPOINT}/${id}`, cleanedData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating ficha:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting ficha:', error.response?.data || error.message);
      throw error;
    }
  },
};
