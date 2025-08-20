// src/pages/Dashboard.js

import React, { useState, useEffect, useContext } from 'react';
// 1. O 'profile' e o 'loading' do AuthContext agora são importados.
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { FaUserGraduate } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// --- Componente Reutilizável para o Card do Aluno ---
const StudentCard = ({ student, onClick }) => {
  const initials = student.full_name
    ? student.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex items-center space-x-4 hover:shadow-xl hover:scale-105 transition-transform duration-200 cursor-pointer"
    >
      <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
        {student.avatar_url ? (
          <img src={student.avatar_url} alt={student.full_name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{student.full_name || 'Nome não disponível'}</h3>
        <p className="text-gray-500 dark:text-gray-400 truncate">@{student.nickname || 'sem apelido'}</p>
      </div>
    </div>
  );
};

// --- Componente Principal do Dashboard ---
const Dashboard = () => {
  // 2. Pegamos 'user', 'profile' e 'loading' (renomeado para authLoading) do contexto.
  const { user, profile, loading: authLoading } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      // A busca só inicia se o usuário (user) e o perfil (profile) estiverem carregados.
      if (!user || !profile) {
        // Se a autenticação já terminou e não temos usuário, paramos o carregamento.
        if (!authLoading) {
            setLoadingStudents(false);
        }
        return;
      }

      try {
        setLoadingStudents(true);
        setError(null);

        const { data, error: rpcError } = await supabase.rpc('get_students_by_teacher', {
          teacher_id_param: user.id
        });

        if (rpcError) throw rpcError;

        setStudents(data || []);

      } catch (err) {
        console.error("Erro ao buscar alunos:", err);
        setError("Falha ao carregar os dados dos alunos.");
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [user, profile, authLoading]); // O efeito depende de user, profile e authLoading.

  const handleStudentClick = (studentId) => {
    navigate(`/ficha-aluno/${studentId}`);
  };
  
  // 3. Enquanto o AuthContext estiver carregando a sessão, exibimos uma mensagem.
  if (authLoading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
            <p className="text-gray-500">Carregando sessão...</p>
        </div>
    );
  }

  const renderContent = () => {
    if (loadingStudents) {
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
            <p>Use o gerenciador de convites para pré-cadastrar seus alunos.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {students.map(student => (
          <StudentCard key={student.student_id} student={student} onClick={() => handleStudentClick(student.student_id)} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <header className="mb-8">
        {/* 4. CORREÇÃO PRINCIPAL: Usamos 'profile.full_name' e verificamos se 'profile' existe. */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bem-vindo(a), {profile ? profile.full_name : 'Professor(a)'}!</h1>
        <p className="text-gray-600 dark:text-gray-400">Gerencie sua turma e acompanhe o progresso de cada aluno.</p>
      </header>
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;