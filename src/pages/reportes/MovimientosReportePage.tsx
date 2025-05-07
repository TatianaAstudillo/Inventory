import React, { useState, useEffect } from 'react';
import { Card } from '@heroui/react';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import MovimientosPDF from '../../components/PDFGenerator/MovimientosPDF';
import { Models } from '../../types/types';

// Simulación de datos - En un caso real, esto vendría de una API
const mockMovimientos: Partial<Models['Movimiento']>[] = [
  {
    idMovimiento: '1',
    TipoMovimiento: '1',
    MovimientoPersona: '1',
    activo: true,
    fechaCreacion: new Date('2023-01-05'),
    tipomovimiento: { tipoMovimiento: 'Entrada' },
    movimientopersona: { nombre: 'Juan', apellido: 'Pérez' }
  },
  {
    idMovimiento: '2',
    TipoMovimiento: '2',
    MovimientoPersona: '2',
    activo: true,
    fechaCreacion: new Date('2023-01-10'),
    tipomovimiento: { tipoMovimiento: 'Salida' },
    movimientopersona: { nombre: 'María', apellido: 'González' }
  },
  {
    idMovimiento: '3',
    TipoMovimiento: '3',
    MovimientoPersona: '3',
    activo: true,
    fechaCreacion: new Date('2023-01-15'),
    tipomovimiento: { tipoMovimiento: 'Traslado' },
    movimientopersona: { nombre: 'Carlos', apellido: 'Rodríguez' }
  },
  // Más datos simulados...
];

const MovimientosReportePage: React.FC = () => {
  const [movimientos, setMovimientos] = useState<Partial<Models['Movimiento']>[]>([]);
  const [filteredMovimientos, setFilteredMovimientos] = useState<Partial<Models['Movimiento']>[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulación de carga de datos - En un caso real, esto sería una llamada a API
    setTimeout(() => {
      setMovimientos(mockMovimientos);
      setFilteredMovimientos(mockMovimientos);
      setLoading(false);
    }, 500);
  }, []);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredMovimientos(movimientos);
      return;
    }

    const filtered = movimientos.filter(movimiento => {
      if (!movimiento.fechaCreacion) return false;
      
      const creationDate = new Date(movimiento.fechaCreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Ajustar la fecha final para incluir todo el día
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredMovimientos(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reporte de Movimientos</h1>
      
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
            <h2 className="text-lg font-semibold">Listado de Movimientos</h2>
            <PDFDownloader
              document={<MovimientosPDF data={filteredMovimientos} startDate={startDate} endDate={endDate} />}
              fileName="reporte-movimientos"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Movimiento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persona</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMovimientos.map((movimiento) => (
                    <tr key={movimiento.idMovimiento}>
                      <td className="px-6 py-4 whitespace-nowrap">{movimiento.idMovimiento}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{movimiento.tipomovimiento?.tipoMovimiento || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {movimiento.movimientopersona ? 
                          `${movimiento.movimientopersona.nombre || ''} ${movimiento.movimientopersona.apellido || ''}` : 
                          '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${movimiento.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {movimiento.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {movimiento.fechaCreacion ? new Date(movimiento.fechaCreacion).toLocaleDateString('es-ES') : '-'}
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

export default MovimientosReportePage;