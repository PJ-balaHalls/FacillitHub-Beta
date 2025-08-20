// src/pages/Dashboard.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiClipboard, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; // Importa nosso hook
import GeradorCodigo from '../components/GeradorCodigo'; // Importa o novo componente

const Widget = ({ icon, title, value, color }) => (
  <motion.div 
    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center gap-4"
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className={`text-3xl p-3 rounded-full ${color}`}>
        {icon}
    </div>
    <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-semibold text-gray-800 dark:text-white">{value}</p>
    </div>
  </motion.div>
);

const Notification = ({ type, message }) => {
    const isPositive = type === 'positive';
    const bgColor = isPositive ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900';
    const textColor = isPositive ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300';
    const icon = isPositive ? <FiCheckCircle /> : <FiAlertTriangle />;

    return (
        <div className={`p-4 rounded-lg flex items-center gap-4 ${bgColor} ${textColor}`}>
            <span className="text-2xl">{icon}</span>
            <p>{message}</p>
        </div>
    );
};

const Dashboard = () => {
  const { profile } = useAuth(); // Pega o perfil completo do usuário logado

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
        Dashboard {profile?.user_category === 'professor' && 'do Professor'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Notification type="positive" message="Todas as notas foram lançadas com sucesso!" />
          <Notification type="negative" message="Atenção: 3 atividades pendentes de correção." />
      </div>

      {/* Renderização condicional da ferramenta de gerar código */}
      {profile?.user_category === 'professor' && (
          <div className="mb-6">
              <GeradorCodigo />
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Widget icon={<FiUsers />} title="Total de Alunos" value="1,250" color="text-primary bg-primary/20" />
        <Widget icon={<FiClipboard />} title="Média da Turma" value="8.5" color="text-secondary bg-secondary/20" />
        <Widget icon={<FiCheckCircle />} title="Atividades Concluídas" value="78%" color="text-blue-500 bg-blue-500/20" />
      </div>

       <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Personalizar Layout</h2>
            <p className="text-gray-600 dark:text-gray-300">
                Em breve, você poderá arrastar e soltar os widgets para organizar seu dashboard da maneira que preferir.
            </p>
       </div>
    </div>
  );
};

export default Dashboard;