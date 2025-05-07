import { DataTable } from '@/components/Table/DataTable';
import { GenericForm, FieldDefinition } from '@/components/Form/GenericForm';
import { useArea } from '@/hooks/Areas/useAreas';
import { Area } from '@/services/Areas/areaService';
import { Modal } from '@heroui/react';
import { GenericBarChart } from '@/components/Charts/GenericBarChart';

export const AreaManager = () => {
  const {
    areas,
    selectedArea,
    loading,
    error,
    isModalOpen,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteArea,
  } = useArea();

  // Define columns for the DataTable
  const columns = [
    { 
      accessorKey: 'Area' as keyof Area, 
      header: 'Área',
      sortable: true 
    },
    { 
      accessorKey: 'activo' as keyof Area, 
      header: 'Estado',
      sortable: true,
      cell: (row: any) => row.activo ? 'Activo' : 'Inactivo'
    },
    { 
      accessorKey: 'fechaCreacion' as keyof Area, 
      header: 'Fecha de Creación',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'fechaActualización' as keyof Area, 
      header: 'Fecha de Actualización',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaActualización ? new Date(row.fechaActualización).toLocaleDateString() : 'N/A'
    },
  ];

 
  const fields: FieldDefinition<Area>[] = [
    { name: 'Area', label: 'Nombre del Área', required: true, type: 'text' },
    {
      name: 'activo',
      label: 'Estado',
      type: 'checkbox',
      required: false
    },
  ];


  const handleFormSubmit = async (values: Partial<Area>) => {
    if (selectedArea) {
      values.fechaActualización = new Date();
    }
    // Si no se proporciona un valor para activo en un nuevo registro, establecerlo como true
    if (!selectedArea && values.activo === undefined) {
      values.activo = true;
    }
    return await handleSubmit(values);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Gráfico de barras para mostrar áreas creadas por mes */}
      <div className="mb-8">
        <GenericBarChart
          data={areas}
          dateField="fechaCreacion"
          title="Áreas creadas por mes"
        />
      </div>

      <DataTable<Area>
        data={areas}
        columns={columns}
        title="Gestión de Áreas"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteArea}
        getRowId={(row) => row.idArea}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedArea ? 'Editar Área' : 'Crear Área'}
          className="max-w-md z-50"
        >
          <GenericForm<Area>
            fields={fields}
            initialValues={selectedArea || { activo: true }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};