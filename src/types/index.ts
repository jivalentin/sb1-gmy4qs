export interface Task {
  id: string;
  description: string;
  completed: boolean;
  date: string;
  dueDate?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  description?: string;
  category?: string;
  isRecurring?: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  paymentMethod?: string;
  tags?: string[];
}

export interface WellnessActivity {
  id: string;
  type: 'water' | 'exercise' | 'reflection';
  value?: number;
  details?: string;
  date: string;
  duration?: number;
  intensity?: 'low' | 'medium' | 'high';
  mood?: 'bad' | 'neutral' | 'good';
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'chart' | 'summary';
  data?: any;
}

export interface DailyWaterLog {
  date: string;
  glasses: number;
  target: number;
}

export interface ExerciseRoutine {
  id: string;
  name: string;
  weekday: number;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    duration?: number;
  }[];
}

export interface ExpenseAnalytics {
  totalSpent: number;
  byCategory: Record<string, number>;
  monthlyTrend: {
    month: string;
    amount: number;
  }[];
  recentTransactions: Expense[];
}