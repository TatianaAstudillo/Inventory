import React, { useState, useEffect } from 'react';
import { Card } from '@heroui/react';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import FichasPDF from '../../components/PDFGenerator/FichasPDF';
import { Models } from '../../types/types';

// Simulación de datos - En un caso real, esto vendría de una API
const mockFichas: Partial<Models['Ficha']>[] = [
  {
    idFicha: '1',
    numFicha: 2345678,
    cantidadAprendices: 25,
    activo: true,
    fechaCreacion: new Date('2023-01-10'),
  },
  {
    idFicha: '2',
    numFicha: 2345679,
    cantidadAprendices: 30,
    activo: true,
    fechaCreacion: new Date('2023-02-15'),
  },
  // Más datos simulados...
];

const FichasReportePage: React.FC = () => {
  const [fichas, setFichas] = useState<Partial<Models['Ficha']>[]>([]);
  const [filteredFichas, setFilteredFichas] = useState<Partial<Models['Ficha']>[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulación de carga de datos - En un caso real, esto sería una llamada a API
    setTimeout(() => {
      setFichas(mockFichas);
      setFilteredFichas(mockFichas);
      setLoading(false);
    }, 500);
  }, []);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredFichas(fichas);
      return;
    }

    const filtered = fichas.filter(ficha => {
      if (!ficha.fechaCreacion) return false;
      
      const creationDate = new Date(ficha.fechaCreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Ajustar la fecha final para incluir todo el día
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredFichas(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reporte de Fichas</h1>
      
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
            <h2 className="text-lg font-semibold">Listado de Fichas</h2>
            <PDFDownloader
              document={<FichasPDF data={filteredFichas} startDate={startDate} endDate={endDate} />}
              fileName="reporte-fichas"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Ficha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad de Aprendices</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFichas.map((ficha) => (
                    <tr key={ficha.idFicha}>
                      <td className="px-6 py-4 whitespace-nowrap">{ficha.idFicha}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{ficha.numFicha}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{ficha.cantidadAprendices}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ficha.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {ficha.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ficha.fechaCreacion ? new Date(ficha.fechaCreacion).toLocaleDateString('es-ES') : '-'}
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

export default FichasReportePage;