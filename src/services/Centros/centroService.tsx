import { api } from '@/services/api';
import { Models } from '@/types/types';

export type Centro = Models['Centro'];

const ENDPOINT = '/api/centros';

export const centroService = {
  getAll: async (): Promise<Centro[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching centros:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: string): Promise<Centro> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching centro by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (centro: Partial<Centro>): Promise<Centro> => {
    try {
      const response = await api.post(ENDPOINT, centro);
      return response.data;
    } catch (error: any) {
      console.error('Error creating centro:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: string, centro: Partial<Centro>): Promise<Centro> => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, centro);
      return response.data;
    } catch (error: any) {
      console.error('Error updating centro:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting centro:', error.response?.data || error.message);
      throw error;
    }
  },
};