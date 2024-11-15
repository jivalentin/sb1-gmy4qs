import React from 'react';
import { Bot } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center gap-3 mb-6">
      <Bot className="w-8 h-8 text-blue-600" />
      <h1 className="text-2xl font-bold text-gray-800">Asistente Personal</h1>
    </header>
  );
}