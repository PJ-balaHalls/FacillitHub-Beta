// src/pages/Dashboard.js

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Ajuste o caminho se necessário
import { supabase } from '../services/supabaseClient'; // Ajuste o caminho se necessário
import { FaUserGraduate } from 'react-icons/fa'; // Ícone de exemplo

// --- Componente Reutilizável para o Card do Aluno ---
const StudentCard = ({ student }) => {
  const initials = student.full_name
    ? student.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)
    : '?';

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex items-center space-x-4 hover:shadow-xl hover:scale-105 transition-transform duration-200 cursor-pointer">
      <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
        {student.avatar_url ? (
          <img src={student.avatar_url} alt={student.full_name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{student.full_name || 'Nome não disponível'}</h3>
        <p className="text-gray-500 dark:text-gray-400">@{student.nickname || 'sem apelido'}</p>
      </div>
    </div>
  );
};

// --- Componente Principal do Dashboard ---
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Chamada RPC para a função que criamos no Supabase
        const { data, error: rpcError } = await supabase.rpc('get_students_by_teacher', {
          teacher_id_param: user.id // Passamos o ID do professor logado
        });

        if (rpcError) {
          throw rpcError;
        }

        setStudents(data || []);

      } catch (err) {
        console.error("Erro ao buscar alunos:", err);
        setError("Falha ao carregar os dados dos alunos. Por favor, tente recarregar a página.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user]); // Roda o efeito quando o 'user' é carregado ou muda

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-500">Carregando sua turma...</p>;
    }

    if (error) {
      return <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>;
    }

    if (students.length === 0) {
      return (
        <div className="text-center text-gray-500 p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FaUserGraduate className="mx-auto text-4xl mb-4" />
            <h3 className="text-xl font-semibold">Nenhum aluno encontrado</h3>
            <p>Parece que você ainda não tem alunos vinculados à sua conta.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {students.map(student => (
          <StudentCard key={student.student_id} student={student} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meu Painel</h1>
        <p className="text-gray-600 dark:text-gray-400">Gerencie sua turma e acompanhe o progresso de cada aluno.</p>
      </header>
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;