import { useState, useEffect, useCallback } from 'react';
import { tipoSitioService, TipoSitio } from '@/services/TipoSitios/tipoSitioService';

export const useTipoSitio = () => {
  const [tipoSitios, setTipoSitios] = useState<TipoSitio[]>([]);
  const [selectedTipoSitio, setSelectedTipoSitio] = useState<TipoSitio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all tipos de sitio
  const fetchTipoSitios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tipoSitioService.getAll();
      setTipoSitios(data);
    } catch (err) {
      setError('Error al cargar tipos de sitio');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single tipo de sitio by ID
  const fetchTipoSitioById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tipoSitioService.getById(id);
      setSelectedTipoSitio(data);
      return data;
    } catch (err) {
      setError('Error al cargar el tipo de sitio');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new tipo de sitio
  const createTipoSitio = useCallback(async (tipoSitio: Partial<TipoSitio>) => {
    setLoading(true);
    setError(null);
    try {
      const newTipoSitio = await tipoSitioService.create(tipoSitio);
      setTipoSitios((prev) => [...prev, newTipoSitio]);
      setIsModalOpen(false);
      return newTipoSitio;
    } catch (err) {
      setError('Error al crear el tipo de sitio');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing tipo de sitio
  const updateTipoSitio = useCallback(async (id: string, tipoSitio: Partial<TipoSitio>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTipoSitio = await tipoSitioService.update(id, tipoSitio);
      setTipoSitios((prev) => 
        prev.map((ts) => (ts.idTipoSitio === id ? updatedTipoSitio : ts))
      );
      setSelectedTipoSitio(null);
      setIsModalOpen(false);
      return updatedTipoSitio;
    } catch (err) {
      setError('Error al actualizar el tipo de sitio');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a tipo de sitio
  const deleteTipoSitio = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await tipoSitioService.delete(id);
      setTipoSitios((prev) => prev.filter((ts) => ts.idTipoSitio !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el tipo de sitio');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = useCallback(
    async (values: Partial<TipoSitio>) => {
      if (selectedTipoSitio) {
        return await updateTipoSitio(selectedTipoSitio.idTipoSitio, values);
      } else {
        return await createTipoSitio(values);
      }
    },
    [selectedTipoSitio, createTipoSitio, updateTipoSitio]
  );

  // Open modal for creating a new tipo de sitio
  const handleCreate = useCallback(() => {
    setSelectedTipoSitio(null);
    setIsModalOpen(true);
  }, []);

  // Open modal for editing an existing tipo de sitio
  const handleEdit = useCallback((tipoSitio: TipoSitio) => {
    setSelectedTipoSitio(tipoSitio);
    setIsModalOpen(true);
  }, []);

  // Close the modal
  const handleCancel = useCallback(() => {
    setSelectedTipoSitio(null);
    setIsModalOpen(false);
  }, []);

  // Load tipos de sitio on component mount
  useEffect(() => {
    fetchTipoSitios();
  }, [fetchTipoSitios]);

  return {
    tipoSitios,
    selectedTipoSitio,
    loading,
    error,
    isModalOpen,
    fetchTipoSitios,
    fetchTipoSitioById,
    createTipoSitio,
    updateTipoSitio,
    deleteTipoSitio,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};