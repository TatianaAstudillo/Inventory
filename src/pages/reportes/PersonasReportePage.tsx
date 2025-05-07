import React, { useState } from 'react';
import { Card } from '@heroui/react';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import PersonasPDF from '../../components/PDFGenerator/PersonasPDF';
import { usePersona } from '@/hooks/Personas/usePersonas';
import { Persona } from '@/services/Personas/personaService';


const calcularFechaVencimiento = (fechaCreacion: Date): Date => {
  const fechaVencimiento = new Date(fechaCreacion);
  let diasHabilesAgregados = 0;
  
  while (diasHabilesAgregados < 30) {
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 1);
    // Verificar si es día hábil (lunes a viernes)
    const diaSemana = fechaVencimiento.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) {
      diasHabilesAgregados++;
    }
  }
  
  return fechaVencimiento;
};

const PersonasReportePage: React.FC = () => {
  const {
    personas,
    loading,
    error,
    fichas,
    roles,
  } = usePersona();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredPersonas, setFilteredPersonas] = useState<Partial<Persona>[]>([]);

  // Inicializar filteredPersonas con todas las personas cuando se cargan
  React.useEffect(() => {
    if (personas && personas.length > 0) {
      setFilteredPersonas(personas);
    }
  }, [personas]);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredPersonas(personas);
      return;
    }

    const filtered = personas.filter(persona => {
      if (!persona.fechaCreacion) return false;
      
      const creationDate = new Date(persona.fechaCreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Ajustar la fecha final para incluir todo el día
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredPersonas(filtered);
  };

  // Función para obtener el nombre de la ficha
  const getFichaNombre = (fichaId: number) => {
    const ficha = fichas?.find(f => f.idFicha === fichaId);
    return ficha ? ficha.numFicha : 'N/A';
  };

  // Función para obtener el nombre del rol
  const getRolNombre = (rolId: number) => {
    const rol = roles?.find(r => r.idRol === rolId);
    return rol ? rol.rol : 'N/A';
  };

  // Función para verificar si un registro está vencido
  const estaVencido = (fechaCreacion: Date): boolean => {
    const fechaVencimiento = calcularFechaVencimiento(fechaCreacion);
    const hoy = new Date();
    return hoy > fechaVencimiento;
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reporte de Personas</h1>
      
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
            <h2 className="text-lg font-semibold">Listado de Personas</h2>
            <PDFDownloader
              document={<PersonasPDF data={filteredPersonas} startDate={startDate} endDate={endDate} />}
              fileName="reporte-personas"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ficha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Vencimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado Vencimiento</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPersonas.map((persona) => {
                  const fechaCreacion = persona.fechaCreacion ? new Date(persona.fechaCreacion) : null;
                  const fechaVencimiento = fechaCreacion ? calcularFechaVencimiento(fechaCreacion) : null;
                  const vencido = fechaCreacion ? estaVencido(fechaCreacion) : false;
                  
                  return (
                    <tr key={persona.idPersona}>
                      <td className="px-6 py-4 whitespace-nowrap">{persona.idPersona}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{persona.identificacion}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{persona.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{persona.apellido}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{persona.correo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{persona.telefono || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{persona.edad}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {persona.Ficha ? getFichaNombre(Number(persona.Ficha)) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {persona.Rol ? getRolNombre(Number(persona.Rol)) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {persona.activo ? 'Activo' : 'Inactivo'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {fechaCreacion ? fechaCreacion.toLocaleDateString('es-ES') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {fechaVencimiento ? fechaVencimiento.toLocaleDateString('es-ES') : '-'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${vencido ? 'text-red-600 font-semibold' : 'text-green-600'}`}>
                        {vencido ? 'Vencido' : 'Vigente'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PersonasReportePage;