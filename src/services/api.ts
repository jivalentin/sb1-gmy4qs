import { Task, Event, Expense, WellnessActivity } from '../types';

// Initialize local storage with empty arrays if not exists
const initializeStorage = () => {
  if (!localStorage.getItem('tasks')) localStorage.setItem('tasks', '[]');
  if (!localStorage.getItem('events')) localStorage.setItem('events', '[]');
  if (!localStorage.getItem('expenses')) localStorage.setItem('expenses', '[]');
  if (!localStorage.getItem('wellness')) localStorage.setItem('wellness', '[]');
};

initializeStorage();

export const api = {
  async getTasks(): Promise<Task[]> {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
  },

  async getEvents(): Promise<Event[]> {
    return JSON.parse(localStorage.getItem('events') || '[]');
  },

  async getExpenses(): Promise<Expense[]> {
    return JSON.parse(localStorage.getItem('expenses') || '[]');
  },

  async getWellness(): Promise<WellnessActivity[]> {
    return JSON.parse(localStorage.getItem('wellness') || '[]');
  },

  async addTask(description: string): Promise<Task> {
    const tasks = await this.getTasks();
    const newTask: Task = {
      id: crypto.randomUUID(),
      description,
      completed: false,
      date: new Date().toISOString()
    };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return newTask;
  },

  async toggleTask(id: string): Promise<Task> {
    const tasks = await this.getTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    task.completed = !task.completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return task;
  },

  async addEvent(event: Omit<Event, 'id'>): Promise<Event> {
    const events = await this.getEvents();
    const newEvent: Event = {
      id: crypto.randomUUID(),
      ...event
    };
    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));
    return newEvent;
  },

  async addExpense(expense: Omit<Expense, 'id' | 'date'>): Promise<Expense> {
    const expenses = await this.getExpenses();
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      ...expense,
      date: new Date().toISOString()
    };
    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    return newExpense;
  },

  async addWellness(activity: Omit<WellnessActivity, 'id' | 'date'>): Promise<WellnessActivity> {
    const activities = await this.getWellness();
    const newActivity: WellnessActivity = {
      id: crypto.randomUUID(),
      ...activity,
      date: new Date().toISOString()
    };
    activities.push(newActivity);
    localStorage.setItem('wellness', JSON.stringify(activities));
    return newActivity;
  }
};