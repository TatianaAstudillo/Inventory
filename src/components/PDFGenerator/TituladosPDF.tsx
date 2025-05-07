import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface TituladosPDFProps {
  data: Partial<Models['Titulado']>[];
  startDate?: string;
  endDate?: string;
}

const TituladosPDF: React.FC<TituladosPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idTitulado', width: '15%' },
    { header: 'Titulado', accessor: 'Titulado', width: '25%' },
    { header: 'Área', accessor: 'area.Area', width: '20%' },
    { header: 'Ficha', accessor: 'ficha.numFicha', width: '15%' },
    { header: 'Estado', accessor: 'activo', width: '10%' },
    { header: 'Fecha Creación', accessor: 'fechaCreacion', width: '15%' },
  ];

  // Transformar los datos para mostrar valores legibles
  const transformedData = data.map(titulado => ({
    ...titulado,
    activo: titulado.activo ? 'Activo' : 'Inactivo',
    fechaCreacion: titulado.fechaCreacion ? new Date(titulado.fechaCreacion).toLocaleDateString('es-ES') : '-'
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Titulados" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default TituladosPDF;