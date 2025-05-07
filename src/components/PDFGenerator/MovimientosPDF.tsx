import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface MovimientosPDFProps {
  data: Partial<Models['Movimiento']>[];
  startDate?: string;
  endDate?: string;
}

const MovimientosPDF: React.FC<MovimientosPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idMovimiento', width: '15%' },
    { header: 'Tipo de Movimiento', accessor: 'tipomovimiento.tipoMovimiento', width: '25%' },
    { header: 'Persona', accessor: 'movimientopersona.nombre', width: '25%' },
    { header: 'Estado', accessor: 'activo', width: '15%' },
    { header: 'Fecha Creación', accessor: 'fechaCreacion', width: '20%' },
  ];

  // Transformar los datos para mostrar valores legibles
  const transformedData = data.map(movimiento => ({
    ...movimiento,
    activo: movimiento.activo ? 'Activo' : 'Inactivo',
    fechaCreacion: movimiento.fechaCreacion ? new Date(movimiento.fechaCreacion).toLocaleDateString('es-ES') : '-',
    // Formatear nombre completo de la persona
    movimientopersona: movimiento.movimientopersona ? {
      ...movimiento.movimientopersona,
      nombre: `${movimiento.movimientopersona.nombre || ''} ${movimiento.movimientopersona.apellido || ''}`
    } : undefined
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Movimientos" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default MovimientosPDF;