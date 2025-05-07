import { useState, useEffect, useCallback } from 'react';
import { detallesService, Detalle } from '@/services/Detalles/detallesService';
import { personaService, Persona } from '@/services/Personas/personaService';
import { materialService, Material } from '@/services/Materiales/materialesServices';

export const useDetalles = () => {
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [selectedDetalle, setSelectedDetalle] = useState<Detalle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Related data for dropdowns
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);

  // Fetch all detalles
  const fetchDetalles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await detallesService.getAll();
      setDetalles(data);
    } catch (err) {
      setError('Error al cargar detalles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch related data for dropdowns
  const fetchRelatedData = useCallback(async () => {
    setLoading(true);
    try {
      const [personasData, materialesData] = await Promise.all([
        personaService.getAll(),
        materialService.getAll()
      ]);
      setPersonas(personasData);
      setMateriales(materialesData);
    } catch (err) {
      setError('Error al cargar datos relacionados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single detalle by ID
  const fetchDetalleById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await detallesService.getById(id);
      setSelectedDetalle(data);
      return data;
    } catch (err) {
      setError('Error al cargar el detalle');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new detalle
  const createDetalle = useCallback(async (detalle: Partial<Detalle>) => {
    setLoading(true);
    setError(null);
    try {
      const newDetalle = await detallesService.create(detalle);
      setDetalles((prev) => [...prev, newDetalle]);
      setIsModalOpen(false);
      return newDetalle;
    } catch (err) {
      setError('Error al crear el detalle');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing detalle
  const updateDetalle = useCallback(async (id: string, detalle: Partial<Detalle>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedDetalle = await detallesService.update(id, detalle);
      setDetalles((prev) => 
        prev.map((d) => (d.idDetalle === id ? updatedDetalle : d))
      );
      setSelectedDetalle(null);
      setIsModalOpen(false);
      return updatedDetalle;
    } catch (err) {
      setError('Error al actualizar el detalle');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a detalle
  const deleteDetalle = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await detallesService.delete(id);
      setDetalles((prev) => prev.filter((d) => d.idDetalle !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el detalle');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = useCallback(
    async (values: Partial<Detalle>) => {
      if (selectedDetalle) {
        return await updateDetalle(selectedDetalle.idDetalle, values);
      } else {
        return await createDetalle(values);
      }
    },
    [selectedDetalle, createDetalle, updateDetalle]
  );

  // Open modal for creating a new detalle
  const handleCreate = useCallback(() => {
    setSelectedDetalle(null);
    setIsModalOpen(true);
  }, []);

  // Open modal for editing an existing detalle
  const handleEdit = useCallback((detalle: Detalle) => {
    setSelectedDetalle(detalle);
    setIsModalOpen(true);
  }, []);

  // Close the modal
  const handleCancel = useCallback(() => {
    setSelectedDetalle(null);
    setIsModalOpen(false);
  }, []);

  // Load detalles and related data on component mount
  useEffect(() => {
    fetchDetalles();
    fetchRelatedData();
  }, [fetchDetalles, fetchRelatedData]);

  return {
    detalles,
    selectedDetalle,
    loading,
    error,
    isModalOpen,
    personas,
    materiales,
    fetchDetalles,
    fetchDetalleById,
    createDetalle,
    updateDetalle,
    deleteDetalle,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};