import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ProjectionChart = ({ projections = {} }) => {
  const { currentTrajectory = [], goalTrajectory = [], optimisticTrajectory = [], labels = [] } = projections;

  const chartData = labels.map((label, idx) => ({
    week: label,
    'Current Path': currentTrajectory[idx] || 0,
    'Reduction Goal': goalTrajectory[idx] || 0,
    'Optimistic Path': optimisticTrajectory[idx] || 0
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-surface border border-green-500/10 p-3.5 rounded-xl shadow-lg flex flex-col gap-1.5">
          <p className="text-sm font-extrabold text-text-primary">{label}</p>
          <div className="h-px bg-green-500/10 my-1" />
          {payload.map((p, idx) => (
            <div key={idx} className="flex justify-between gap-5 items-center text-xs">
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
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
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
          <Legend 
            verticalAlign="top" 
            height={36}
            formatter={(value) => <span className="text-xs font-semibold text-text-muted">{value}</span>}
          />
          <Line 
            type="monotone" 
            dataKey="Current Path" 
            stroke="#ef4444" 
            strokeWidth={2} 
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="Reduction Goal" 
            stroke="#eab308" 
            strokeWidth={2} 
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="Optimistic Path" 
            stroke="#22c55e" 
            strokeWidth={2} 
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default ProjectionChart;
