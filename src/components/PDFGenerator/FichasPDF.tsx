import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface FichasPDFProps {
  data: Partial<Models['Ficha']>[];
  startDate?: string;
  endDate?: string;
}

const FichasPDF: React.FC<FichasPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idFicha', width: '20%' },
    { header: 'Número de Ficha', accessor: 'numFicha', width: '30%' },
    { header: 'Cantidad de Aprendices', accessor: 'cantidadAprendices', width: '30%' },
    { header: 'Estado', accessor: 'activo', width: '20%' },
  ];

  // Transformar los datos para mostrar "Activo" o "Inactivo" en lugar de true/false
  const transformedData = data.map(ficha => ({
    ...ficha,
    activo: ficha.activo ? 'Activo' : 'Inactivo'
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Fichas" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default FichasPDF;