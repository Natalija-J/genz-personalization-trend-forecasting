import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
  data: { month: string; value: number }[];
  color: string;
}

const TrendChart: React.FC<TrendChartProps> = ({ data, color }) => {
  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id={`colorGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#71717a', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#71717a', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: color }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            fillOpacity={1} 
            fill={`url(#colorGradient-${color})`} 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
