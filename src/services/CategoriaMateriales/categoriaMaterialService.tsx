import { api } from '@/services/api';
import { Models } from '@/types/types';

export type CategoriaMaterial = Models['CategoriaMaterial'];

const ENDPOINT = '/api/categoriamateriales';

export const categoriaMaterialService = {
  getAll: async (): Promise<CategoriaMaterial[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching categorías de material:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: string): Promise<CategoriaMaterial> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching categoría de material by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (categoriaMaterial: Partial<CategoriaMaterial>): Promise<CategoriaMaterial> => {
    try {
      const response = await api.post(ENDPOINT, categoriaMaterial);
      return response.data;
    } catch (error: any) {
      console.error('Error creating categoría de material:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: string, categoriaMaterial: Partial<CategoriaMaterial>): Promise<CategoriaMaterial> => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, categoriaMaterial);
      return response.data;
    } catch (error: any) {
      console.error('Error updating categoría de material:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting categoría de material:', error.response?.data || error.message);
      throw error;
    }
  },
};