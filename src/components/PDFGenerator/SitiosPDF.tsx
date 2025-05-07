import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface SitiosPDFProps {
  data: Partial<Models['Sitio']>[];
  startDate?: string;
  endDate?: string;
}

const SitiosPDF: React.FC<SitiosPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idSitio', width: '20%' },
    { header: 'Sitio', accessor: 'sitio', width: '30%' },
    { header: 'Tipo de Sitio', accessor: 'tipositio.TipoSitio', width: '25%' },
    { header: 'Estado', accessor: 'activo', width: '10%' },
    { header: 'Fecha Creación', accessor: 'fechaCreacion', width: '15%' },
  ];

  // Transformar los datos para mostrar valores legibles
  const transformedData = data.map(sitio => ({
    ...sitio,
    activo: sitio.activo ? 'Activo' : 'Inactivo',
    fechaCreacion: sitio.fechaCreacion ? new Date(sitio.fechaCreacion).toLocaleDateString('es-ES') : '-'
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Sitios" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default SitiosPDF;