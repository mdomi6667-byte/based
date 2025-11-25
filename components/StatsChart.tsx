import React from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Reputation', uv: 31.47, fill: '#0052FF' },
  { name: 'Impact', uv: 26.69, fill: '#8884d8' },
  { name: 'Activity', uv: 15.69, fill: '#83a6ed' },
  { name: 'Consistency', uv: 8.22, fill: '#8dd1e1' },
];

const StatsChart: React.FC = () => {
  return (
    <div className="w-full h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="20%" 
                outerRadius="90%" 
                barSize={15} 
                data={data}
                startAngle={180} 
                endAngle={0}
            >
                <RadialBar
                    background
                    clockWise
                    dataKey="uv"
                    cornerRadius={10}
                    label={{ position: 'insideStart', fill: '#fff' }}
                />
                <Legend 
                    iconSize={10} 
                    layout="vertical" 
                    verticalAlign="middle" 
                    wrapperStyle={{
                        top: '50%',
                        right: 0,
                        transform: 'translate(0, -50%)',
                        lineHeight: '24px',
                    }} 
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
            </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute top-0 left-0 p-4">
            <h4 className="text-sm font-semibold text-gray-900">Builder Score</h4>
            <span className="text-xs text-gray-500">Based on weekly activity</span>
        </div>
    </div>
  );
};

export default StatsChart;
