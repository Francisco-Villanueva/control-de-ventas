"use client";

import { usePromediosPorDiaSemana } from "@/hooks/useEstadisticas";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2, BarChart3 } from "lucide-react";

const COLORS = [
  "#FF6B35", // Tangerine (primary)
  "#8B5FBF", // Lavender
  "#00C9A7", // Mint
  "#4ECDC4", // Sky Blue
  "#FF6F91", // Sunset Pink
  "#FFB627", // Warning
  "#10D47C", // Success
];

export function PromediosChart({ mes }: { mes?: string }) {
  const { data: promedios, isLoading } = usePromediosPorDiaSemana(mes);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-[#8B5FBF]" />
      </div>
    );
  }

  if (!promedios || promedios.length === 0) {
    return null;
  }

  // Obtener todos los productos únicos
  const todosLosProductos = new Set<string>();
  promedios.forEach((dia: any) => {
    dia.productos.forEach((prod: any) => {
      todosLosProductos.add(prod.productoNombre);
    });
  });
  const productosArray = Array.from(todosLosProductos);

  // Transformar datos para Recharts
  const chartData = promedios.map((dia: any) => {
    const dataPoint: any = {
      dia: dia.diaNombre.substring(0, 3), // Abreviar días (Lun, Mar, etc.)
      diaCompleto: dia.diaNombre,
    };

    // Agregar cada producto como una propiedad
    dia.productos.forEach((prod: any) => {
      dataPoint[prod.productoNombre] = Math.round(prod.promedio);
    });

    return dataPoint;
  });

  // Calcular el valor máximo para el eje Y
  const maxValue = Math.max(
    ...chartData.flatMap((dia: any) =>
      productosArray.map((prod) => dia[prod] || 0),
    ),
  );
  const yAxisMax = Math.ceil(maxValue * 1.1); // 10% más para espaciado

  return (
    <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-[#E5E9F2] dark:border-[#2D2D44] p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-gradient-to-br from-[#8B5FBF] to-[#A47FD5] rounded-xl flex items-center justify-center shadow-md">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-[#1A1A2E] dark:text-white">
          Promedios por Día de la Semana
        </h3>
      </div>

      <div className="w-full h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              {productosArray.map((producto, index) => (
                <linearGradient
                  key={`gradient-${producto}`}
                  id={`colorGradient${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={COLORS[index % COLORS.length]}
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="100%"
                    stopColor={COLORS[index % COLORS.length]}
                    stopOpacity={0.6}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E9F2"
              opacity={0.3}
            />
            <XAxis
              dataKey="dia"
              tick={{ fill: "#6B7A94", fontSize: 14, fontWeight: 600 }}
              axisLine={{ stroke: "#E5E9F2" }}
              tickLine={{ stroke: "#E5E9F2" }}
            />
            <YAxis
              domain={[0, yAxisMax]}
              tick={{ fill: "#6B7A94", fontSize: 14 }}
              axisLine={{ stroke: "#E5E9F2" }}
              tickLine={{ stroke: "#E5E9F2" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "2px solid #8B5FBF",
                borderRadius: "12px",
                boxShadow: "0 10px 20px rgba(139, 95, 191, 0.15)",
                padding: "12px 16px",
              }}
              labelStyle={{
                color: "#1A1A2E",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
              itemStyle={{
                color: "#424C63",
                padding: "4px 0",
              }}
              labelFormatter={(value, payload) => {
                if (payload && payload.length > 0) {
                  return payload[0].payload.diaCompleto;
                }
                return value;
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "24px",
              }}
              iconType="circle"
              iconSize={10}
            />
            {productosArray.map((producto, index) => (
              <Bar
                key={producto}
                dataKey={producto}
                fill={`url(#colorGradient${index})`}
                radius={[8, 8, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
