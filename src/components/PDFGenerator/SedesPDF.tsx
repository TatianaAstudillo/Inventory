import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface SedesPDFProps {
  data: Partial<Models['Sede']>[];
  startDate?: string;
  endDate?: string;
}

const SedesPDF: React.FC<SedesPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idSede', width: '15%' },
    { header: 'Sede', accessor: 'sede', width: '25%' },
    { header: 'Centro', accessor: 'centro.Centro', width: '20%' },
    { header: 'Dirección', accessor: 'Direccion', width: '25%' },
    { header: 'Estado', accessor: 'activo', width: '15%' },
  ];

  // Transformar los datos para mostrar valores legibles
  const transformedData = data.map(sede => ({
    ...sede,
    activo: sede.activo ? 'Activo' : 'Inactivo'
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Sedes" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default SedesPDF;