import { useState, useEffect, useCallback } from 'react';
import { centroService, Centro } from '@/services/Centros/centroService';
import { Models } from '@/types/types';

// Import the Municipio service to get the list of municipalities
import { municipioService } from '@/services/Municipios/municipioService';
type Municipio = Models['Municipio'];

export const useCentro = () => {
  const [centros, setCentros] = useState<Centro[]>([]);
  const [selectedCentro, setSelectedCentro] = useState<Centro | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  // Fetch all centros
  const fetchCentros = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await centroService.getAll();
      setCentros(data);
    } catch (err) {
      setError('Error al cargar centros');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all municipios for the dropdown
  const fetchMunicipios = useCallback(async () => {
    try {
      const data = await municipioService.getAll();
      setMunicipios(data);
    } catch (err) {
      console.error('Error al cargar municipios:', err);
      // We don't set the main error state here to avoid blocking the UI
    }
  }, []);

  // Fetch a single centro by ID
  const fetchCentroById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await centroService.getById(id);
      setSelectedCentro(data);
      return data;
    } catch (err) {
      setError('Error al cargar el centro');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new centro
  const createCentro = useCallback(async (centro: Partial<Centro>) => {
    setLoading(true);
    setError(null);
    try {
      const newCentro = await centroService.create(centro);
      setCentros((prev) => [...prev, newCentro]);
      setIsModalOpen(false);
      return newCentro;
    } catch (err) {
      setError('Error al crear el centro');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing centro
  const updateCentro = useCallback(async (id: string, centro: Partial<Centro>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCentro = await centroService.update(id, centro);
      setCentros((prev) => 
        prev.map((c) => (c.idCentro === id ? updatedCentro : c))
      );
      setSelectedCentro(null);
      setIsModalOpen(false);
      return updatedCentro;
    } catch (err) {
      setError('Error al actualizar el centro');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a centro
  const deleteCentro = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await centroService.delete(id);
      setCentros((prev) => prev.filter((c) => c.idCentro !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el centro');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = useCallback(
    async (values: Partial<Centro>) => {
      if (selectedCentro) {
        return await updateCentro(selectedCentro.idCentro, values);
      } else {
        return await createCentro(values);
      }
    },
    [selectedCentro, createCentro, updateCentro]
  );

  // Open modal for creating a new centro
  const handleCreate = useCallback(() => {
    setSelectedCentro(null);
    setIsModalOpen(true);
  }, []);

  // Open modal for editing an existing centro
  const handleEdit = useCallback((centro: Centro) => {
    setSelectedCentro(centro);
    setIsModalOpen(true);
  }, []);

  // Close the modal
  const handleCancel = useCallback(() => {
    setSelectedCentro(null);
    setIsModalOpen(false);
  }, []);

  // Load centros and municipios on component mount
  useEffect(() => {
    fetchCentros();
    fetchMunicipios();
  }, [fetchCentros, fetchMunicipios]);

  return {
    centros,
    selectedCentro,
    loading,
    error,
    isModalOpen,
    municipios,
    fetchCentros,
    fetchCentroById,
    createCentro,
    updateCentro,
    deleteCentro,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};