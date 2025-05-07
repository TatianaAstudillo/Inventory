import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface DetallesPDFProps {
  data: Partial<Models['Detalles']>[];
  startDate?: string;
  endDate?: string;
}

const DetallesPDF: React.FC<DetallesPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idDetalle', width: '10%' },
    { header: 'Cantidad', accessor: 'cantidaSolicitada', width: '10%' },
    { header: 'Descripción', accessor: 'descripcion', width: '20%' },
    { header: 'Solicitante', accessor: 'personasolicita.nombre', width: '20%' },
    { header: 'Encargado', accessor: 'personaencargada.nombre', width: '20%' },
    { header: 'Aprobador', accessor: 'personaaprueba.nombre', width: '20%' },
  ];

  // Transformar los datos para mostrar valores legibles
  const transformedData = data.map(detalle => ({
    ...detalle,
    // Formatear nombres completos para personas
    personasolicita: detalle.personasolicita ? {
      ...detalle.personasolicita,
      nombre: `${detalle.personasolicita.nombre || ''} ${detalle.personasolicita.apellido || ''}`
    } : undefined,
    personaencargada: detalle.personaencargada ? {
      ...detalle.personaencargada,
      nombre: `${detalle.personaencargada.nombre || ''} ${detalle.personaencargada.apellido || ''}`
    } : undefined,
    personaaprueba: detalle.personaaprueba ? {
      ...detalle.personaaprueba,
      nombre: `${detalle.personaaprueba.nombre || ''} ${detalle.personaaprueba.apellido || ''}`
    } : undefined
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Detalles" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default DetallesPDF;