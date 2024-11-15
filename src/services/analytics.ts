import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Expense, WellnessActivity, DailyWaterLog, ExpenseAnalytics } from '../types';
import { api } from './api';

export const analytics = {
  async getExpenseAnalytics(): Promise<ExpenseAnalytics> {
    const expenses = await api.getExpenses();
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    const byCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const monthlyExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= monthStart && expDate <= monthEnd;
    });

    const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const recentTransactions = expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      totalSpent,
      byCategory,
      monthlyTrend: [{ month: format(now, 'MMM'), amount: monthlyTotal }],
      recentTransactions
    };
  },

  async getWaterIntakeStats(): Promise<DailyWaterLog[]> {
    const activities = await api.getWellness();
    const waterActivities = activities.filter(a => a.type === 'water');
    
    const now = new Date();
    const interval = { start: startOfMonth(now), end: now };
    
    return eachDayOfInterval(interval).map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayActivities = waterActivities.filter(a => a.date.startsWith(dateStr));
      const glasses = dayActivities.reduce((sum, a) => sum + (a.value || 0), 0);
      
      return {
        date: dateStr,
        glasses,
        target: 8 // Default target: 8 glasses per day
      };
    });
  },

  async getExerciseStats() {
    const activities = await api.getWellness();
    const exerciseActivities = activities.filter(a => a.type === 'exercise');
    
    return exerciseActivities.map(activity => ({
      date: format(new Date(activity.date), 'MMM dd'),
      duration: activity.duration || 0,
      type: activity.details
    }));
  }
};