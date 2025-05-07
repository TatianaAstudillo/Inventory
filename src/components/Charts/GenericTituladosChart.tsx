"use client"

import { useState, useEffect } from "react";
import { BarChart } from "@/components/Charts/BarChart";
import { DonutChart } from "@tremor/react";
import { FaChartBar, FaChartPie, FaCalendarAlt, FaUserGraduate } from "react-icons/fa";

// Definimos los tipos para nuestros props
interface GenericTituladosChartProps {
  titulados: any[];
  title: string;
  className?: string;
}

// Definimos la estructura de datos para el gráfico
interface ChartDataItem {
  name: string;
  count: number;
}

// Tipo de datos a mostrar
type DataType = "porMes" | "porPersonas";

// Colores para los gráficos
const CHART_COLORS = [
  "emerald", "blue", "amber", "violet", "rose", "indigo", "cyan", 
  "fuchsia", "green", "purple", "orange", "teal"
];

export function GenericTituladosChart({
  titulados,
  title,
  className = "h-72",
}: GenericTituladosChartProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [chartType, setChartType] = useState<"bar" | "donut">("bar");
  const [dataType, setDataType] = useState<DataType>("porMes");

  useEffect(() => {
    if (!titulados || titulados.length === 0) return;

    let formattedData: ChartDataItem[] = [];

    if (dataType === "porMes") {
      // Agrupar titulados por mes
      const monthMap = new Map<string, number>();
      const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      
      titulados.forEach(titulado => {
        if (titulado.fechaCreacion) {
          const date = new Date(titulado.fechaCreacion);
          const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
          monthMap.set(monthYear, (monthMap.get(monthYear) || 0) + 1);
        }
      });
      
      // Convertir el mapa a array y ordenar por fecha
      const sortedEntries = Array.from(monthMap.entries())
        .map(([monthYear, count]) => {
          const [month, year] = monthYear.split(' ');
          return { monthYear, month, year: parseInt(year), count };
        })
        .sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year;
          return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
        });
      
      formattedData = sortedEntries.map(entry => ({
        name: entry.monthYear,
        count: entry.count
      }));
    } else if (dataType === "porPersonas") {
      // Contar personas por titulado
      formattedData = titulados
        .filter(titulado => titulado.nombre) // Asegurarse de que tiene nombre
        .map(titulado => ({
          name: titulado.nombre,
          count: titulado.cantidadPersonas || 0
        }))
        .sort((a, b) => b.count - a.count) // Ordenar por cantidad de personas (mayor a menor)
        .slice(0, 10); // Limitar a los 10 primeros
    }

    setChartData(formattedData);
  }, [titulados, dataType]);

  // Función para cambiar entre tipos de gráficos
  const toggleChartType = () => {
    setChartType(prevType => prevType === "bar" ? "donut" : "bar");
  };

  // Obtener el título según el tipo de datos
  const getDataTypeTitle = () => {
    switch (dataType) {
      case "porMes": return "Titulados por Mes";
      case "porPersonas": return "Personas por Titulado";
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
            onClick={() => setDataType("porMes")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              dataType === "porMes" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaCalendarAlt size={14} />
            <span>Por Mes</span>
          </button>
          
          <button 
            onClick={() => setDataType("porPersonas")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              dataType === "porPersonas" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaUserGraduate size={14} />
            <span>Por Personas</span>
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
              valueFormatter={(value) => 
                `${value} ${dataType === "porMes" ? "titulados" : "personas"}`
              }
              yAxisWidth={48}
            />
          ) : (
            <DonutChart
              className={className}
              data={chartData}
              category="count"
              index="name"
              colors={CHART_COLORS}
              valueFormatter={(value) => 
                `${value} ${dataType === "porMes" ? "titulados" : "personas"}`
              }
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