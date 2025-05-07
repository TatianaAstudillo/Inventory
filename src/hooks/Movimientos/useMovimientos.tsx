import { useState, useEffect, useCallback } from 'react';
import { movimientoService, Movimiento } from '@/services/Movimientos/movimientoService';
import { Models } from '@/types/types';

// Import the TipoMovimiento and Persona services to get the lists for dropdowns
import { tipoMovimientoService } from '@/services/TipoMovimientos/tipoMovimientoService';
import { personaService } from '@/services/Personas/personaService';
type TipoMovimiento = Models['TipoMovimiento'];
type Persona = Models['Persona'];

export const useMovimiento = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [selectedMovimiento, setSelectedMovimiento] = useState<Movimiento | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoMovimientos, setTipoMovimientos] = useState<TipoMovimiento[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);

  // Fetch all movimientos
  const fetchMovimientos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await movimientoService.getAll();
      setMovimientos(data);
    } catch (err) {
      setError('Error al cargar movimientos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all tipoMovimientos for the dropdown
  const fetchTipoMovimientos = useCallback(async () => {
    try {
      const data = await tipoMovimientoService.getAll();
      setTipoMovimientos(data);
    } catch (err) {
      console.error('Error al cargar tipos de movimiento:', err);
      // We don't set the main error state here to avoid blocking the UI
    }
  }, []);

  // Fetch all personas for the dropdown
  const fetchPersonas = useCallback(async () => {
    try {
      const data = await personaService.getAll();
      setPersonas(data);
    } catch (err) {
      console.error('Error al cargar personas:', err);
      // We don't set the main error state here to avoid blocking the UI
    }
  }, []);

  // Fetch a single movimiento by ID
  const fetchMovimientoById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await movimientoService.getById(id);
      setSelectedMovimiento(data);
      return data;
    } catch (err) {
      setError('Error al cargar el movimiento');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new movimiento
  const createMovimiento = useCallback(async (movimiento: Partial<Movimiento>) => {
    setLoading(true);
    setError(null);
    try {
      const newMovimiento = await movimientoService.create(movimiento);
      setMovimientos((prev) => [...prev, newMovimiento]);
      setIsModalOpen(false);
      return newMovimiento;
    } catch (err) {
      setError('Error al crear el movimiento');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing movimiento
  const updateMovimiento = useCallback(async (id: string, movimiento: Partial<Movimiento>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedMovimiento = await movimientoService.update(id, movimiento);
      setMovimientos((prev) => 
        prev.map((m) => (m.idMovimiento === id ? updatedMovimiento : m))
      );
      setSelectedMovimiento(null);
      setIsModalOpen(false);
      return updatedMovimiento;
    } catch (err) {
      setError('Error al actualizar el movimiento');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a movimiento
  const deleteMovimiento = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await movimientoService.delete(id);
      setMovimientos((prev) => prev.filter((m) => m.idMovimiento !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el movimiento');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = useCallback(
    async (values: Partial<Movimiento>) => {
      if (selectedMovimiento) {
        return await updateMovimiento(selectedMovimiento.idMovimiento, values);
      } else {
        return await createMovimiento(values);
      }
    },
    [selectedMovimiento, createMovimiento, updateMovimiento]
  );

  // Open modal for creating a new movimiento
  const handleCreate = useCallback(() => {
    setSelectedMovimiento(null);
    setIsModalOpen(true);
  }, []);

  // Open modal for editing an existing movimiento
  const handleEdit = useCallback((movimiento: Movimiento) => {
    setSelectedMovimiento(movimiento);
    setIsModalOpen(true);
  }, []);

  // Close the modal
  const handleCancel = useCallback(() => {
    setSelectedMovimiento(null);
    setIsModalOpen(false);
  }, []);

  // Load movimientos, tipoMovimientos, and personas on component mount
  useEffect(() => {
    fetchMovimientos();
    fetchTipoMovimientos();
    fetchPersonas();
  }, [fetchMovimientos, fetchTipoMovimientos, fetchPersonas]);

  return {
    movimientos,
    selectedMovimiento,
    loading,
    error,
    isModalOpen,
    tipoMovimientos,
    personas,
    fetchMovimientos,
    fetchMovimientoById,
    createMovimiento,
    updateMovimiento,
    deleteMovimiento,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};