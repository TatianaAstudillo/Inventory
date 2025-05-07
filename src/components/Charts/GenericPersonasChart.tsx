"use client"

import { useState, useEffect } from "react";
import { BarChart } from "@/components/Charts/BarChart";
import { DonutChart } from "@tremor/react";
import { FaChartBar, FaChartPie, FaUser, FaUsers } from "react-icons/fa";


// Definimos los tipos para nuestros props
interface GenericPersonasChartProps {
  personas: any[];
  fichas?: any[];
  title: string;
  className?: string;
}

// Definimos la estructura de datos para el gráfico
interface ChartDataItem {
  name: string;
  count: number;
}

// Tipo de datos a mostrar
type DataType = "general" | "porFicha";

// Colores para los gráficos
const CHART_COLORS = [
  "emerald", "blue", "amber", "violet", "rose", "indigo", "cyan", 
  "fuchsia", "green", "purple", "orange", "teal"
];

export function GenericPersonasChart({
  personas,
  fichas,
  title,
  className = "h-72",
}: GenericPersonasChartProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [chartType, setChartType] = useState<"bar" | "donut">("bar");
  const [dataType, setDataType] = useState<DataType>("general");

  useEffect(() => {
    if (!personas || personas.length === 0) return;

    let formattedData: ChartDataItem[] = [];

    if (dataType === "general") {
      // Contar personas por rol
      const rolMap = new Map<string, number>();
      
      personas.forEach(persona => {
        const rolName = persona.rolNombre || 'Sin Rol';
        rolMap.set(rolName, (rolMap.get(rolName) || 0) + 1);
      });
      
      formattedData = Array.from(rolMap.entries()).map(([name, count]) => ({
        name,
        count
      }));
    } else if (dataType === "porFicha" && fichas && fichas.length > 0) {
      // Contar personas por ficha
      const fichaMap = new Map<string, number>();
      
      personas.forEach(persona => {
        if (persona.Ficha) {
          const ficha = fichas.find(f => f.idFicha === persona.Ficha);
          const fichaName = ficha ? `Ficha ${ficha.numFicha}` : `Ficha ${persona.Ficha}`;
          fichaMap.set(fichaName, (fichaMap.get(fichaName) || 0) + 1);
        }
      });
      
      formattedData = Array.from(fichaMap.entries()).map(([name, count]) => ({
        name,
        count
      }));
    }

    // Ordenar por cantidad (mayor a menor)
    formattedData.sort((a, b) => b.count - a.count);

    // Limitar a los 10 primeros para mejor visualización
    formattedData = formattedData.slice(0, 10);

    setChartData(formattedData);
  }, [personas, fichas, dataType]);

  // Función para cambiar entre tipos de gráficos
  const toggleChartType = () => {
    setChartType(prevType => prevType === "bar" ? "donut" : "bar");
  };

  // Obtener el título según el tipo de datos
  const getDataTypeTitle = () => {
    switch (dataType) {
      case "general": return "Personas por Rol";
      case "porFicha": return "Personas por Ficha";
      default: return "";
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
            onClick={() => setDataType("general")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              dataType === "general" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaUser size={14} />
            <span>Por Rol</span>
          </button>
          
          <button 
            onClick={() => setDataType("porFicha")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              dataType === "porFicha" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaUsers size={14} />
            <span>Por Ficha</span>
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
              valueFormatter={(value) => `${value} ${value === 1 ? 'persona' : 'personas'}`}
              yAxisWidth={48}
            />
          ) : (
            <DonutChart
              className={className}
              data={chartData}
              category="count"
              index="name"
              colors={CHART_COLORS}
              valueFormatter={(value) => `${value} ${value === 1 ? 'persona' : 'personas'}`}
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