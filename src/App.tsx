import React, { useState, useEffect, useCallback } from 'react';
import { Task, Event, Expense, WellnessActivity, Message } from './types';
import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { Footer } from './components/Footer';
import { api } from './services/api';
import { processCommand } from './services/commandProcessor';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [wellnessActivities, setWellnessActivities] = useState<WellnessActivity[]>([]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: '¡Hola! Soy tu asistente personal. Escribe "ayuda" para ver los comandos disponibles.',
    sender: 'assistant',
    timestamp: new Date()
  }]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksData, eventsData, expensesData, wellnessData] = await Promise.all([
        api.getTasks(),
        api.getEvents(),
        api.getExpenses(),
        api.getWellness()
      ]);

      setTasks(tasksData);
      setEvents(eventsData);
      setExpenses(expensesData);
      setWellnessActivities(wellnessData);
    } catch (error) {
      console.error('Error fetching data:', error);
      addMessages([{
        id: crypto.randomUUID(),
        text: 'Error al cargar los datos. Por favor, intenta de nuevo más tarde.',
        sender: 'assistant',
        timestamp: new Date()
      }]);
    }
  };

  const addMessages = (newMessages: Message[]) => {
    setMessages(prev => [...prev, ...newMessages]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input;
    setInput('');
    addMessages([{
      id: crypto.randomUUID(),
      text: userInput,
      sender: 'user',
      timestamp: new Date()
    }]);
    setIsLoading(true);

    try {
      const responses = await processCommand(userInput);
      addMessages(responses);
      await fetchData();
    } catch (error) {
      addMessages([{
        id: crypto.randomUUID(),
        text: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.',
        sender: 'assistant',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-4">
        <Header />
        <main className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-[calc(100vh-12rem)] flex flex-col">
            <MessageList messages={messages} messagesEndRef={messagesEndRef} />
            <MessageInput
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSubmit={handleSubmit}
            />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}