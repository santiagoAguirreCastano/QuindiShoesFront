import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
    Area
} from 'recharts';

const agrupaciones = ['dia', 'mes', 'año'] as const;

interface ChartData {
    agrupacionLabel: string;
    total_ventas?: number;
    prediccion_ventas?: number;
    yhat_lower?: number;
    yhat_upper?: number;
    intervalo_confianza?: number;
    intervalo_confianza_superior?: number;
    intervalo_confianza_inferior?: number;
    yhat_band?: number;  // ← nuevo
    yhat_base?: number;  // ← nuevo
}


interface ProductoInfo {
    id: number;
    nombre: string;
    imagen_producto: string;
    total_vendido: number;
}

interface ProductoInactivo {
    id_producto: number;
    url_imagen: string;
    nombre_producto: string;
    precio_producto: number;
    stock: number;
}

export default function VentasPorRango() {
    const [agrupacion, setAgrupacion] = useState<'dia' | 'mes' | 'año'>('año');
    const [datosHistoricos, setDatosHistoricos] = useState<ChartData[]>([]);
    const [topProductosMas, setTopProductosMas] = useState<ProductoInfo[]>([]);
    const [topProductosMenos, setTopProductosMenos] = useState<ProductoInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [productosInactivos, setProductosInactivos] = useState<ProductoInactivo[]>([]);
    const [tipoGrafica, setTipoGrafica] = useState<'bar' | 'line'>('line');
    const [modoVisualizacion, setModoVisualizacion] = useState<'historico' | 'prediccion' | 'combinado'>('historico');
    const [prediccionesRaw, setPrediccionesRaw] = useState<ChartData[]>([]);
    const [tendencia, setTendencia] = useState("");
const [mae, setMae] = useState<number | null>(null);
const [mape, setMape] = useState<number | null>(null);

    const dataKeyX = 'agrupacionLabel';

    const formatLabel = (
        dateInput: string | Date | undefined,
        currentAgrupacion: typeof agrupacion
    ): string => {
        if (!dateInput) return "";

        const fecha = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
            return typeof dateInput === 'string' ? dateInput : "";
        }

        switch (currentAgrupacion) {
            case 'dia':
                return fecha.toLocaleDateString('es-ES');

            case 'mes': {
                const mesNombre = fecha.toLocaleString('es-ES', { month: 'long' });
                return `${mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1)} ${fecha.getFullYear()}`;
            }

            case 'año':
                return `${fecha.getFullYear()}`;

            default:
                return fecha.toLocaleDateString('es-ES');
        }
    };

    const sortChartData = (data: ChartData[], currentAgrupacion: typeof agrupacion) => {
        return [...data].sort((a, b) => {
            let dateA: Date | null = null;
            let dateB: Date | null = null;

            if (currentAgrupacion === 'dia' || currentAgrupacion === 'año') {
                dateA = new Date(a.agrupacionLabel);
                dateB = new Date(b.agrupacionLabel);
            } else if (currentAgrupacion === 'mes') {
                const [monthNameA, yearA] = a.agrupacionLabel.split(' ');
                const [monthNameB, yearB] = b.agrupacionLabel.split(' ');
                // Month names need to be mapped to numbers for accurate comparison
                const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
                const monthIndexA = monthNames.indexOf(monthNameA.toLowerCase());
                const monthIndexB = monthNames.indexOf(monthNameB.toLowerCase());
                
                // Ensure month index is valid before creating date
                if (monthIndexA === -1 || monthIndexB === -1) return 0; // Handle invalid month names

                dateA = new Date(parseInt(yearA), monthIndexA, 1);
                dateB = new Date(parseInt(yearB), monthIndexB, 1);

            }

            if (dateA && dateB && !isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
                return dateA.getTime() - dateB.getTime();
            }
            return 0;
        });
    };

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`https://quindishoes-backend-def.onrender.com/metricas/ventas?agrupacion=${agrupacion}`);
                const datosFormateados: ChartData[] = res.data.map((item: any) => {
                    let rawDate = item.fecha;
                    if (agrupacion === 'mes') {
                        // For 'mes' grouping, ensure `rawDate` is a full date string for `formatLabel` to work consistently
                        rawDate = `${item.anio}-${String(item.mes).padStart(2, '0')}-01`;
                    } else if (agrupacion === 'año') {
                        rawDate = `${item.anio}-01-01`;
                    }
                    return {
                        agrupacionLabel: formatLabel(rawDate, agrupacion),
                        total_ventas: parseFloat(item.total_ventas)
,
                    };
                });
                console.log("Datos Históricos Formateados:", datosFormateados);
                setDatosHistoricos(sortChartData(datosFormateados, agrupacion));
            } catch (err) {
                console.error('Error al obtener datos de ventas históricos:', err);
            }
            setLoading(false);
        };
        cargarDatos();
    }, [agrupacion]);

    useEffect(() => {
  if (modoVisualizacion !== 'historico') {
    setTipoGrafica('bar');
  }
}, [modoVisualizacion]);


    useEffect(() => {
        const obtenerPredicciones = async () => {
  if (modoVisualizacion === 'historico') {
    setPrediccionesRaw([]);
    setTendencia("");
    setMae(null);
    setMape(null);
    return;
  }

  try {
    const res = await fetch(`https://quindishoes-backend-def.onrender.com/metricasIA/metricas/prediccion?agrupacion=${agrupacion}`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
    }

    const data = await res.json();
    console.log("📦 Predicciones recibidas:", data);

    const formattedPreds: ChartData[] = data.prediccion.map((item: any) => {
      const fecha = new Date(item.ds);
      return {
        agrupacionLabel: formatLabel(fecha, agrupacion),
        prediccion_ventas: parseFloat(Number(item.yhat).toFixed(2)),
        yhat_lower: parseFloat(Number(item.yhat_lower).toFixed(2)),
        yhat_upper: parseFloat(Number(item.yhat_upper).toFixed(2))
      };
    });

    setPrediccionesRaw(formattedPreds);
    setTendencia(data.tendencia || "");

    // ✅ ACTUALIZA AQUÍ
    setMae(data.mae ?? data.precision?.mae ?? null);
    setMape(data.mape ?? data.precision?.mape ?? null);

  } catch (error) {
    console.error("Error en predicción:", error);
    setPrediccionesRaw([]);
    setTendencia("");
    setMae(null);
    setMape(null);
  }
};

        obtenerPredicciones();
    }, [modoVisualizacion, agrupacion]);

    const groupedPreds = useMemo(() => {
        if (prediccionesRaw.length === 0 || agrupacion === 'dia') {
            return prediccionesRaw;
        }

        const tempGrouped: Record<string, ChartData> = {};

        prediccionesRaw.forEach(item => {
            // Use item.agrupacionLabel directly as it's already formatted by formatLabel in the fetch
            const key = item.agrupacionLabel; 

            if (!tempGrouped[key]) {
                tempGrouped[key] = {
                    agrupacionLabel: key,
                    prediccion_ventas: 0,
                    yhat_lower: 0,
                    yhat_upper: 0
                };
            }

            tempGrouped[key].prediccion_ventas = (tempGrouped[key].prediccion_ventas || 0) + (item.prediccion_ventas || 0);
            tempGrouped[key].yhat_lower = (tempGrouped[key].yhat_lower || 0) + (item.yhat_lower || 0);
            tempGrouped[key].yhat_upper = (tempGrouped[key].yhat_upper || 0) + (item.yhat_upper || 0);
        });

        const result = Object.values(tempGrouped) as ChartData[];
        return sortChartData(result, agrupacion);
    }, [prediccionesRaw, agrupacion]);

   const chartData = useMemo(() => {
    const combinedMap = new Map<string, ChartData>();

    datosHistoricos.forEach(data => {
        combinedMap.set(data.agrupacionLabel, { ...data });
    });

    groupedPreds.forEach(pred => {
        const existing = combinedMap.get(pred.agrupacionLabel);
        if (existing) {
            existing.prediccion_ventas = pred.prediccion_ventas;
            existing.yhat_lower = pred.yhat_lower;
            existing.yhat_upper = pred.yhat_upper;
        } else {
            combinedMap.set(pred.agrupacionLabel, {
                agrupacionLabel: pred.agrupacionLabel,
                prediccion_ventas: pred.prediccion_ventas,
                yhat_lower: pred.yhat_lower,
                yhat_upper: pred.yhat_upper
            });
        }
    });

    const combinedArray = Array.from(combinedMap.values());

    combinedArray.forEach(item => {
        if (
            item.yhat_lower != null &&
            item.yhat_upper != null &&
            !isNaN(item.yhat_upper - item.yhat_lower)
        ) {
            item.intervalo_confianza = item.yhat_upper - item.yhat_lower;
            item.intervalo_confianza_superior = item.yhat_upper;
            item.intervalo_confianza_inferior = item.yhat_lower;
        }
    });

    let finalChartData: ChartData[];
    if (modoVisualizacion === 'historico') {
        finalChartData = combinedArray.filter(d => d.total_ventas !== undefined);
    } else if (modoVisualizacion === 'prediccion') {
        finalChartData = combinedArray.filter(d =>
            d.prediccion_ventas !== undefined ||
            d.yhat_lower !== undefined ||
            d.yhat_upper !== undefined
        );

        // ✅ Agrega el punto de prueba aquí
        if (finalChartData.length > 0) {
            console.warn("⚠️ Modo predicción activado con datos. Forzando punto visible de prueba.");
            finalChartData.push({
                agrupacionLabel: 'Test Falso',
                prediccion_ventas: 50000,
                yhat_lower: 40000,
                yhat_upper: 60000
            });
        }
    } else {
        finalChartData = combinedArray;
    }

    const sortedFinalChartData = sortChartData(finalChartData, agrupacion);

    console.log("🔎 chartData final para Recharts:", sortedFinalChartData);
    return sortedFinalChartData;
}, [modoVisualizacion, datosHistoricos, groupedPreds, agrupacion]);



    const yMax = useMemo(() => {
    let maxVal = 0;

    chartData.forEach(item => {
        maxVal = Math.max(
            maxVal,
            item.total_ventas || 0,
            item.prediccion_ventas || 0,
            item.yhat_upper || 0
        );
    });
    chartData.forEach((item) => {
  if (
    item.prediccion_ventas &&
    item.yhat_lower == null
  ) {
    console.warn("❗️ item sin yhat_lower:", item);
  }
});



console.log("Datos que van al gráfico:", chartData);


console.log("Valores numéricos:", chartData.map(d => ({
  label: d.agrupacionLabel,
  pred: typeof d.prediccion_ventas,
  hist: typeof d.total_ventas,
  low: typeof d.yhat_lower,
  high: typeof d.yhat_upper
})));
    let calculatedYMax = maxVal * 1.2;

    if (maxVal === 0) {
        calculatedYMax = 1;
    }

    if ((modoVisualizacion === 'prediccion' || modoVisualizacion === 'combinado')) {
        const maxUpper = chartData.reduce((acc, item) => 
            Math.max(acc, item.yhat_upper || 0), 0
        );

        if (calculatedYMax < maxUpper * 1.1) {
            calculatedYMax = maxUpper * 1.2;
        }

        if (maxUpper === 0 && calculatedYMax === 0) {
            calculatedYMax = 1;
        }
    }

    // Normaliza a múltiplos de 10,000 para mejor presentación
    calculatedYMax = Math.ceil(calculatedYMax / 10000) * 10000;

    console.log("Calculated yMax:", calculatedYMax, " (modo:", modoVisualizacion, ")");
    return calculatedYMax;
}, [chartData, modoVisualizacion]);


    // This tick formatter is good. Keep it.
   const formatYAxisTick = (value: number) => {
    if (value >= 1_000_000_000) {
        return `$${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
        return `$${(value / 1_000).toFixed(1)}K`;
    }
    return `$${value}`;
};


    const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const dataItem = payload[0].payload;
        return (
            <div className="custom-tooltip bg-white p-3 border border-gray-300 rounded shadow-lg text-sm">
                <p className="label text-gray-700 font-bold">{`Fecha: ${label}`}</p>

                {dataItem.total_ventas !== undefined && (
                    <p className="intro text-blue-500">
                        {`Ventas Históricas: ${formatYAxisTick(dataItem.total_ventas)}`}
                    </p>
                )}

                {dataItem.prediccion_ventas !== undefined && (
                    <>
                        <p className="intro text-green-500">
                            {`Ventas Predichas: ${formatYAxisTick(dataItem.prediccion_ventas)}`}
                        </p>

                        {dataItem.yhat_lower !== undefined && dataItem.yhat_upper !== undefined && (
                            <p className="intro text-green-500">
                                {`Intervalo (90%): ${formatYAxisTick(dataItem.yhat_lower)} - ${formatYAxisTick(dataItem.yhat_upper)}`}
                            </p>
                        )}
                    </>
                )}
            </div>
        );
    }
    return null;
};


    useEffect(() => {
        const cargarTopProductos = async () => {
            try {
                const [masRes, menosRes] = await Promise.all([
                    axios.get('https://quindishoes-backend-def.onrender.com/metricas/top-productos?tipo=mas&limite=5'),
                    axios.get('https://quindishoes-backend-def.onrender.com/metricas/top-productos?tipo=menos&limite=5')
                ]);
                setTopProductosMas(masRes.data);
                setTopProductosMenos(menosRes.data);
            } catch (err) {
                console.error('Error al obtener top productos:', err);
            }
        };
        cargarTopProductos();
    }, []);

    useEffect(() => {
        const cargarInactivos = async () => {
            try {
                const res = await axios.get('https://quindishoes-backend-def.onrender.com/metricas/productos-inactivos');
                setProductosInactivos(res.data);
            } catch (err) {
                console.error('Error al obtener productos inactivos:', err);
            }
        };
        cargarInactivos();
    }, []);
console.log("🔎 chartData en render:", chartData);

console.log("🔎 chartData DEBUG:", chartData.map(d => ({
  label: d.agrupacionLabel,
  pred: d.prediccion_ventas,
  isValid: typeof d.prediccion_ventas === 'number' && !isNaN(d.prediccion_ventas)
})));
if (modoVisualizacion === 'prediccion') {
    console.log("🧪 ChartData generado (solo predicción):", chartData);
    console.log("Predicciones con yhat:", chartData.filter(d => typeof d.prediccion_ventas === "number"));
}


   
        return (
  <div className="p-6 bg-gray-600 min-h-screen rounded-xl text-gray-800">
    <h2 className="text-3xl font-bold text-white text-center mb-8">
      Ventas por {agrupacion.toUpperCase()}
    </h2>

    {/* Filtros con estilo moderno */}
<div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in">
  {/* Agrupación */}
  <div className="flex flex-col items-start">
    <label className="text-sm font-semibold text-white mb-2">Agrupación:</label>
    <select
      value={agrupacion}
      onChange={(e) => setAgrupacion(e.target.value as typeof agrupacion)}
      className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    >
      {agrupaciones.map((a) => (
        <option key={a} value={a}>
          {a.charAt(0).toUpperCase() + a.slice(1)}
        </option>
      ))}
    </select>
  </div>

  {/* Tipo de gráfica */}
  <div className="flex flex-col items-start">
    <label className="text-sm font-semibold text-white mb-2">Tipo de gráfica:</label>
    <select
      value={tipoGrafica}
      onChange={(e) => setTipoGrafica(e.target.value as any)}
      disabled={modoVisualizacion !== 'historico'}
      className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 shadow-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    >
      <option value="bar">Barras</option>
      <option value="line">Línea</option>
    </select>
  </div>

  {/* Vista */}
  <div className="flex flex-col items-start">
    <label className="text-sm font-semibold text-white mb-2">Vista:</label>
    <select
      value={modoVisualizacion}
      onChange={(e) => setModoVisualizacion(e.target.value as any)}
      className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    >
      <option value="historico">Solo histórico</option>
      <option value="prediccion">Solo predicción</option>
      <option value="combinado">Histórico + Predicción</option>
    </select>
  </div>
</div>


    {/* Tendencia */}
    {modoVisualizacion !== 'historico' && tendencia && (
      <p className={`text-center mt-4 font-semibold text-lg transition-all duration-500 ${tendencia === 'positiva' ? 'text-green-400' : 'text-red-400'}`}>
        Tendencia {tendencia}
      </p>
    )}

    {/* Métrica de precisión */}
    {modoVisualizacion !== 'historico' && (
      <div className="flex justify-center mt-6 gap-6 flex-wrap animate-fade-in">
        <div className="bg-white rounded-2xl p-4 shadow w-60 text-center hover:scale-105 transition">
          <p className="text-sm text-gray-500">Diferencia promedio en pesos</p>
          <p className="text-2xl font-bold text-blue-500">
            {mae != null ? mae.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : 'Sin datos'}
          </p>
        </div>
        <p className="text-center text-sm text-gray-400 italic w-full">
          *Las predicciones pueden variar con cada recarga.
        </p>
      </div>
    )}

    {/* Gráfico + Productos No Vendidos */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-12">
      {/* Gráfica (colspan 2 para agrandar) */}
     {/* Gráfica (colspan 2 para agrandar) */}
<div className="xl:col-span-2 bg-white rounded-2xl shadow p-6 h-[700px] animate-fade-in-slow">
  {chartData.length === 0 ? (
    <div className="flex items-center justify-center h-full text-gray-400 text-lg italic">
      No hay datos para mostrar.
    </div>
  ) : (
    <ResponsiveContainer width="100%" height="100%">
      {tipoGrafica === 'bar' ? (
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey={dataKeyX} />
          <YAxis domain={[0, yMax]} tickFormatter={formatYAxisTick} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {modoVisualizacion !== 'prediccion' && (
            <Bar dataKey="total_ventas" fill="#60A5FA" name="Ventas Históricas" />
          )}
          {modoVisualizacion !== 'historico' && (
            <Bar dataKey="prediccion_ventas" fill="#34D399" name="Ventas Predichas" />
          )}
        </BarChart>
      ) : (
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey={dataKeyX} />
          <YAxis domain={[0, yMax]} tickFormatter={formatYAxisTick} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {modoVisualizacion !== 'prediccion' && (
            <Line type="monotone" dataKey="total_ventas" stroke="#60A5FA" strokeWidth={3} dot={{ r: 4 }} name="Ventas Históricas" />
          )}
          {modoVisualizacion !== 'historico' && (
            <Line type="monotone" dataKey="prediccion_ventas" stroke="#34D399" strokeWidth={3} dot={{ r: 4 }} name="Ventas Predichas" />
          )}
        </LineChart>
      )}
    </ResponsiveContainer>
  )}
</div>


      {/* Productos no vendidos */}
      <div className="bg-white rounded-2xl shadow p-6 animate-fade-in">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Productos No Vendidos (Semana)</h3>
        {productosInactivos.length === 0 ? (
          <p className="text-center text-green-500">¡Todos han sido vendidos! 🎉</p>
        ) : (
          <div className="space-y-4">
            {productosInactivos.map((producto, i) => (
              <div key={producto.id_producto} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                <img src={producto.url_imagen} alt={producto.nombre_producto} className="w-12 h-12 object-cover rounded-md" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 truncate">{producto.nombre_producto}</p>
                  <p className="text-sm text-gray-500">ID: {producto.id_producto}</p>
                </div>
                <span className="text-sm font-bold text-gray-700">${producto.precio_producto?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Tops: Más y Menos Vendidos (ahora debajo de gráfica) */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-16 animate-fade-in-slow">
  {[{
    titulo: "Top Productos Más Vendidos",
    productos: topProductosMas,
    color: 'from-green-100 to-green-50',
    borde: 'green-500',
    icono: '🔥'
  }, {
    titulo: "Top Productos Menos Vendidos",
    productos: topProductosMenos,
    color: 'from-red-100 to-red-50',
    borde: 'red-500',
    icono: '📉'
  }].map(({ titulo, productos, color, borde, icono }, idx) => (
    <div
      key={idx}
      className={`bg-white backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-6 transition duration-500 hover:shadow-2xl`}
    >
      <h3 className="text-xl font-extrabold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
        <span className={`text-${borde} text-2xl`}>{icono}</span> {titulo}
      </h3>

      <div className="space-y-4">
        {productos.map((prod, i) => (
          <div
            key={prod.id}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl bg-gradient-to-r ${color} border-l-4 border-${borde}
              shadow-sm hover:shadow-md transition transform hover:-translate-y-1 hover:scale-[1.01] duration-300`}
          >
            {/* Ranking con medalla */}
            <div
              className={`relative w-12 h-12 flex items-center justify-center rounded-full shadow-inner text-white font-bold text-lg
              ${
                i === 0
                  ? 'bg-gradient-to-tr from-yellow-400 to-yellow-500'
                  : i === 1
                  ? 'bg-gradient-to-tr from-gray-300 to-gray-400'
                  : i === 2
                  ? 'bg-gradient-to-tr from-orange-400 to-orange-500'
                  : 'bg-gray-700'
              }`}
            >
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}

              {/* Insignia 🏆 solo para el primero */}
              {i === 0 && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full shadow-md animate-pulse">
                  🏆
                </div>
              )}
            </div>

            {/* Imagen */}
            <img
              src={prod.imagen_producto}
              alt={prod.nombre}
              className="w-14 h-14 rounded-lg object-cover shadow-md border border-gray-300"
            />

            {/* Detalles */}
            <div className="flex-1">
              <p className="text-md font-semibold text-gray-800 truncate">{prod.nombre}</p>
              <p className="text-sm text-gray-600">
                Cantidad: <span className="font-bold text-gray-700">{prod.total_vendido}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>


  </div>
);


}
