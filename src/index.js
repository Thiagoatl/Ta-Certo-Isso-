import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importa o CSS global (com Tailwind)
import App from './App'; // Importa o componente principal da aplicação
import reportWebVitals from './reportWebVitals'; // Para monitorar performance (pode remover se não for usar)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Se você quiser começar a medir o desempenho em seu aplicativo,
// passe uma função para registrar os resultados (por exemplo: reportWebVitals(console.log))
// ou envie para um endpoint de análise. Saiba mais: https://bit.ly/CRA-vitals
reportWebVitals();
