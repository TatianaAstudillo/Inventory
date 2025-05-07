import React, { useState, useEffect } from 'react';
import { Card } from '@heroui/react';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import CentrosPDF from '../../components/PDFGenerator/CentrosPDF';
import { Models } from '../../types/types';

// Simulación de datos - En un caso real, esto vendría de una API
const mockCentros: Partial<Models['Centro']>[] = [
  {
    idCentro: '1',
    Centro: 'Centro de Tecnología',
    municipio: { municipio: 'Bogotá' },
    activo: true,
    fechaCreacion: new Date('2023-01-10'),
  },
  {
    idCentro: '2',
    Centro: 'Centro de Diseño',
    municipio: { municipio: 'Medellín' },
    activo: true,
    fechaCreacion: new Date('2023-02-15'),
  },
  {
    idCentro: '3',
    Centro: 'Centro de Construcción',
    municipio: { municipio: 'Cali' },
    activo: true,
    fechaCreacion: new Date('2023-03-20'),
  },
  // Más datos simulados...
];

const SedesReportePage: React.FC = () => {
  const [centros, setCentros] = useState<Partial<Models['Centro']>[]>([]);
  const [filteredCentros, setFilteredCentros] = useState<Partial<Models['Centro']>[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulación de carga de datos - En un caso real, esto sería una llamada a API
    setTimeout(() => {
      setCentros(mockCentros);
      setFilteredCentros(mockCentros);
      setLoading(false);
    }, 500);
  }, []);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredCentros(centros);
      return;
    }

    const filtered = centros.filter(centro => {
      if (!centro.fechaCreacion) return false;
      
      const creationDate = new Date(centro.fechaCreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Ajustar la fecha final para incluir todo el día
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredCentros(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reporte de Centros</h1>
      
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
            <h2 className="text-lg font-semibold">Listado de Centros</h2>
            <PDFDownloader
              document={<CentrosPDF data={filteredCentros} startDate={startDate} endDate={endDate} />}
              fileName="reporte-centros"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Centro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Municipio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCentros.map((centro) => (
                    <tr key={centro.idCentro}>
                      <td className="px-6 py-4 whitespace-nowrap">{centro.idCentro}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{centro.Centro}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{centro.municipio?.municipio}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${centro.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {centro.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {centro.fechaCreacion ? new Date(centro.fechaCreacion).toLocaleDateString('es-ES') : '-'}
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

export default SedesReportePage;