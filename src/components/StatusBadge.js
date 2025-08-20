import React from 'react';

const StatusBadge = ({ status }) => {
    const statusColor = {
        Aprovado: 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200',
        Recuperação: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200',
        Reprovado: 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200',
    };
    return (
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${statusColor[status]}`}>
            {status}
        </span>
    );
};

export default StatusBadge;