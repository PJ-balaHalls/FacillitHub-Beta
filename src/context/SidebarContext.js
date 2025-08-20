// src/context/SidebarContext.js
import React, { createContext, useState, useContext } from 'react';

// Deixamos o contexto local ao arquivo
const SidebarContext = createContext();

// Criamos um hook para consumir o contexto de forma fácil e segura
export const useSidebar = () => {
  return useContext(SidebarContext);
};

// O Provider é a exportação padrão
export default function SidebarProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};