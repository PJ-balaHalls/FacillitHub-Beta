import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import NotasFaltas from './pages/NotasFaltas';
import FichaAluno from './pages/FichaAluno';
import Frequencia from './pages/Frequencia';

const PlaceholderPage = ({ title }) => (
  <div className="p-6">
    <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">{title}</h1>
    <p className="text-gray-600 dark:text-gray-300 mt-4">Conteúdo desta página será implementado em breve.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-light-bg dark:bg-gray-900 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/planos" element={<PlaceholderPage title="Planos de Aula" />} />
              <Route path="/notas" element={<NotasFaltas />} />
              <Route path="/frequencia" element={<Frequencia />} />
              <Route path="/relatorios" element={<PlaceholderPage title="Relatórios" />} />
              <Route path="/config" element={<PlaceholderPage title="Configurações" />} />
              <Route path="/alunos/:alunoId" element={<FichaAluno />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;