import { useState, useEffect, useCallback } from 'react';
import { tituladoService, Titulado } from '@/services/Titulados/tituladoService';
import { Models } from '@/types/types';

// Import the Area and Ficha services to get the lists for dropdowns
import { areaService } from '@/services/Areas/areaService';
import { fichaService } from '@/services/Fichas/fichaService';
type Area = Models['Area'];
type Ficha = Models['Ficha'];

export const useTitulado = () => {
  const [titulados, setTitulados] = useState<Titulado[]>([]);
  const [selectedTitulado, setSelectedTitulado] = useState<Titulado | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);
  const [fichas, setFichas] = useState<Ficha[]>([]);

  // Fetch all titulados
  const fetchTitulados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tituladoService.getAll();
      setTitulados(data);
    } catch (err) {
      setError('Error al cargar titulados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all areas for the dropdown
  const fetchAreas = useCallback(async () => {
    try {
      const data = await areaService.getAll();
      setAreas(data);
    } catch (err) {
      console.error('Error al cargar áreas:', err);
      // We don't set the main error state here to avoid blocking the UI
    }
  }, []);

  // Fetch all fichas for the dropdown
  const fetchFichas = useCallback(async () => {
    try {
      const data = await fichaService.getAll();
      setFichas(data);
    } catch (err) {
      console.error('Error al cargar fichas:', err);
      // We don't set the main error state here to avoid blocking the UI
    }
  }, []);

  // Fetch a single titulado by ID
  const fetchTituladoById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tituladoService.getById(id);
      setSelectedTitulado(data);
      return data;
    } catch (err) {
      setError('Error al cargar el titulado');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new titulado
  const createTitulado = useCallback(async (titulado: Partial<Titulado>) => {
    setLoading(true);
    setError(null);
    try {
      const newTitulado = await tituladoService.create(titulado);
      setTitulados((prev) => [...prev, newTitulado]);
      setIsModalOpen(false);
      return newTitulado;
    } catch (err) {
      setError('Error al crear el titulado');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing titulado
  const updateTitulado = useCallback(async (id: string, titulado: Partial<Titulado>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTitulado = await tituladoService.update(id, titulado);
      setTitulados((prev) => 
        prev.map((t) => (t.idTitulado === id ? updatedTitulado : t))
      );
      setSelectedTitulado(null);
      setIsModalOpen(false);
      return updatedTitulado;
    } catch (err) {
      setError('Error al actualizar el titulado');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a titulado
  const deleteTitulado = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await tituladoService.delete(id);
      setTitulados((prev) => prev.filter((t) => t.idTitulado !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el titulado');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = useCallback(
    async (values: Partial<Titulado>) => {
      if (selectedTitulado) {
        return await updateTitulado(selectedTitulado.idTitulado, values);
      } else {
        return await createTitulado(values);
      }
    },
    [selectedTitulado, createTitulado, updateTitulado]
  );

  // Open modal for creating a new titulado
  const handleCreate = useCallback(() => {
    setSelectedTitulado(null);
    setIsModalOpen(true);
  }, []);

  // Open modal for editing an existing titulado
  const handleEdit = useCallback((titulado: Titulado) => {
    setSelectedTitulado(titulado);
    setIsModalOpen(true);
  }, []);

  // Close the modal
  const handleCancel = useCallback(() => {
    setSelectedTitulado(null);
    setIsModalOpen(false);
  }, []);

  // Load titulados, areas, and fichas on component mount
  useEffect(() => {
    fetchTitulados();
    fetchAreas();
    fetchFichas();
  }, [fetchTitulados, fetchAreas, fetchFichas]);

  return {
    titulados,
    selectedTitulado,
    loading,
    error,
    isModalOpen,
    areas,
    fichas,
    fetchTitulados,
    fetchTituladoById,
    createTitulado,
    updateTitulado,
    deleteTitulado,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};