import React, { useState, useEffect } from 'react';
import { Card } from '@heroui/react';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import AreaCentroPDF from '../../components/PDFGenerator/AreaCentroPDF';
import { Models } from '../../types/types';

// Simulación de datos - En un caso real, esto vendría de una API
const mockAreasCentro: Partial<Models['AreaCentro']>[] = [
  {
    idAreaCentro: '1',
    centro: { Centro: 'Centro de Tecnología' },
    area: { Area: 'Informática' },
    activo: true,
    fechaCreacion: new Date('2023-01-15'),
  },
  {
    idAreaCentro: '2',
    centro: { Centro: 'Centro de Tecnología' },
    area: { Area: 'Electrónica' },
    activo: true,
    fechaCreacion: new Date('2023-01-20'),
  },
  {
    idAreaCentro: '3',
    centro: { Centro: 'Centro de Diseño' },
    area: { Area: 'Diseño Gráfico' },
    activo: true,
    fechaCreacion: new Date('2023-02-05'),
  },
  // Más datos simulados...
];

const AreasCentroReportePage: React.FC = () => {
  const [areasCentro, setAreasCentro] = useState<Partial<Models['AreaCentro']>[]>([]);
  const [filteredAreasCentro, setFilteredAreasCentro] = useState<Partial<Models['AreaCentro']>[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulación de carga de datos - En un caso real, esto sería una llamada a API
    setTimeout(() => {
      setAreasCentro(mockAreasCentro);
      setFilteredAreasCentro(mockAreasCentro);
      setLoading(false);
    }, 500);
  }, []);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredAreasCentro(areasCentro);
      return;
    }

    const filtered = areasCentro.filter(areaCentro => {
      if (!areaCentro.fechaCreacion) return false;
      
      const creationDate = new Date(areaCentro.fechaCreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Ajustar la fecha final para incluir todo el día
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredAreasCentro(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reporte de Áreas por Centro</h1>
      
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
            <h2 className="text-lg font-semibold">Listado de Áreas por Centro</h2>
            <PDFDownloader
              document={<AreaCentroPDF data={filteredAreasCentro} startDate={startDate} endDate={endDate} />}
              fileName="reporte-areas-centro"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAreasCentro.map((areaCentro) => (
                    <tr key={areaCentro.idAreaCentro}>
                      <td className="px-6 py-4 whitespace-nowrap">{areaCentro.idAreaCentro}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{areaCentro.centro?.Centro}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{areaCentro.area?.Area}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${areaCentro.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {areaCentro.activo ? 'Activo' : 'Inactivo'}
                        </span>
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

export default AreasCentroReportePage;