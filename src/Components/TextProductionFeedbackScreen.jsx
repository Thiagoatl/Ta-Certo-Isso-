import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Importa o SDK do Gemini

// Importe a API_KEY diretamente do process.env
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY; 

// A inicialização da API pode ser feita fora do componente ou dentro de um useEffect
// para evitar recriações desnecessárias, mas para este caso, o const é suficiente se a chave não muda.
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function TextProductionFeedbackScreen({ navigateTo, fontSize }) {
  const [textProduction, setTextProduction] = useState('');
  const [llmFeedback, setLlmFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Função para obter feedback da produção textual usando o LLM
  const getLlmFeedback = async () => {
    // Verificação da chave de API movida para o início da função
    if (!API_KEY) {
      setLlmFeedback("Erro: Chave de API do Gemini não configurada. Verifique seu arquivo .env.");
      return;
    }
    if (!textProduction.trim()) {
      setLlmFeedback("Por favor, escreva um texto antes de solicitar o feedback.");
      return;
    }

    setIsLoading(true);
    setLlmFeedback(''); // Limpa feedback anterior
    try {
      const prompt = `Analise o seguinte texto em português e forneça um feedback construtivo sobre gramática, ortografia, clareza e coerência. O texto é: "${textProduction}"`;
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      setLlmFeedback(responseText);
    } catch (error) {
      console.error("Erro ao chamar a API do Gemini para feedback:", error);
      setLlmFeedback("Erro ao obter feedback. Verifique sua chave de API ou conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="text-3xl font-bold text-blue-600">Produção Textual e Feedback</h1>

      <div className="w-full max-w-2xl p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <h2 className="text-xl font-semibold mb-4" style={{ fontSize: `${fontSize}px` }}>Sua Redação:</h2>
        <p className="mb-4 text-gray-700" style={{ fontSize: `${fontSize}px` }}>Escreva um pequeno parágrafo sobre o seu dia:</p>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[180px]"
          value={textProduction}
          onChange={(e) => setTextProduction(e.target.value)}
          style={{ fontSize: `${fontSize}px` }}
          placeholder="Comece a escrever seu texto aqui..."
        ></textarea>
        <button
          onClick={getLlmFeedback}
          className="mt-4 bg-purple-500 text-white p-3 rounded-md hover:bg-purple-600 transition duration-300 shadow-md"
          disabled={isLoading}
        >
          {isLoading ? 'Analisando...' : 'Obter Feedback'}
        </button>
        {llmFeedback && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">Feedback do Professor IA:</h3>
            <p className="text-blue-700 whitespace-pre-wrap" style={{ fontSize: `${fontSize}px` }}>{llmFeedback}</p>
          </div>
        )}
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


export default TextProductionFeedbackScreen;