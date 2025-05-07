"use client"

import { useState, useEffect } from "react";
import { BarChart, type BarChartEventProps } from "@/components/Charts/BarChart";
import { DonutChart } from "@tremor/react";
import { FaChartBar, FaChartPie } from "react-icons/fa";

// Definimos los tipos para nuestros props
interface GenericBarChartProps<T> {
  data: T[];
  dateField: keyof T;
  title: string;
  className?: string;
  showDataPreview?: boolean;
}

// Definimos la estructura de datos para el gráfico
interface ChartDataItem {
  name: string;
  count: number;
}

// Nombres de los meses en español
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Colores para los gráficos
const CHART_COLORS = [
  "emerald", "blue", "amber", "violet", "rose", "indigo", "cyan", 
  "fuchsia", "green", "purple", "orange", "teal"
];

export function GenericBarChart<T>({
  data,
  dateField,
  title,
  className = "h-72",
  showDataPreview = false
}: GenericBarChartProps<T>) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [value, setValue] = useState<BarChartEventProps | undefined>(undefined);
  const [chartType, setChartType] = useState<"bar" | "donut">("bar");

  useEffect(() => {
    if (!data || data.length === 0) {
      console.log("No hay datos disponibles para el gráfico");
      return;
    }

    console.log("Datos recibidos:", data);
    
    // Inicializamos un objeto para contar registros por mes
    const monthCounts: Record<string, number> = {};
    
    // Inicializamos todos los meses con 0
    MONTH_NAMES.forEach((month) => {
      monthCounts[month] = 0;
    });

    // Contamos los registros por mes
    let validDateCount = 0;
    data.forEach(item => {
      const dateValue = item[dateField];
      if (dateValue) {
        try {
          const date = new Date(dateValue as string | number | Date);
          if (!isNaN(date.getTime())) {
            const monthIndex = date.getMonth();
            const monthName = MONTH_NAMES[monthIndex];
            monthCounts[monthName] = (monthCounts[monthName] || 0) + 1;
            validDateCount++;
          } else {
            console.warn("Fecha inválida:", dateValue);
          }
        } catch (error) {
          console.error("Error al procesar fecha:", dateValue, error);
        }
      }
    });

    console.log(`Procesadas ${validDateCount} fechas válidas de ${data.length} registros`);
    console.log("Datos por mes:", monthCounts);

    // Convertimos el objeto a un array para el gráfico
    const formattedData = Object.entries(monthCounts).map(([name, count]) => ({
      name,
      count
    }));

    console.log("Datos formateados para el gráfico:", formattedData);
    setChartData(formattedData);
  }, [data, dateField]);

  // Función para cambiar entre tipos de gráficos
  const toggleChartType = () => {
    setChartType(prevType => prevType === "bar" ? "donut" : "bar");
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <button 
          onClick={toggleChartType}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={chartType === "bar" ? "Cambiar a gráfico circular" : "Cambiar a gráfico de barras"}
        >
          {chartType === "bar" ? <FaChartPie size={20} /> : <FaChartBar size={20} />}
        </button>
      </div>
      
      {chartData.length > 0 ? (
        <>
          <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
            {chartType === "bar" ? (
              <BarChart
                className={className}
                data={chartData}
                index="name"
                categories={["count"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value} registros`}
                yAxisWidth={48}
                onValueChange={(v) => setValue(v ?? undefined)}
              />
            ) : (
              <DonutChart
                className={className}
                data={chartData}
                category="count"
                index="name"
                colors={CHART_COLORS}
                valueFormatter={(value) => `${value} registros`}
                onValueChange={(v) => v ? setValue({
                  eventType: "click",
                  categoryIndex: 0,
                  seriesIndex: 0,
                  name: v.name || "",
                  value: v.value || 0,
                  formattedValue: `${v.value} registros`,
                  color: v.color || "blue"
                } as BarChartEventProps) : setValue(undefined)}
              />
            )}
          </div>
          
          {showDataPreview && value && (
            <pre className="mt-4 rounded-md bg-gray-100 p-3 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200 overflow-auto">
              {JSON.stringify(value, null, 2)}
            </pre>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-40 text-gray-500">
          No hay datos disponibles para mostrar
        </div>
      )}
    </div>
  );
}