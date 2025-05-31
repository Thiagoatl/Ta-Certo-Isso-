import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Importa o SDK do Gemini

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || ""; // Use uma variável de ambiente ou uma string vazia para teste
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function ActivitiesScreen({ navigateTo, fontSize }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]); // Array para armazenar as 5 perguntas
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const totalQuestions = 5; // Definindo o número total de perguntas

  // Função para gerar uma única pergunta usando o LLM
  const generateSingleQuestion = async () => {
    if (!API_KEY) {
      console.error("Chave de API do Gemini não configurada.");
      return null;
    }
    try {
      const prompt = "Gere uma nova pergunta de múltipla escolha sobre gramática da língua portuguesa para alunos do ensino fundamental/médio. Inclua 4 opções e indique a resposta correta. Formato: {'pergunta': '...', 'opcoes': ['...', '...', '...', '...'], 'resposta_correta': '...'}";
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              "pergunta": { "type": "STRING" },
              "opcoes": { "type": "ARRAY", "items": { "type": "STRING" } },
              "resposta_correta": { "type": "STRING" }
            },
            "propertyOrdering": ["pergunta", "opcoes", "resposta_correta"]
          }
        }
      });
      const jsonResponse = result.response.text();
      return JSON.parse(jsonResponse);
    } catch (error) {
      console.error("Erro ao chamar a API do Gemini para gerar pergunta:", error);
      return null;
    }
  };

  // Efeito para carregar as 5 perguntas na montagem do componente
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      const newQuestions = [];
      for (let i = 0; i < totalQuestions; i++) {
        const q = await generateSingleQuestion();
        if (q) {
          newQuestions.push(q);
        } else {
          // Se uma pergunta falhar, podemos decidir o que fazer (ex: tentar novamente ou mostrar erro)
          console.warn(`Falha ao carregar a pergunta ${i + 1}.`);
        }
      }
      setQuestions(newQuestions);
      setIsLoading(false);
      setQuizCompleted(false);
      setCurrentQuestionIndex(0); // Reseta para a primeira pergunta ao carregar
    };

    loadQuestions();
  }, []); // O array vazio garante que rode apenas uma vez na montagem

  // Pega a pergunta atual
  const currentQuestion = questions[currentQuestionIndex];

  // Função para verificar a resposta da múltipla escolha
  const handleSubmitQuiz = () => {
    if (selectedOption === null) {
      setFeedback("Por favor, selecione uma opção antes de verificar.");
      return;
    }

    if (selectedOption === currentQuestion.resposta_correta) {
      setFeedback('Correto! Muito bem!');
    } else {
      setFeedback(`Incorreto. A resposta correta é: ${currentQuestion.resposta_correta}`);
    }
  };

  // Função para avançar para a próxima pergunta ou finalizar o quiz
  const handleNextQuestion = () => {
    setFeedback(''); // Limpa feedback anterior
    setSelectedOption(null); // Limpa a opção selecionada
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizCompleted(true); // Finaliza o quiz
    }
  };

  // Função para iniciar um novo quiz (recarregar 5 novas perguntas)
  const startNewQuiz = async () => {
    setIsLoading(true);
    setQuestions([]); // Limpa as perguntas anteriores
    setCurrentQuestionIndex(0);
    setFeedback('');
    setSelectedOption(null);
    setQuizCompleted(false);

    const newQuestions = [];
    for (let i = 0; i < totalQuestions; i++) {
      const q = await generateSingleQuestion();
      if (q) {
        newQuestions.push(q);
      } else {
        console.warn(`Falha ao recarregar a pergunta ${i + 1}.`);
      }
    }
    setQuestions(newQuestions);
    setIsLoading(false);
  };

  if (isLoading && questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl text-gray-700">Carregando atividades...</p>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="flex flex-col items-center space-y-8">
        <h1 className="text-3xl font-bold text-blue-600">Atividades Concluídas!</h1>
        <p className="text-xl text-gray-700">Você completou todas as 5 perguntas.</p>
        <button
          onClick={startNewQuiz}
          className="bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition duration-300 shadow-md"
        >
          Fazer Novamente
        </button>
        <button
          onClick={() => navigateTo('dashboard')}
          className="bg-gray-300 text-gray-800 p-3 rounded-md hover:bg-gray-400 transition duration-300 shadow-md"
        >
          Voltar ao Painel
        </button>
      </div>
    );
  }

  // Renderiza a pergunta atual
  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="text-3xl font-bold text-blue-600">Atividades</h1>
      <p className="text-xl text-gray-700">Questão {currentQuestionIndex + 1} de {totalQuestions}</p>

      {currentQuestion ? (
        <div className="w-full max-w-2xl p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
          <h2 className="text-xl font-semibold mb-4" style={{ fontSize: `${fontSize}px` }}>Questão:</h2>
          <p className="mb-6" style={{ fontSize: `${fontSize}px` }}>{currentQuestion.pergunta}</p>
          <div className="space-y-3">
            {currentQuestion.opcoes.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="quiz-option"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => {
                    setSelectedOption(option);
                    setFeedback(''); // Limpa o feedback ao selecionar uma nova opção
                  }}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="text-lg" style={{ fontSize: `${fontSize}px` }}>{option}</span>
              </label>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handleSubmitQuiz}
              className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300 shadow-md"
              disabled={isLoading || selectedOption === null}
            >
              Verificar Resposta
            </button>
            <button
              onClick={handleNextQuestion}
              className="bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition duration-300 shadow-md"
              disabled={isLoading || selectedOption === null} // Só pode avançar se tiver selecionado algo
            >
              {currentQuestionIndex < totalQuestions - 1 ? 'Próxima Questão' : 'Finalizar Quiz'}
            </button>
          </div>
          {feedback && (
            <p className={`mt-4 text-lg font-semibold ${feedback.includes('Correto') ? 'text-green-600' : 'text-red-600'}`}>
              {feedback}
            </p>
          )}
        </div>
      ) : (
        <p className="text-xl text-gray-700">Não foi possível carregar as perguntas.</p>
      )}

      <button
        onClick={() => navigateTo('dashboard')}
        className="mt-6 bg-gray-300 text-gray-800 p-3 rounded-md hover:bg-gray-400 transition duration-300 shadow-md"
      >
        Voltar ao Painel
      </button>
    </div>
  );
}

export default ActivitiesScreen;