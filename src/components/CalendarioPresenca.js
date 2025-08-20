import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importa o estilo padrão

const CalendarioPresenca = ({ diasDeFalta = [] }) => {
  // Converte as strings de data em objetos Date para comparação
  const datasFalta = diasDeFalta.map(dateStr => new Date(dateStr));

  // Função para adicionar classe CSS aos dias de falta
  const tileClassName = ({ date, view }) => {
    // Apenas aplica na visão de "mês"
    if (view === 'month') {
      // Verifica se a data atual está na lista de faltas
      if (datasFalta.some(faltaDate => faltaDate.toDateString() === date.toDateString())) {
        return 'bg-red-200 text-red-800 rounded-full';
      }
    }
    return null;
  };

  return (
    <div>
      <style>
        {`
          .react-calendar { border-radius: 0.5rem; border: 1px solid #e5e7eb; }
          .react-calendar__tile--now { background: #e5e7eb; }
          .react-calendar__tile--active { background: #1154D9; color: white; }
        `}
      </style>
      <Calendar
        tileClassName={tileClassName}
        className="w-full"
      />
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 rounded-full"></div>
            <span>Falta</span>
        </div>
        {/* Adicionar outras legendas se necessário, ex: Falta Justificada */}
      </div>
    </div>
  );
};

export default CalendarioPresenca;