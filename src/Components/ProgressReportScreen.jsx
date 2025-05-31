import React from 'react';

function ProgressReportScreen({ navigateTo }) {
  const mockProgress = {
    audiobooksCompleted: 5,
    activitiesCompleted: 12,
    averageScore: 85,
    lastActivities: [
      { id: 1, name: 'Concordância Verbal', score: 90 },
      { id: 2, name: 'Interpretação de Texto', score: 80 },
      { id: 3, name: 'Classes de Palavras', score: 95 },
    ],
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-3xl font-bold text-blue-600">Relatório de Progresso</h1>

      <div className="w-full max-w-2xl p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <h2 className="text-xl font-semibold mb-4">Resumo Geral:</h2>
        <p className="text-lg mb-2">Audiolivros Concluídos: <span className="font-bold text-blue-600">{mockProgress.audiobooksCompleted}</span></p>
        <p className="text-lg mb-2">Atividades Concluídas: <span className="font-bold text-blue-600">{mockProgress.activitiesCompleted}</span></p>
        <p className="text-lg mb-4">Pontuação Média: <span className="font-bold text-green-600">{mockProgress.averageScore}%</span></p>

        <h2 className="text-xl font-semibold mt-6 mb-4">Últimas Atividades:</h2>
        <ul className="divide-y divide-gray-200">
          {mockProgress.lastActivities.map((activity) => (
            <li key={activity.id} className="py-3 flex justify-between items-center">
              <span className="text-lg">{activity.name}</span>
              <span className={`font-bold text-lg ${activity.score >= 70 ? 'text-green-600' : 'text-red-600'}`}>{activity.score}%</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => navigateTo('dashboard')}
        className="mt-6 bg-gray-300 text-gray-800 p-3 rounded-md hover:bg-gray-400 transition duration-300 shadow-md"
      >
        Voltar ao Painel
      </button>
    </div>
  );
}

export default ProgressReportScreen;