// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ThemeProvider from './context/ThemeContext'; // <<< CORREÇÃO AQUI
import SidebarProvider from './context/SidebarContext'; // <<< CORREÇÃO AQUI
import AuthProvider from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Agora todos os providers são importados como default */}
    <ThemeProvider>
      <SidebarProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SidebarProvider>
    </ThemeProvider>
  </React.StrictMode>
);