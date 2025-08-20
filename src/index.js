// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// --- INÍCIO DA CORREÇÃO ---
// Removemos as chaves {} de ThemeProvider e SidebarProvider
// para importá-los como padrão (default).
import ThemeProvider from './context/ThemeContext';
import SidebarProvider from './context/SidebarContext';
// A importação do AuthProvider já estava correta.
import { AuthProvider } from './context/AuthContext';
// --- FIM DA CORREÇÃO ---


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <SidebarProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SidebarProvider>
    </ThemeProvider>
  </React.StrictMode>
);