import { api } from './api';
import { analytics } from './analytics';
import { tips } from './tips';
import { format } from 'date-fns';
import { Message } from '../types';

export async function processCommand(command: string): Promise<Message[]> {
  const lowerCommand = command.toLowerCase().trim();

  if (lowerCommand === 'ayuda') {
    return [createMessage(getHelpText())];
  }

  const [action, ...args] = lowerCommand.split(' ');

  try {
    switch (action) {
      case 'tarea':
        return handleTaskCommand(args.join(' '));
      case 'evento':
        return handleEventCommand(args.join(' '));
      case 'gasto':
        return handleExpenseCommand(args.join(' '));
      case 'bienestar':
        return handleWellnessCommand(args.join(' '));
      case 'estadisticas':
        return handleStatsCommand(args.join(' '));
      case 'tips':
        return handleTipsCommand(args.join(' '));
      default:
        return [createMessage('Comando no reconocido. Escribe "ayuda" para ver los comandos disponibles.')];
    }
  } catch (error) {
    console.error('Error processing command:', error);
    return [createMessage('Ha ocurrido un error al procesar el comando. Por favor, intenta de nuevo.')];
  }
}

function createMessage(text: string, type: 'text' | 'chart' | 'summary' = 'text', data?: any): Message {
  return {
    id: crypto.randomUUID(),
    text,
    sender: 'assistant',
    timestamp: new Date(),
    type,
    data
  };
}

async function handleTaskCommand(args: string): Promise<Message[]> {
  if (args.startsWith('agregar ')) {
    const description = args.slice(8).trim();
    if (!description) {
      return [createMessage('Por favor, proporciona una descripción para la tarea.')];
    }
    const task = await api.addTask(description);
    const tip = tips.getRandomTip('productivity');
    return [
      createMessage(`✅ Tarea agregada: ${description}`),
      createMessage(`💡 Tip: ${tip}`)
    ];
  }

  if (args === 'listar') {
    const tasks = await api.getTasks();
    if (tasks.length === 0) {
      return [createMessage('No hay tareas pendientes.')];
    }

    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);
    
    const summary = `📋 Tareas Pendientes (${pendingTasks.length}):
${pendingTasks.map((task, i) => `${i + 1}. ${task.description}`).join('\n')}

✅ Tareas Completadas (${completedTasks.length}):
${completedTasks.map((task, i) => `${i + 1}. ${task.description}`).join('\n')}

Progreso: ${Math.round((completedTasks.length / tasks.length) * 100)}% completado`;

    return [createMessage(summary)];
  }

  return [createMessage('Comando de tarea no válido. Usa "tarea agregar [descripción]" o "tarea listar".')];
}

async function handleExpenseCommand(args: string): Promise<Message[]> {
  if (args === 'resumen') {
    const expenseAnalytics = await analytics.getExpenseAnalytics();
    const chartData = Object.entries(expenseAnalytics.byCategory).map(([name, amount]) => ({
      name,
      amount
    }));

    const summary = `💰 Resumen de Gastos

Total gastado: $${expenseAnalytics.totalSpent.toFixed(2)}

Por categoría:
${Object.entries(expenseAnalytics.byCategory)
  .map(([category, total]) => `• ${category}: $${total.toFixed(2)}`)
  .join('\n')}

Últimas transacciones:
${expenseAnalytics.recentTransactions
  .map(t => `• $${t.amount.toFixed(2)} en ${t.category} (${format(new Date(t.date), 'dd/MM/yyyy')})`)
  .join('\n')}`;

    return [
      createMessage(summary),
      createMessage('Distribución de gastos por categoría:', 'chart', {
        type: 'expense',
        chartData
      })
    ];
  }

  const [amount, ...categoryParts] = args.split(' ');
  const category = categoryParts.join(' ');

  if (!amount || !category || isNaN(Number(amount))) {
    return [createMessage('Formato incorrecto. Usa "gasto [monto] [categoría]" o "gasto resumen".')];
  }

  await api.addExpense({ amount: Number(amount), category });
  const tip = tips.getRandomTip('finance');
  return [
    createMessage(`💸 Gasto registrado: $${amount} en ${category}`),
    createMessage(`💡 Tip financiero: ${tip}`)
  ];
}

async function handleWellnessCommand(args: string): Promise<Message[]> {
  const [type, ...details] = args.split(' ');

  switch (type) {
    case 'agua': {
      const glasses = parseInt(details[0]);
      if (isNaN(glasses)) {
        return [createMessage('Por favor, especifica el número de vasos de agua.')];
      }
      await api.addWellness({ type: 'water', value: glasses });
      const stats = await analytics.getWaterIntakeStats();
      const chartData = stats.map(s => ({
        date: format(new Date(s.date), 'dd/MM'),
        value: s.glasses
      }));

      return [
        createMessage(`🚰 Registrado: ${glasses} vasos de agua. ¡Bien hecho!`),
        createMessage('Consumo de agua esta semana:', 'chart', {
          type: 'wellness',
          chartData
        }),
        createMessage(`💡 Tip: ${tips.getRandomTip('hydration')}`)
      ];
    }

    case 'ejercicio': {
      const exercise = details.join(' ');
      if (!exercise) {
        return [createMessage('Por favor, describe tu actividad física.')];
      }
      await api.addWellness({ type: 'exercise', details: exercise });
      const stats = await analytics.getExerciseStats();
      
      return [
        createMessage(`🏃‍♂️ Ejercicio registrado: ${exercise}. ¡Sigue así!`),
        createMessage(`💡 Tip de ejercicio: ${tips.getRandomTip('exercise')}`)
      ];
    }

    default:
      return [createMessage('Tipo de actividad no válido. Usa "bienestar agua [vasos]" o "bienestar ejercicio [descripción]".')];
  }
}

async function handleEventCommand(args: string): Promise<Message[]> {
  if (args.startsWith('agregar ')) {
    const eventDetails = args.slice(8).trim();
    const [name, date, time] = eventDetails.split(',').map(s => s.trim());
    
    if (!name || !date || !time) {
      return [createMessage('Por favor, proporciona el nombre, fecha y hora del evento (separados por comas).')];
    }

    await api.addEvent({ name, date, time });
    return [
      createMessage(`📅 Evento agregado: ${name} el ${date} a las ${time}`),
      createMessage(`💡 Tip: ${tips.getRandomTip('timeManagement')}`)
    ];
  }

  if (args === 'listar') {
    const events = await api.getEvents();
    if (events.length === 0) {
      return [createMessage('No hay eventos programados.')];
    }

    const sortedEvents = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const summary = `📅 Próximos Eventos:

${sortedEvents.map((event, i) => `${i + 1}. ${event.name}
   📆 ${event.date} ⏰ ${event.time}`).join('\n\n')}`;

    return [createMessage(summary)];
  }

  return [createMessage('Comando de evento no válido. Usa "evento agregar [nombre], [fecha], [hora]" o "evento listar".')];
}

async function handleStatsCommand(type: string): Promise<Message[]> {
  switch (type) {
    case 'gastos': {
      const analytics = await analytics.getExpenseAnalytics();
      return [
        createMessage('📊 Estadísticas de Gastos', 'chart', {
          type: 'expense',
          chartData: Object.entries(analytics.byCategory).map(([name, amount]) => ({
            name,
            amount
          }))
        })
      ];
    }
    case 'bienestar': {
      const waterStats = await analytics.getWaterIntakeStats();
      return [
        createMessage('📊 Estadísticas de Bienestar', 'chart', {
          type: 'wellness',
          chartData: waterStats.map(s => ({
            date: format(new Date(s.date), 'dd/MM'),
            value: s.glasses
          }))
        })
      ];
    }
    default:
      return [createMessage('Tipo de estadística no válido. Usa "estadisticas gastos" o "estadisticas bienestar".')];
  }
}

async function handleTipsCommand(category: string): Promise<Message[]> {
  const tip = tips.getRandomTip(category || 'general');
  return [createMessage(`💡 ${tip}`)];
}

function getHelpText(): string {
  return `
🤖 Comandos Disponibles:

📋 TAREAS
• tarea agregar [descripción] - Nueva tarea
• tarea listar - Ver todas las tareas

📅 EVENTOS
• evento agregar [nombre], [fecha], [hora] - Nuevo evento
• evento listar - Ver calendario

💰 GASTOS
• gasto [monto] [categoría] - Registrar gasto
• gasto resumen - Ver análisis de gastos

🧘‍♂️ BIENESTAR
• bienestar agua [vasos] - Registrar agua
• bienestar ejercicio [descripción] - Registrar ejercicio

📊 ESTADÍSTICAS
• estadisticas gastos - Ver gráficos de gastos
• estadisticas bienestar - Ver progreso

💡 TIPS
• tips [categoría] - Obtener consejos
  Categorías: general, productividad, finanzas, ejercicio

❓ AYUDA
• ayuda - Ver este mensaje
`.trim();
}