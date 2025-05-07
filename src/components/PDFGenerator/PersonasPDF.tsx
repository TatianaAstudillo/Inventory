import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface PersonasPDFProps {
  data: Partial<Models['Persona']>[];
  startDate?: string;
  endDate?: string;
}

const PersonasPDF: React.FC<PersonasPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idPersona', width: '10%' },
    { header: 'Identificación', accessor: 'identificacion', width: '15%' },
    { header: 'Nombre', accessor: 'nombre', width: '15%' },
    { header: 'Apellido', accessor: 'apellido', width: '15%' },
    { header: 'Correo', accessor: 'correo', width: '20%' },
    { header: 'Teléfono', accessor: 'telefono', width: '15%' },
    { header: 'Estado', accessor: 'activo', width: '10%' },
  ];

  // Transformar los datos para mostrar valores legibles
  const transformedData = data.map(persona => ({
    ...persona,
    activo: persona.activo ? 'Activo' : 'Inactivo'
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Personas" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default PersonasPDF;