const tips = {
  general: [
    'Toma pequeños descansos cada hora para mantener tu productividad.',
    'Establece metas diarias alcanzables para mantener el momentum.',
    'La organización es clave para el éxito. Dedica 5 minutos al final del día para planear el siguiente.',
    'Celebra tus pequeños logros, son parte de un gran progreso.',
  ],
  productivity: [
    'Usa la técnica Pomodoro: 25 minutos de trabajo, 5 de descanso.',
    'Prioriza tus tareas usando la matriz de Eisenhower.',
    'Elimina las distracciones durante tus horas más productivas.',
    'Agrupa tareas similares para maximizar tu eficiencia.',
  ],
  finance: [
    'Guarda al menos el 20% de tus ingresos mensuales.',
    'Revisa tus gastos semanalmente para identificar áreas de mejora.',
    'Crea un fondo de emergencia para 3-6 meses de gastos.',
    'Antes de comprar algo, espera 24 horas para evitar compras impulsivas.',
  ],
  exercise: [
    'Comienza con ejercicios suaves y aumenta gradualmente.',
    'La consistencia es más importante que la intensidad.',
    'Combina ejercicio cardiovascular con entrenamiento de fuerza.',
    'No olvides calentar antes y estirar después del ejercicio.',
  ],
  hydration: [
    'Bebe un vaso de agua al despertar para activar tu metabolismo.',
    'Mantén una botella de agua visible en tu escritorio.',
    'Configura recordatorios para beber agua cada hora.',
    'El agua con limón puede ayudar a mantener tu hidratación.',
  ],
  timeManagement: [
    'Planifica tus tareas más importantes para las primeras horas del día.',
    'Usa un calendario para visualizar mejor tus compromisos.',
    'Aprende a decir "no" a compromisos que no aportan valor.',
    'Reserva tiempo para imprevistos en tu agenda diaria.',
  ],

  getRandomTip(category: string = 'general'): string {
    const categoryTips = this[category as keyof typeof tips] || this.general;
    const randomIndex = Math.floor(Math.random() * categoryTips.length);
    return categoryTips[randomIndex];
  }
};