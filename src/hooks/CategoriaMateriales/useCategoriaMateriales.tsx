import { useState, useEffect, useCallback } from 'react';
import { categoriaMaterialService, CategoriaMaterial } from '@/services/CategoriaMateriales/categoriaMaterialService';

export const useCategoriaMaterial = () => {
  const [categoriasMaterial, setCategoriasMaterial] = useState<CategoriaMaterial[]>([]);
  const [selectedCategoriaMaterial, setSelectedCategoriaMaterial] = useState<CategoriaMaterial | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all categorías de material
  const fetchCategoriasMaterial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriaMaterialService.getAll();
      setCategoriasMaterial(data);
    } catch (err) {
      setError('Error al cargar categorías de material');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single categoría de material by ID
  const fetchCategoriaMaterialById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriaMaterialService.getById(id);
      setSelectedCategoriaMaterial(data);
      return data;
    } catch (err) {
      setError('Error al cargar la categoría de material');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new categoría de material
  const createCategoriaMaterial = useCallback(async (categoriaMaterial: Partial<CategoriaMaterial>) => {
    setLoading(true);
    setError(null);
    try {
      const newCategoriaMaterial = await categoriaMaterialService.create(categoriaMaterial);
      setCategoriasMaterial((prev) => [...prev, newCategoriaMaterial]);
      setIsModalOpen(false);
      return newCategoriaMaterial;
    } catch (err) {
      setError('Error al crear la categoría de material');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing categoría de material
  const updateCategoriaMaterial = useCallback(async (id: string, categoriaMaterial: Partial<CategoriaMaterial>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCategoriaMaterial = await categoriaMaterialService.update(id, categoriaMaterial);
      setCategoriasMaterial((prev) => 
        prev.map((c) => (c.idCategoriaMaterial === id ? updatedCategoriaMaterial : c))
      );
      setSelectedCategoriaMaterial(null);
      setIsModalOpen(false);
      return updatedCategoriaMaterial;
    } catch (err) {
      setError('Error al actualizar la categoría de material');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a categoría de material
  const deleteCategoriaMaterial = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await categoriaMaterialService.delete(id);
      setCategoriasMaterial((prev) => prev.filter((c) => c.idCategoriaMaterial !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar la categoría de material');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = useCallback(
    async (values: Partial<CategoriaMaterial>) => {
      if (selectedCategoriaMaterial) {
        return await updateCategoriaMaterial(selectedCategoriaMaterial.idCategoriaMaterial, values);
      } else {
        return await createCategoriaMaterial(values);
      }
    },
    [selectedCategoriaMaterial, createCategoriaMaterial, updateCategoriaMaterial]
  );

  // Open modal for creating a new categoría de material
  const handleCreate = useCallback(() => {
    setSelectedCategoriaMaterial(null);
    setIsModalOpen(true);
  }, []);

  // Open modal for editing an existing categoría de material
  const handleEdit = useCallback((categoriaMaterial: CategoriaMaterial) => {
    setSelectedCategoriaMaterial(categoriaMaterial);
    setIsModalOpen(true);
  }, []);

  // Close the modal
  const handleCancel = useCallback(() => {
    setSelectedCategoriaMaterial(null);
    setIsModalOpen(false);
  }, []);

  // Load categorías de material on component mount
  useEffect(() => {
    fetchCategoriasMaterial();
  }, [fetchCategoriasMaterial]);

  return {
    categoriasMaterial,
    selectedCategoriaMaterial,
    loading,
    error,
    isModalOpen,
    fetchCategoriasMaterial,
    fetchCategoriaMaterialById,
    createCategoriaMaterial,
    updateCategoriaMaterial,
    deleteCategoriaMaterial,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};