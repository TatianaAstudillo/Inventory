import { useState, useEffect, useCallback } from 'react';
import { unidadMedidaService, UnidadMedida } from '@/services/UnidadMedidas/unidadMedidaService';

export const useUnidadMedida = () => {
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [selectedUnidadMedida, setSelectedUnidadMedida] = useState<UnidadMedida | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all unidades de medida
  const fetchUnidadesMedida = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await unidadMedidaService.getAll();
      setUnidadesMedida(data);
    } catch (err) {
      setError('Error al cargar unidades de medida');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single unidad de medida by ID
  const fetchUnidadMedidaById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await unidadMedidaService.getById(id);
      setSelectedUnidadMedida(data);
      return data;
    } catch (err) {
      setError('Error al cargar la unidad de medida');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new unidad de medida
  const createUnidadMedida = useCallback(async (unidadMedida: Partial<UnidadMedida>) => {
    setLoading(true);
    setError(null);
    try {
      const newUnidadMedida = await unidadMedidaService.create(unidadMedida);
      setUnidadesMedida((prev) => [...prev, newUnidadMedida]);
      setIsModalOpen(false);
      return newUnidadMedida;
    } catch (err) {
      setError('Error al crear la unidad de medida');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing unidad de medida
  const updateUnidadMedida = useCallback(async (id: string, unidadMedida: Partial<UnidadMedida>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUnidadMedida = await unidadMedidaService.update(id, unidadMedida);
      setUnidadesMedida((prev) => 
        prev.map((u) => (u.idUnidadMedida === id ? updatedUnidadMedida : u))
      );
      setSelectedUnidadMedida(null);
      setIsModalOpen(false);
      return updatedUnidadMedida;
    } catch (err) {
      setError('Error al actualizar la unidad de medida');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a unidad de medida
  const deleteUnidadMedida = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await unidadMedidaService.delete(id);
      setUnidadesMedida((prev) => prev.filter((u) => u.idUnidadMedida !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar la unidad de medida');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = useCallback(
    async (values: Partial<UnidadMedida>) => {
      if (selectedUnidadMedida) {
        return await updateUnidadMedida(selectedUnidadMedida.idUnidadMedida, values);
      } else {
        return await createUnidadMedida(values);
      }
    },
    [selectedUnidadMedida, createUnidadMedida, updateUnidadMedida]
  );

  // Open modal for creating a new unidad de medida
  const handleCreate = useCallback(() => {
    setSelectedUnidadMedida(null);
    setIsModalOpen(true);
  }, []);

  // Open modal for editing an existing unidad de medida
  const handleEdit = useCallback((unidadMedida: UnidadMedida) => {
    setSelectedUnidadMedida(unidadMedida);
    setIsModalOpen(true);
  }, []);

  // Close the modal
  const handleCancel = useCallback(() => {
    setSelectedUnidadMedida(null);
    setIsModalOpen(false);
  }, []);

  // Load unidades de medida on component mount
  useEffect(() => {
    fetchUnidadesMedida();
  }, [fetchUnidadesMedida]);

  return {
    unidadesMedida,
    selectedUnidadMedida,
    loading,
    error,
    isModalOpen,
    fetchUnidadesMedida,
    fetchUnidadMedidaById,
    createUnidadMedida,
    updateUnidadMedida,
    deleteUnidadMedida,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};