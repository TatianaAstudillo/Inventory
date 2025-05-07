import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface CentrosPDFProps {
  data: Partial<Models['Centro']>[];
  startDate?: string;
  endDate?: string;
}

const CentrosPDF: React.FC<CentrosPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idCentro', width: '15%' },
    { header: 'Centro', accessor: 'Centro', width: '30%' },
    { header: 'Municipio', accessor: 'municipio.municipio', width: '25%' },
    { header: 'Estado', accessor: 'activo', width: '15%' },
    { header: 'Fecha Creación', accessor: 'fechaCreacion', width: '15%' },
  ];

  // Transformar los datos para mostrar valores legibles
  const transformedData = data.map(centro => ({
    ...centro,
    activo: centro.activo ? 'Activo' : 'Inactivo',
    fechaCreacion: centro.fechaCreacion ? new Date(centro.fechaCreacion).toLocaleDateString('es-ES') : '-'
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Centros" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default CentrosPDF;