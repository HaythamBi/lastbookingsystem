import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { ToastProvider } from './contexts/ToastContext';
import { AppRouter } from './components/AppRouter';

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </ToastProvider>
  );
}