// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import NotasFaltas from './pages/NotasFaltas';
import FichaAluno from './pages/FichaAluno';
import Frequencia from './pages/Frequencia';

// Nossas novas páginas de autenticação
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';

// Nosso hook de autenticação
import { useAuth } from './context/AuthContext';

const PlaceholderPage = ({ title }) => (
  <div className="p-6">
    <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">{title}</h1>
    <p className="text-gray-600 dark:text-gray-300 mt-4">Conteúdo desta página será implementado em breve.</p>
  </div>
);

// Componente de Layout Principal (Dashboard com Sidebar e Header)
const AppLayout = () => (
  <div className="flex h-screen bg-light-bg dark:bg-gray-900 font-sans">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* As rotas filhas serão renderizadas aqui */}
        <Outlet /> 
      </main>
    </div>
  </div>
);

// Componente para proteger as rotas
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // Se não houver usuário, redireciona para a página de login
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/cadastro" element={user ? <Navigate to="/" /> : <Cadastro />} />

        {/* Rotas Protegidas dentro do Layout Principal */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="planos" element={<PlaceholderPage title="Planos de Aula" />} />
          <Route path="notas" element={<NotasFaltas />} />
          <Route path="frequencia" element={<Frequencia />} />
          <Route path="relatorios" element={<PlaceholderPage title="Relatórios" />} />
          <Route path="config" element={<PlaceholderPage title="Configurações" />} />
          <Route path="alunos/:alunoId" element={<FichaAluno />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;