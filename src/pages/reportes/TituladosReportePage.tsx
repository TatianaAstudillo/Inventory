import React, { useState, useEffect } from 'react';
import { Card } from '@heroui/react';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import TituladosPDF from '../../components/PDFGenerator/TituladosPDF';
import { Models } from '../../types/types';

// Simulación de datos - En un caso real, esto vendría de una API
const mockTitulados: Partial<Models['Titulado']>[] = [
  {
    idTitulado: '1',
    Titulado: 'Técnico en Sistemas',
    Area: '1',
    Ficha: '1',
    activo: true,
    fechaCreacion: new Date('2023-01-15'),
    area: { Area: 'Informática' },
    ficha: { numFicha: 1234567 }
  },
  {
    idTitulado: '2',
    Titulado: 'Técnico en Electricidad',
    Area: '2',
    Ficha: '2',
    activo: true,
    fechaCreacion: new Date('2023-02-20'),
    area: { Area: 'Electricidad' },
    ficha: { numFicha: 7654321 }
  },
  // Más datos simulados...
];

const TituladosReportePage: React.FC = () => {
  const [titulados, setTitulados] = useState<Partial<Models['Titulado']>[]>([]);
  const [filteredTitulados, setFilteredTitulados] = useState<Partial<Models['Titulado']>[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulación de carga de datos - En un caso real, esto sería una llamada a API
    setTimeout(() => {
      setTitulados(mockTitulados);
      setFilteredTitulados(mockTitulados);
      setLoading(false);
    }, 500);
  }, []);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredTitulados(titulados);
      return;
    }

    const filtered = titulados.filter(titulado => {
      if (!titulado.fechaCreacion) return false;
      
      const creationDate = new Date(titulado.fechaCreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Ajustar la fecha final para incluir todo el día
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredTitulados(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reporte de Titulados</h1>
      
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
            <h2 className="text-lg font-semibold">Listado de Titulados</h2>
            <PDFDownloader
              document={<TituladosPDF data={filteredTitulados} startDate={startDate} endDate={endDate} />}
              fileName="reporte-titulados"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titulado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ficha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTitulados.map((titulado) => (
                    <tr key={titulado.idTitulado}>
                      <td className="px-6 py-4 whitespace-nowrap">{titulado.idTitulado}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{titulado.Titulado}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{titulado.area?.Area}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{titulado.ficha?.numFicha}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${titulado.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {titulado.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {titulado.fechaCreacion ? new Date(titulado.fechaCreacion).toLocaleDateString('es-ES') : '-'}
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

export default TituladosReportePage;