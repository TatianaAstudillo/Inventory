import React, { useState, useEffect } from 'react';
import { Card } from '@heroui/react';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import SitiosPDF from '../../components/PDFGenerator/SitiosPDF';
import { Models } from '../../types/types';

// Simulación de datos - En un caso real, esto vendría de una API
const mockSitios: Partial<Models['Sitio']>[] = [
  {
    idSitio: '1',
    sitio: 'Almacén Principal',
    TipoSitio: '1',
    activo: true,
    fechaCreacion: new Date('2023-01-05'),
    tipositio: { TipoSitio: 'Almacén' }
  },
  {
    idSitio: '2',
    sitio: 'Aula 101',
    TipoSitio: '3',
    activo: true,
    fechaCreacion: new Date('2023-01-10'),
    tipositio: { TipoSitio: 'Aula' }
  },
  {
    idSitio: '3',
    sitio: 'Bodega de Materiales',
    TipoSitio: '2',
    activo: true,
    fechaCreacion: new Date('2023-01-15'),
    tipositio: { TipoSitio: 'Bodega' }
  },
  // Más datos simulados...
];

const SitiosReportePage: React.FC = () => {
  const [sitios, setSitios] = useState<Partial<Models['Sitio']>[]>([]);
  const [filteredSitios, setFilteredSitios] = useState<Partial<Models['Sitio']>[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulación de carga de datos - En un caso real, esto sería una llamada a API
    setTimeout(() => {
      setSitios(mockSitios);
      setFilteredSitios(mockSitios);
      setLoading(false);
    }, 500);
  }, []);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredSitios(sitios);
      return;
    }

    const filtered = sitios.filter(sitio => {
      if (!sitio.fechaCreacion) return false;
      
      const creationDate = new Date(sitio.fechaCreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Ajustar la fecha final para incluir todo el día
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredSitios(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reporte de Sitios</h1>
      
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
            <h2 className="text-lg font-semibold">Listado de Sitios</h2>
            <PDFDownloader
              document={<SitiosPDF data={filteredSitios} startDate={startDate} endDate={endDate} />}
              fileName="reporte-sitios"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sitio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Sitio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSitios.map((sitio) => (
                    <tr key={sitio.idSitio}>
                      <td className="px-6 py-4 whitespace-nowrap">{sitio.idSitio}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{sitio.sitio}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{sitio.tipositio?.TipoSitio || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sitio.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {sitio.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sitio.fechaCreacion ? new Date(sitio.fechaCreacion).toLocaleDateString('es-ES') : '-'}
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

export default SitiosReportePage;