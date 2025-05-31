import React, { useState } from 'react';
import { User, Users, Keyboard } from 'lucide-react'; // Importa os ícones

function LoginScreen({ onLogin, toggleVirtualKeyboard }) { // Recebe toggleVirtualKeyboard
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = (role) => {
    if (username && password) {
      onLogin(role);
    } else {
      console.log('Por favor, preencha usuário e senha.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Bem-vindo!</h1>
      <div className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Usuário"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => handleLoginClick('aluno')}
            className="flex-1 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center space-x-2 shadow-md"
          >
            <User size={20} />
            <span>Entrar como Aluno</span>
          </button>
          <button
            onClick={() => handleLoginClick('professor')}
            className="flex-1 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center space-x-2 shadow-md"
          >
            <Users size={20} />
            <span>Entrar como Professor</span>
          </button>
        </div>
        <button
          onClick={toggleVirtualKeyboard} // Chama a função toggleVirtualKeyboard
          className="w-full bg-gray-300 text-gray-800 p-3 rounded-md hover:bg-gray-400 transition duration-300 flex items-center justify-center space-x-2 shadow-md"
        >
          <Keyboard size={20} />
          <span>Teclado Virtual</span>
        </button>
      </div>
    </div>
  );
}

export default LoginScreen;