import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GraficoDesempenho = ({ data }) => {
  // Função para somar as notas de um bimestre
  const somarNotasBimestre = (bimestre) => {
    if (!bimestre) return 0;
    return Object.values(bimestre).reduce((acc, nota) => acc + nota, 0);
  };

  const chartData = [
    { name: 'Bimestre 1', nota: somarNotasBimestre(data.b1), max: 25 },
    { name: 'Bimestre 2', nota: somarNotasBimestre(data.b2), max: 25 },
    { name: 'Bimestre 3', nota: somarNotasBimestre(data.b3), max: 25 },
    { name: 'Bimestre 4', nota: somarNotasBimestre(data.b4), max: 25 },
  ];

  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 25]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="nota" name="Nota Total (de 25)" stroke="#1154D9" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

export default GraficoDesempenho;