import { useState, useEffect, useCallback } from 'react';
import { rolService, Rol } from '@/services/Roles/rolService';

export const useRol = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all roles
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rolService.getAll();
      setRoles(data);
    } catch (err) {
      setError('Error al cargar roles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single rol by ID
  const fetchRolById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await rolService.getById(id);
      setSelectedRol(data);
      return data;
    } catch (err) {
      setError('Error al cargar el rol');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new rol
  const createRol = useCallback(async (rol: Partial<Rol>) => {
    setLoading(true);
    setError(null);
    try {
      const newRol = await rolService.create(rol);
      setRoles((prev) => [...prev, newRol]);
      setIsModalOpen(false);
      return newRol;
    } catch (err) {
      setError('Error al crear el rol');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing rol
  const updateRol = useCallback(async (id: string, rol: Partial<Rol>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRol = await rolService.update(id, rol);
      setRoles((prev) => 
        prev.map((r) => (r.idRol === id ? updatedRol : r))
      );
      setSelectedRol(null);
      setIsModalOpen(false);
      return updatedRol;
    } catch (err) {
      setError('Error al actualizar el rol');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a rol
  const deleteRol = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await rolService.delete(id);
      setRoles((prev) => prev.filter((r) => r.idRol !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el rol');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = useCallback(
    async (values: Partial<Rol>) => {
      if (selectedRol) {
        return await updateRol(selectedRol.idRol, values);
      } else {
        return await createRol(values);
      }
    },
    [selectedRol, createRol, updateRol]
  );

  // Open modal for creating a new rol
  const handleCreate = useCallback(() => {
    setSelectedRol(null);
    setIsModalOpen(true);
  }, []);

  // Open modal for editing an existing rol
  const handleEdit = useCallback((rol: Rol) => {
    setSelectedRol(rol);
    setIsModalOpen(true);
  }, []);

  // Close the modal
  const handleCancel = useCallback(() => {
    setSelectedRol(null);
    setIsModalOpen(false);
  }, []);

  // Load roles on component mount
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    selectedRol,
    loading,
    error,
    isModalOpen,
    fetchRoles,
    fetchRolById,
    createRol,
    updateRol,
    deleteRol,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};