import React, { useState } from 'react';
import { Card } from '@heroui/react';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import MaterialesPDF from '../../components/PDFGenerator/MaterialesPDF';
import { useMaterial } from '@/hooks/Materiales/useMateriales';
import { Material } from '@/services/Materiales/materialesServices';

// Función para calcular la fecha de vencimiento (30 días hábiles)
const calcularFechaVencimiento = (fechaCreacion: Date): Date => {
  const fechaVencimiento = new Date(fechaCreacion);
  let diasHabilesAgregados = 0;
  
  while (diasHabilesAgregados < 30) {
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 1);
    // Verificar si es día hábil (lunes a viernes)
    const diaSemana = fechaVencimiento.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) { // 0 es domingo, 6 es sábado
      diasHabilesAgregados++;
    }
  }
  
  return fechaVencimiento;
};

const MaterialesReportePage: React.FC = () => {
  const {
    materiales,
    loading,
    error,
    tiposMaterial,
    unidadesMedida,
    categoriasMaterial
  } = useMaterial();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredMateriales, setFilteredMateriales] = useState<Partial<Material>[]>([]);

  // Inicializar filteredMateriales con todos los materiales cuando se cargan
  React.useEffect(() => {
    if (materiales && materiales.length > 0) {
      setFilteredMateriales(materiales);
    }
  }, [materiales]);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredMateriales(materiales);
      return;
    }

    const filtered = materiales.filter(material => {
      if (!material.fechaCreacion) return false;
      
      const creationDate = new Date(material.fechaCreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Ajustar la fecha final para incluir todo el día
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredMateriales(filtered);
  };

  // Función para obtener el nombre del tipo de material
  const getTipoMaterialNombre = (tipoId: number | string) => {
    const tipo = tiposMaterial?.find(t => t.idTipoMaterial === Number(tipoId));
    return tipo ? tipo.Tipo : 'N/A';
  };

  // Función para obtener el nombre de la unidad de medida
  const getUnidadMedidaNombre = (unidadId: number | string) => {
    const unidad = unidadesMedida?.find(u => u.idUnidadMedida === Number(unidadId));
    return unidad ? unidad.unidadMedida : 'N/A';
  };

  // Función para obtener el nombre de la categoría
  const getCategoriaNombre = (categoriaId: number | string) => {
    const categoria = categoriasMaterial?.find(c => c.idCategoriaMaterial === Number(categoriaId));
    return categoria ? categoria.categoria : 'N/A';
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
      <h1 className="text-2xl font-bold mb-6">Reporte de Materiales</h1>
      
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
            <h2 className="text-lg font-semibold">Listado de Materiales</h2>
            <PDFDownloader
              document={<MaterialesPDF data={filteredMateriales} startDate={startDate} endDate={endDate} />}
              fileName="reporte-materiales"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caduca</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Vencimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Actualización</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Vencimiento Registro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado Vencimiento</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMateriales.map((material) => {
                  const fechaCreacion = material.fechaCreacion ? new Date(material.fechaCreacion) : null;
                  const fechaVencimientoRegistro = fechaCreacion ? calcularFechaVencimiento(fechaCreacion) : null;
                  const vencido = fechaCreacion ? estaVencido(fechaCreacion) : false;
                  
                  return (
                    <tr key={material.idMaterial}>
                      <td className="px-6 py-4 whitespace-nowrap">{material.idMaterial}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{material.nombreMaterial}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{material.descripcion}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{material.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {material.TipoMaterial ? getTipoMaterialNombre(Number(material.TipoMaterial)) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {material.UnidadMedida ? getUnidadMedidaNombre(Number(material.UnidadMedida)) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {material.CategoriaMaterial ? getCategoriaNombre(Number(material.CategoriaMaterial)) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {material.Caduca ? 'Sí' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {material.fechaVencimiento ? new Date(material.fechaVencimiento).toLocaleDateString('es-ES') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${material.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {material.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {fechaCreacion ? fechaCreacion.toLocaleDateString('es-ES') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {material.fechaActualización ? new Date(material.fechaActualización).toLocaleDateString('es-ES') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {fechaVencimientoRegistro ? fechaVencimientoRegistro.toLocaleDateString('es-ES') : '-'}
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

export default MaterialesReportePage;