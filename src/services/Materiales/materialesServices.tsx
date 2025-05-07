import { api } from '@/services/api';
import { Models } from '@/types/types';

export type Material = Models['Material'];

const ENDPOINT = '/api/materiales';

export const materialService = {
  getAll: async (): Promise<Material[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching materiales:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: string): Promise<Material> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching material by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (material: Partial<Material>): Promise<Material> => {
    try {
      // Create a cleaned version of the data to send
      const cleanedData: Partial<Material> = {
        TipoMaterial: material.TipoMaterial,
        nombreMaterial: material.nombreMaterial,
        descripcion: material.descripcion,
        stock: typeof material.stock === 'string' ? parseInt(material.stock as string) : material.stock,
        UnidadMedida: material.UnidadMedida,
        CategoriaMaterial: material.CategoriaMaterial,
        Caduca: material.Caduca,
        fechaVencimiento: material.fechaVencimiento
      };
      
      console.log('Creating new material with data:', JSON.stringify(cleanedData, null, 2));
      
      const response = await api.post(ENDPOINT, cleanedData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating material:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: string, material: Partial<Material>): Promise<Material> => {
    try {
      // Create a cleaned version of the data to send
      const cleanedData: Partial<Material> = {
        TipoMaterial: material.TipoMaterial,
        nombreMaterial: material.nombreMaterial,
        descripcion: material.descripcion,
        stock: typeof material.stock === 'string' ? parseInt(material.stock as string) : material.stock,
        UnidadMedida: material.UnidadMedida,
        CategoriaMaterial: material.CategoriaMaterial,
        Caduca: material.Caduca,
        fechaVencimiento: material.fechaVencimiento,
        fechaActualización: new Date()
      };
      
      console.log('Updating material with ID:', id);
      console.log('Cleaned data being sent:', JSON.stringify(cleanedData, null, 2));
      
      const response = await api.put(`${ENDPOINT}/${id}`, cleanedData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating material:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting material:', error.response?.data || error.message);
      throw error;
    }
  },
};