import { useState, useEffect, useCallback } from "react";
import { sedeService, Sede } from "@/services/Sedes/SedeService";
import { Models } from "@/types/types";

// Import the Centro service to get the list of centers
import { centroService } from "@/services/Centros/centroService";
type Centro = Models["Centro"];

export const useSede = () => {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [selectedSede, setSelectedSede] = useState<Sede | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [centros, setCentros] = useState<Centro[]>([]);

  // Fetch all sedes
  const fetchSedes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sedeService.getAll();
      setSedes(data);
    } catch (err) {
      setError("Error al cargar sedes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all centros for the dropdown
  const fetchCentros = useCallback(async () => {
    try {
      const data = await centroService.getAll();
      setCentros(data);
    } catch (err) {
      console.error("Error al cargar centros:", err);
      // We don't set the main error state here to avoid blocking the UI
    }
  }, []);

  // Fetch a single sede by ID
  const fetchSedeById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sedeService.getById(id);
      setSelectedSede(data);
      return data;
    } catch (err) {
      setError("Error al cargar la sede");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new sede
  const createSede = useCallback(async (sede: Partial<Sede>) => {
    setLoading(true);
    setError(null);
    try {
      const newSede = await sedeService.create(sede);
      setSedes((prev) => [...prev, newSede]);
      setIsModalOpen(false);
      return newSede;
    } catch (err) {
      setError("Error al crear la sede");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing sede
  const updateSede = useCallback(async (id: string, sede: Partial<Sede>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSede = await sedeService.update(id, sede);
      setSedes((prev) => prev.map((s) => (s.idSede === id ? updatedSede : s)));
      setSelectedSede(null);
      setIsModalOpen(false);
      return updatedSede;
    } catch (err) {
      setError("Error al actualizar la sede");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a sede
  const deleteSede = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await sedeService.delete(id);
      setSedes((prev) => prev.filter((s) => s.idSede !== id));
      return true;
    } catch (err) {
      setError("Error al eliminar la sede");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = useCallback(
    async (values: Partial<Sede>) => {
      if (selectedSede) {
        return await updateSede(selectedSede.idSede, values);
      } else {
        return await createSede(values);
      }
    },
    [selectedSede, createSede, updateSede]
  );

  // Open modal for creating a new sede
  const handleCreate = useCallback(() => {
    setSelectedSede(null);
    setIsModalOpen(true);
  }, []);

  // Open modal for editing an existing sede
  const handleEdit = useCallback((sede: Sede) => {
    setSelectedSede(sede);
    setIsModalOpen(true);
  }, []);

  // Close the modal
  const handleCancel = useCallback(() => {
    setSelectedSede(null);
    setIsModalOpen(false);
  }, []);

  // Load sedes and centros on component mount
  useEffect(() => {
    fetchSedes();
    fetchCentros();
  }, [fetchSedes, fetchCentros]);

  return {
    sedes,
    selectedSede,
    loading,
    error,
    isModalOpen,
    centros,
    fetchSedes,
    fetchSedeById,
    createSede,
    updateSede,
    deleteSede,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};
