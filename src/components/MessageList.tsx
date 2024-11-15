import React from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '../types';
import { ExpenseChart } from './charts/ExpenseChart';
import { WellnessChart } from './charts/WellnessChart';

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function MessageList({ messages, messagesEndRef }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              {message.type === 'chart' && message.data && (
                <div className="mb-3 bg-white rounded-lg p-2">
                  {message.data.type === 'expense' && <ExpenseChart data={message.data.chartData} />}
                  {message.data.type === 'wellness' && <WellnessChart data={message.data.chartData} />}
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.text}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {format(message.timestamp, 'HH:mm')}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
}