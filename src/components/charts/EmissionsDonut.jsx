import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const EmissionsDonut = ({ data = {} }) => {
  const chartData = [
    { name: 'Transportation', value: data.transportation || 0, color: '#22c55e' },
    { name: 'Electricity', value: data.electricity || 0, color: '#eab308' },
    { name: 'Food', value: data.food || 0, color: '#ef4444' },
    { name: 'Digital', value: data.digital || 0, color: '#6366f1' },
  ].filter(item => item.value > 0);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
      return (
        <div className="bg-bg-surface border border-green-500/10 p-3 rounded-xl shadow-lg">
          <p className="text-sm font-bold text-text-primary">{item.name}</p>
          <p className="text-xs font-semibold text-text-muted mt-1">
            {item.value} kg CO₂ ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 flex flex-col items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-xs font-semibold text-text-muted">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Centered label */}
      <div className="absolute top-[38%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-2xl font-extrabold text-text-primary font-mono">{total}</span>
        <p className="text-[10px] font-bold tracking-wider text-text-muted uppercase">kg CO₂</p>
      </div>
    </div>
  );
};
export default EmissionsDonut;
