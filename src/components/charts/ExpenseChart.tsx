import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ExpenseChartProps {
  data: {
    name: string;
    amount: number;
  }[];
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}