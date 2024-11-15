import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WellnessChartProps {
  data: {
    date: string;
    value: number;
  }[];
}

export function WellnessChart({ data }: WellnessChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3B82F6" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}