import React from 'react';
import { Book, Activity, BarChart2, Settings, LogOut, Users, Info, Paperclip, BookOpen, Pencil } from 'lucide-react'; // Importa os ícones
import DashboardCard from './DashboardCard'; // Importa o componente do card

function DashboardScreen({ userRole, navigateTo, onLogout }) {
  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="text-4xl font-bold text-blue-800">Painel de Controle</h1>
      <p className="text-xl text-blue-800">Bem-vindo, {userRole === 'aluno' ? 'Aluno' : 'Professor'}!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-3xl">
        {userRole === 'aluno' && (
          <>
            <DashboardCard icon={<Book size={40} />} title="Audiolivros" onClick={() => navigateTo('audiobooks')} />
            <DashboardCard icon={<Activity size={40} />} title="Atividades" onClick={() => navigateTo('activities')} />
            <DashboardCard icon={<Pencil size={40} />} title="Redação" onClick={() => navigateTo('redacao')} />
            <DashboardCard icon={<BarChart2 size={40} />} title="Progresso" onClick={() => navigateTo('progress')} />
          </>
        )}
        {userRole === 'professor' && (
          <>
            <DashboardCard icon={<Users size={40} />} title="Acompanhamento de Alunos" onClick={() => navigateTo('progress')} />
            {/* Adicione outras funcionalidades para professor aqui, se necessário */}
          </>
        )}

        <DashboardCard icon={<Settings size={40} />} title="Acessibilidade" onClick={() => navigateTo('accessibility')} />
        <DashboardCard icon={<LogOut size={40} />} title="Sair" onClick={onLogout} isLogout />
      </div>
    </div>
  );
}

export default DashboardScreen;