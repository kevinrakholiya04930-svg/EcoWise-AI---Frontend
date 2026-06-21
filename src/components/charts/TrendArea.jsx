import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatWeekStr } from '../../utils/formatters';

export const TrendArea = ({ history = [] }) => {
  const chartData = useMemo(
    () =>
      history.map((entry) => ({
        week: formatWeekStr(entry.week),
        total: entry.emissions.total,
        transportation: entry.emissions.transportation,
        electricity: entry.emissions.electricity,
        food: entry.emissions.food,
        digital: entry.emissions.digital,
      })),
    [history]
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-surface border border-green-500/10 p-4 rounded-xl shadow-lg flex flex-col gap-1.5">
          <p className="text-sm font-extrabold text-text-primary">{label}</p>
          <div className="h-px bg-green-500/10 my-1" />
          {payload.map((p, idx) => (
            <div key={idx} className="flex justify-between gap-6 items-center text-xs">
              <span className="font-semibold text-text-muted">{p.name}:</span>
              <span className="font-bold font-mono" style={{ color: p.color }}>{p.value} kg</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 222, 128, 0.05)" />
          <XAxis
            dataKey="week"
            stroke="rgba(74, 222, 128, 0.3)"
            tick={{ fill: '#86efac', fontSize: 10, fontWeight: 600 }}
          />
          <YAxis
            stroke="rgba(74, 222, 128, 0.3)"
            tick={{ fill: '#86efac', fontSize: 10, fontWeight: 600 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            name="Total Emissions"
            stroke="#22c55e"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTotal)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
export default TrendArea;
