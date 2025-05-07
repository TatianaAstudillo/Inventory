import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface MunicipioPDFProps {
  data: Partial<Models['Municipio']>[];
  startDate?: string;
  endDate?: string;
}

const MunicipioPDF: React.FC<MunicipioPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idMunicipio', width: '20%' },
    { header: 'Municipio', accessor: 'municipio', width: '40%' },
    { header: 'Estado', accessor: 'activo', width: '20%' },
    { header: 'Fecha de Creación', accessor: 'fechaCreacion', width: '20%' },
  ];

  // Transformar los datos para mostrar valores legibles
  const transformedData = data.map(municipio => ({
    ...municipio,
    activo: municipio.activo ? 'Activo' : 'Inactivo',
    fechaCreacion: municipio.fechaCreacion ? new Date(municipio.fechaCreacion).toLocaleDateString('es-ES') : '-'
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Municipios" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default MunicipioPDF;