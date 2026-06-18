import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const GaugeChart = ({ score = 50 }) => {
  // Score range: 0 (Good/Green) to 100 (Bad/Red)
  const data = [
    { value: score },
    { value: 100 - score },
  ];

  // Dynamic green-to-red color mapping based on score
  const getGaugeColor = (val) => {
    if (val < 35) return '#22c55e'; // Green
    if (val < 65) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  const needleColor = getGaugeColor(score);

  return (
    <div className="w-full h-44 flex flex-col items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="80%"
            innerRadius={65}
            outerRadius={80}
            stroke="none"
          >
            <Cell fill={needleColor} />
            <Cell fill="rgba(74, 222, 128, 0.08)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Centered needle label */}
      <div className="absolute top-[52%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-3xl font-black font-mono text-text-primary">
          {score}
        </span>
        <p className="text-[10px] font-bold tracking-wider text-text-muted uppercase mt-0.5">
          Carbon Score
        </p>
      </div>
      
      {/* Bottom Range Labels */}
      <div className="w-[170px] flex justify-between text-[10px] font-bold text-text-muted/60 mt-1">
        <span>0 (EXCELLENT)</span>
        <span>100 (HIGH)</span>
      </div>
    </div>
  );
};
export default GaugeChart;
