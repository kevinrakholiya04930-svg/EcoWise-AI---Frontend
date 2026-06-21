import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const CategoryBar = ({ data = {} }) => {
  const chartData = useMemo(() => [
    { name: 'Transport', value: data.transportation || 0, fill: '#22c55e' },
    { name: 'Energy', value: data.electricity || 0, fill: '#eab308' },
    { name: 'Food', value: data.food || 0, fill: '#ef4444' },
    { name: 'Digital', value: data.digital || 0, fill: '#6366f1' },
  ], [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-bg-surface border border-green-500/10 p-3 rounded-xl shadow-lg">
          <p className="text-sm font-bold text-text-primary">{item.name}</p>
          <p className="text-xs font-semibold text-text-muted mt-1">
            {item.value} kg CO₂
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 222, 128, 0.05)" />
          <XAxis
            dataKey="name"
            stroke="rgba(74, 222, 128, 0.3)"
            tick={{ fill: '#86efac', fontSize: 11, fontWeight: 600 }}
          />
          <YAxis
            stroke="rgba(74, 222, 128, 0.3)"
            tick={{ fill: '#86efac', fontSize: 11, fontWeight: 600 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default CategoryBar;
