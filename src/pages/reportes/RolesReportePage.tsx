import React, { useState, useEffect } from 'react';
import { Card } from '@heroui/react';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import RolesPDF from '../../components/PDFGenerator/RolesPDF';
import { Models } from '../../types/types';

// Simulación de datos - En un caso real, esto vendría de una API
const mockRoles: Partial<Models['Rol']>[] = [
  {
    idRol: '1',
    nombreRol: 'Administrador',
    activo: true,
    fechaCreacion: new Date('2023-01-05'),
  },
  {
    idRol: '2',
    nombreRol: 'Usuario',
    activo: true,
    fechaCreacion: new Date('2023-01-05'),
  },
  {
    idRol: '3',
    nombreRol: 'Instructor',
    activo: true,
    fechaCreacion: new Date('2023-02-10'),
  },
  // Más datos simulados...
];

const RolesReportePage: React.FC = () => {
  const [roles, setRoles] = useState<Partial<Models['Rol']>[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Partial<Models['Rol']>[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulación de carga de datos - En un caso real, esto sería una llamada a API
    setTimeout(() => {
      setRoles(mockRoles);
      setFilteredRoles(mockRoles);
      setLoading(false);
    }, 500);
  }, []);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredRoles(roles);
      return;
    }

    const filtered = roles.filter(rol => {
      if (!rol.fechaCreacion) return false;
      
      const creationDate = new Date(rol.fechaCreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Ajustar la fecha final para incluir todo el día
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredRoles(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reporte de Roles</h1>
      
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
            <h2 className="text-lg font-semibold">Listado de Roles</h2>
            <PDFDownloader
              document={<RolesPDF data={filteredRoles} startDate={startDate} endDate={endDate} />}
              fileName="reporte-roles"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Rol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRoles.map((rol) => (
                    <tr key={rol.idRol}>
                      <td className="px-6 py-4 whitespace-nowrap">{rol.idRol}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{rol.nombreRol}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rol.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {rol.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {rol.fechaCreacion ? new Date(rol.fechaCreacion).toLocaleDateString('es-ES') : '-'}
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

export default RolesReportePage;