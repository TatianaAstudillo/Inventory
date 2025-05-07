"use client"

import { useState, useEffect } from "react";
import { BarChart } from "@/components/Charts/BarChart";
import { DonutChart } from "@tremor/react";
import { FaChartBar, FaChartPie, FaCalendarAlt, FaBuilding, FaMapMarkerAlt, FaUniversity } from "react-icons/fa";

// Definimos los tipos para nuestros props
interface GenericSedesChartProps {
  sedes: any[];
  centros: any[];
  title: string;
  className?: string;
}

// Definimos la estructura de datos para el gráfico
interface ChartDataItem {
  name: string;
  count: number;
}

// Tipo de datos a mostrar
type DataType = "porMes" | "centrosPorSede" | "sitiosPorSede" | "centrosPorMes";

// Colores para los gráficos
const CHART_COLORS = [
  "emerald", "blue", "amber", "violet", "rose", "indigo", "cyan", 
  "fuchsia", "green", "purple", "orange", "teal"
];

export function GenericSedesChart({
  sedes,
  centros,
  title,
  className = "h-72",
}: GenericSedesChartProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [chartType, setChartType] = useState<"bar" | "donut">("bar");
  const [dataType, setDataType] = useState<DataType>("porMes");

  useEffect(() => {
    if (!sedes || sedes.length === 0) return;

    let formattedData: ChartDataItem[] = [];
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    switch (dataType) {
      case "porMes":
        // Agrupar sedes por mes de creación
        const sedeMonthMap = new Map<string, number>();
        
        sedes.forEach(sede => {
          if (sede.fechaCreacion) {
            const date = new Date(sede.fechaCreacion);
            const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            sedeMonthMap.set(monthYear, (sedeMonthMap.get(monthYear) || 0) + 1);
          }
        });
        
        // Convertir el mapa a array y ordenar por fecha
        const sortedSedeEntries = Array.from(sedeMonthMap.entries())
          .map(([monthYear, count]) => {
            const [month, year] = monthYear.split(' ');
            return { monthYear, month, year: parseInt(year), count };
          })
          .sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
          });
        
        formattedData = sortedSedeEntries.map(entry => ({
          name: entry.monthYear,
          count: entry.count
        }));
        break;
        
      case "centrosPorSede":
        // Contar centros por sede
        if (centros && centros.length > 0) {
          const centrosPorSedeMap = new Map<string, number>();
          
          // Inicializar todas las sedes con 0 centros
          sedes.forEach(sede => {
            centrosPorSedeMap.set(sede.nombre || `Sede ${sede.idSede}`, 0);
          });
          
          // Contar centros por sede
          centros.forEach(centro => {
            if (centro.Sede) {
              const sede = sedes.find(s => s.idSede === centro.Sede);
              if (sede) {
                const sedeName = sede.nombre || `Sede ${sede.idSede}`;
                centrosPorSedeMap.set(sedeName, (centrosPorSedeMap.get(sedeName) || 0) + 1);
              }
            }
          });
          
          formattedData = Array.from(centrosPorSedeMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
        }
        break;
        
      case "sitiosPorSede":
        // Contar sitios por sede (asumiendo que los sitios están relacionados con centros)
        if (centros && centros.length > 0) {
          const sitiosPorSedeMap = new Map<string, number>();
          
          // Inicializar todas las sedes con 0 sitios
          sedes.forEach(sede => {
            sitiosPorSedeMap.set(sede.nombre || `Sede ${sede.idSede}`, 0);
          });
          
          // Contar sitios por sede a través de los centros
          centros.forEach(centro => {
            if (centro.Sede && centro.cantidadSitios) {
              const sede = sedes.find(s => s.idSede === centro.Sede);
              if (sede) {
                const sedeName = sede.nombre || `Sede ${sede.idSede}`;
                sitiosPorSedeMap.set(
                  sedeName, 
                  (sitiosPorSedeMap.get(sedeName) || 0) + centro.cantidadSitios
                );
              }
            }
          });
          
          formattedData = Array.from(sitiosPorSedeMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
        }
        break;
        
      case "centrosPorMes":
        // Agrupar centros por mes de creación
        if (centros && centros.length > 0) {
          const centroMonthMap = new Map<string, number>();
          
          centros.forEach(centro => {
            if (centro.fechaCreacion) {
              const date = new Date(centro.fechaCreacion);
              const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
              centroMonthMap.set(monthYear, (centroMonthMap.get(monthYear) || 0) + 1);
            }
          });
          
          // Convertir el mapa a array y ordenar por fecha
          const sortedCentroEntries = Array.from(centroMonthMap.entries())
            .map(([monthYear, count]) => {
              const [month, year] = monthYear.split(' ');
              return { monthYear, month, year: parseInt(year), count };
            })
            .sort((a, b) => {
              if (a.year !== b.year) return a.year - b.year;
              return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
            });
          
          formattedData = sortedCentroEntries.map(entry => ({
            name: entry.monthYear,
            count: entry.count
          }));
        }
        break;
    }

    setChartData(formattedData);
  }, [sedes, centros, dataType]);

  // Función para cambiar entre tipos de gráficos
  const toggleChartType = () => {
    setChartType(prevType => prevType === "bar" ? "donut" : "bar");
  };

  // Obtener el título según el tipo de datos
  const getDataTypeTitle = () => {
    switch (dataType) {
      case "porMes": return "Sedes por Mes";
      case "centrosPorSede": return "Centros por Sede";
      case "sitiosPorSede": return "Sitios por Sede";
      case "centrosPorMes": return "Centros por Mes";
      default: return "";
    }
  };

  // Obtener el texto del valor según el tipo de datos
  const getValueText = (value: number) => {
    switch (dataType) {
      case "porMes": return `${value} ${value === 1 ? 'sede' : 'sedes'}`;
      case "centrosPorSede": return `${value} ${value === 1 ? 'centro' : 'centros'}`;
      case "sitiosPorSede": return `${value} ${value === 1 ? 'sitio' : 'sitios'}`;
      case "centrosPorMes": return `${value} ${value === 1 ? 'centro' : 'centros'}`;
      default: return `${value}`;
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium">
          {title} - {getDataTypeTitle()}
        </h3>
        
        {/* Botones de filtro */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setDataType("porMes")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              dataType === "porMes" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaCalendarAlt size={14} />
            <span>Sedes por Mes</span>
          </button>
          
          <button 
            onClick={() => setDataType("centrosPorSede")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              dataType === "centrosPorSede" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaBuilding size={14} />
            <span>Centros por Sede</span>
          </button>
          
          <button 
            onClick={() => setDataType("sitiosPorSede")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              dataType === "sitiosPorSede" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaMapMarkerAlt size={14} />
            <span>Sitios por Sede</span>
          </button>
          
          <button 
            onClick={() => setDataType("centrosPorMes")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              dataType === "centrosPorMes" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaUniversity size={14} />
            <span>Centros por Mes</span>
          </button>
          
          <button 
            onClick={toggleChartType}
            className="ml-auto px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 flex items-center gap-1.5 text-sm"
            title={chartType === "bar" ? "Cambiar a gráfico circular" : "Cambiar a gráfico de barras"}
          >
            {chartType === "bar" ? <FaChartPie size={14} /> : <FaChartBar size={14} />}
            <span>{chartType === "bar" ? "Circular" : "Barras"}</span>
          </button>
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <div className="mt-4">
          {chartType === "bar" ? (
            <BarChart
              className={className}
              data={chartData}
              index="name"
              categories={["count"]}
              colors={["green"]}
              valueFormatter={(value) => getValueText(value)}
              yAxisWidth={48}
            />
          ) : (
            <DonutChart
              className={className}
              data={chartData}
              category="count"
              index="name"
              colors={CHART_COLORS}
              valueFormatter={(value) => getValueText(value)}
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 text-gray-500 mt-4">
          No hay datos disponibles para mostrar
        </div>
      )}
    </div>
  );
}