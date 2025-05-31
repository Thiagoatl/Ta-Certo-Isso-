import React from 'react';

const DashboardCard = ({ icon, title, onClick, isLogout = false }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105
      ${isLogout
        ? 'bg-red-500 text-white hover:bg-red-600' // O botão de logout permanece vermelho
        : 'bg-blue-600 text-white hover:bg-blue-900' // Alterado para azul
      }`}
  >
    {icon}
    <span className="mt-4 text-xl font-semibold">{title}</span>
  </button>
);

export default DashboardCard;