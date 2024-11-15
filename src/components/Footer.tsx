import React from 'react';
import { Calendar, CheckCircle2, DollarSign, Heart, HelpCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-4 flex justify-center gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Calendar className="w-4 h-4" /> Eventos
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <CheckCircle2 className="w-4 h-4" /> Tareas
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <DollarSign className="w-4 h-4" /> Gastos
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Heart className="w-4 h-4" /> Bienestar
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <HelpCircle className="w-4 h-4" /> Ayuda
      </div>
    </footer>
  );
}