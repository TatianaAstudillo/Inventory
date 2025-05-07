import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface MaterialesPDFProps {
  data: Partial<Models['Material']>[];
  startDate?: string;
  endDate?: string;
}

const MaterialesPDF: React.FC<MaterialesPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idMaterial', width: '10%' },
    { header: 'Nombre', accessor: 'nombreMaterial', width: '20%' },
    { header: 'Descripción', accessor: 'descripcion', width: '20%' },
    { header: 'Stock', accessor: 'stock', width: '10%' },
    { header: 'Tipo', accessor: 'tipoMaterial.Tipo', width: '15%' },
    { header: 'Unidad', accessor: 'unidadMedida.unidadMedida', width: '15%' },
    { header: 'Caduca', accessor: 'Caduca', width: '10%' },
  ];

  // Transformar los datos para mostrar valores legibles
  const transformedData = data.map(material => ({
    ...material,
    Caduca: material.Caduca ? 'Sí' : 'No'
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Materiales" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default MaterialesPDF;