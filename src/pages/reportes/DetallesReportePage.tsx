import React, { useState, useEffect } from 'react';
import { Card } from '@heroui/react';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import DetallesPDF from '../../components/PDFGenerator/DetallesPDF';
import { Models } from '../../types/types';

// Simulación de datos - En un caso real, esto vendría de una API
const mockDetalles: Partial<Models['Detalles']>[] = [
  {
    idDetalle: '1',
    Material: '1',
    cantidaSolicitada: 5,
    descripcion: 'Material para taller de construcción',
    PersonaEncargada: '1',
    PersonaSolicita: '2',
    PersonaAprueba: '3',
    activo: true,
    fechaCreacion: new Date('2023-01-15'),
    personaencargada: { nombre: 'Juan', apellido: 'Pérez' },
    personasolicita: { nombre: 'María', apellido: 'López' },
    personaaprueba: { nombre: 'Carlos', apellido: 'Rodríguez' }
  },
  {
    idDetalle: '2',
    Material: '2',
    cantidaSolicitada: 10,
    descripcion: 'Material para laboratorio',
    PersonaEncargada: '1',
    PersonaSolicita: '4',
    PersonaAprueba: '3',
    activo: true,
    fechaCreacion: new Date('2023-02-10'),
    personaencargada: { nombre: 'Juan', apellido: 'Pérez' },
    personasolicita: { nombre: 'Ana', apellido: 'Martínez' },
    personaaprueba: { nombre: 'Carlos', apellido: 'Rodríguez' }
  },
  // Más datos simulados...
];

const DetallesReportePage: React.FC = () => {
  const [detalles, setDetalles] = useState<Partial<Models['Detalles']>[]>([]);
  const [filteredDetalles, setFilteredDetalles] = useState<Partial<Models['Detalles']>[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulación de carga de datos - En un caso real, esto sería una llamada a API
    setTimeout(() => {
      setDetalles(mockDetalles);
      setFilteredDetalles(mockDetalles);
      setLoading(false);
    }, 500);
  }, []);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredDetalles(detalles);
      return;
    }

    const filtered = detalles.filter(detalle => {
      if (!detalle.fechaCreacion) return false;
      
      const creationDate = new Date(detalle.fechaCreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Ajustar la fecha final para incluir todo el día
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredDetalles(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reporte de Detalles</h1>
      
      <Card className="mb-6">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Filtrar por Fecha</h2>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onFilter={handleFilter}
          />
        </div>
      </Card>
      
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Listado de Detalles</h2>
            <PDFDownloader
              document={<DetallesPDF data={filteredDetalles} startDate={startDate} endDate={endDate} />}
              fileName="reporte-detalles"
            />
          </div>
          
          {loading ? (
            <p>Cargando datos...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Encargado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aprobador</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDetalles.map((detalle) => (
                    <tr key={detalle.idDetalle}>
                      <td className="px-6 py-4 whitespace-nowrap">{detalle.idDetalle}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{detalle.cantidaSolicitada}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{detalle.descripcion}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {detalle.personasolicita ? `${detalle.personasolicita.nombre} ${detalle.personasolicita.apellido}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {detalle.personaencargada ? `${detalle.personaencargada.nombre} ${detalle.personaencargada.apellido}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {detalle.personaaprueba ? `${detalle.personaaprueba.nombre} ${detalle.personaaprueba.apellido}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${detalle.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {detalle.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {detalle.fechaCreacion ? new Date(detalle.fechaCreacion).toLocaleDateString('es-ES') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DetallesReportePage;