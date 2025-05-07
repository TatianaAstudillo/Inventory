import { useState, useEffect, useCallback } from 'react';
import { tipoMaterialService, TipoMaterial } from '@/services/TipoMateriales/tipoMaterialService';

export const useTipoMaterial = () => {
  const [tiposMaterial, setTiposMaterial] = useState<TipoMaterial[]>([]);
  const [selectedTipoMaterial, setSelectedTipoMaterial] = useState<TipoMaterial | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all tipos de material
  const fetchTiposMaterial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tipoMaterialService.getAll();
      setTiposMaterial(data);
    } catch (err) {
      setError('Error al cargar tipos de material');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single tipo de material by ID
  const fetchTipoMaterialById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tipoMaterialService.getById(id);
      setSelectedTipoMaterial(data);
      return data;
    } catch (err) {
      setError('Error al cargar el tipo de material');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new tipo de material
  const createTipoMaterial = useCallback(async (tipoMaterial: Partial<TipoMaterial>) => {
    setLoading(true);
    setError(null);
    try {
      const newTipoMaterial = await tipoMaterialService.create(tipoMaterial);
      setTiposMaterial((prev) => [...prev, newTipoMaterial]);
      setIsModalOpen(false);
      return newTipoMaterial;
    } catch (err) {
      setError('Error al crear el tipo de material');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing tipo de material
  const updateTipoMaterial = useCallback(async (id: string, tipoMaterial: Partial<TipoMaterial>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTipoMaterial = await tipoMaterialService.update(id, tipoMaterial);
      setTiposMaterial((prev) => 
        prev.map((t) => (t.idTipoMaterial === id ? updatedTipoMaterial : t))
      );
      setSelectedTipoMaterial(null);
      setIsModalOpen(false);
      return updatedTipoMaterial;
    } catch (err) {
      setError('Error al actualizar el tipo de material');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a tipo de material
  const deleteTipoMaterial = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await tipoMaterialService.delete(id);
      setTiposMaterial((prev) => prev.filter((t) => t.idTipoMaterial !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el tipo de material');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = useCallback(
    async (values: Partial<TipoMaterial>) => {
      if (selectedTipoMaterial) {
        return await updateTipoMaterial(selectedTipoMaterial.idTipoMaterial, values);
      } else {
        return await createTipoMaterial(values);
      }
    },
    [selectedTipoMaterial, createTipoMaterial, updateTipoMaterial]
  );

  // Open modal for creating a new tipo de material
  const handleCreate = useCallback(() => {
    setSelectedTipoMaterial(null);
    setIsModalOpen(true);
  }, []);

  // Open modal for editing an existing tipo de material
  const handleEdit = useCallback((tipoMaterial: TipoMaterial) => {
    setSelectedTipoMaterial(tipoMaterial);
    setIsModalOpen(true);
  }, []);

  // Close the modal
  const handleCancel = useCallback(() => {
    setSelectedTipoMaterial(null);
    setIsModalOpen(false);
  }, []);

  // Load tipos de material on component mount
  useEffect(() => {
    fetchTiposMaterial();
  }, [fetchTiposMaterial]);

  return {
    tiposMaterial,
    selectedTipoMaterial,
    loading,
    error,
    isModalOpen,
    fetchTiposMaterial,
    fetchTipoMaterialById,
    createTipoMaterial,
    updateTipoMaterial,
    deleteTipoMaterial,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};