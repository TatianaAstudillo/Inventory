import { useState, useEffect, useCallback } from 'react';
import { tipoMovimientoService, TipoMovimiento } from '@/services/TipoMovimientos/tipoMovimientoService';

export const useTipoMovimiento = () => {
  const [tipoMovimientos, setTipoMovimientos] = useState<TipoMovimiento[]>([]);
  const [selectedTipoMovimiento, setSelectedTipoMovimiento] = useState<TipoMovimiento | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all tipos de movimiento
  const fetchTipoMovimientos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tipoMovimientoService.getAll();
      setTipoMovimientos(data);
    } catch (err) {
      setError('Error al cargar tipos de movimiento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single tipo de movimiento by ID
  const fetchTipoMovimientoById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tipoMovimientoService.getById(id);
      setSelectedTipoMovimiento(data);
      return data;
    } catch (err) {
      setError('Error al cargar el tipo de movimiento');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new tipo de movimiento
  const createTipoMovimiento = useCallback(async (tipoMovimiento: Partial<TipoMovimiento>) => {
    setLoading(true);
    setError(null);
    try {
      const newTipoMovimiento = await tipoMovimientoService.create(tipoMovimiento);
      setTipoMovimientos((prev) => [...prev, newTipoMovimiento]);
      setIsModalOpen(false);
      return newTipoMovimiento;
    } catch (err) {
      setError('Error al crear el tipo de movimiento');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing tipo de movimiento
  const updateTipoMovimiento = useCallback(async (id: string, tipoMovimiento: Partial<TipoMovimiento>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTipoMovimiento = await tipoMovimientoService.update(id, tipoMovimiento);
      setTipoMovimientos((prev) => 
        prev.map((tm) => (tm.idTipoMovimiento === id ? updatedTipoMovimiento : tm))
      );
      setSelectedTipoMovimiento(null);
      setIsModalOpen(false);
      return updatedTipoMovimiento;
    } catch (err) {
      setError('Error al actualizar el tipo de movimiento');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a tipo de movimiento
  const deleteTipoMovimiento = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await tipoMovimientoService.delete(id);
      setTipoMovimientos((prev) => prev.filter((tm) => tm.idTipoMovimiento !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el tipo de movimiento');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = useCallback(
    async (values: Partial<TipoMovimiento>) => {
      if (selectedTipoMovimiento) {
        return await updateTipoMovimiento(selectedTipoMovimiento.idTipoMovimiento, values);
      } else {
        return await createTipoMovimiento(values);
      }
    },
    [selectedTipoMovimiento, createTipoMovimiento, updateTipoMovimiento]
  );

  // Open modal for creating a new tipo de movimiento
  const handleCreate = useCallback(() => {
    setSelectedTipoMovimiento(null);
    setIsModalOpen(true);
  }, []);

  // Open modal for editing an existing tipo de movimiento
  const handleEdit = useCallback((tipoMovimiento: TipoMovimiento) => {
    setSelectedTipoMovimiento(tipoMovimiento);
    setIsModalOpen(true);
  }, []);

  // Close the modal
  const handleCancel = useCallback(() => {
    setSelectedTipoMovimiento(null);
    setIsModalOpen(false);
  }, []);

  // Load tipos de movimiento on component mount
  useEffect(() => {
    fetchTipoMovimientos();
  }, [fetchTipoMovimientos]);

  return {
    tipoMovimientos,
    selectedTipoMovimiento,
    loading,
    error,
    isModalOpen,
    fetchTipoMovimientos,
    fetchTipoMovimientoById,
    createTipoMovimiento,
    updateTipoMovimiento,
    deleteTipoMovimiento,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};