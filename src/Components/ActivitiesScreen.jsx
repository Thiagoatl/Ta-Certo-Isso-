import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// IMPORTANT: Replace with your actual API Key or ensure REACT_APP_GEMINI_API_KEY is set in your .env file
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// List of grammatical topics to help generate diverse questions
const GRAMMAR_TOPICS = [
  "concordância verbal",
  "regência nominal",
  "acentuação gráfica",
  "crase",
  "colocação pronominal",
  "uso da vírgula",
  "ortografia de advérbios",
  "classes de palavras (substantivo, verbo, adjetivo, etc.)",
  "vozes verbais (ativa, passiva)",
  "funções sintáticas (sujeito, objeto, adjunto, etc.)",
  "interjeição e conjunção",
  "flexão de gênero e número",
  "tempos e modos verbais",
  "prefixos e sufixos",
  "polissemia e ambiguidade"
];

function ActivitiesScreen({ navigateTo, fontSize }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  // New state to track which topics have been used in the current quiz session
  const [usedTopicsInSession, setUsedTopicsInSession] = useState(new Set());

  const totalQuestions = 5;

  // This should be defined early so useEffects can access it
  const currentQuestion = questions[currentQuestionIndex];

  // Function to generate a single question using the LLM
  const generateSingleQuestion = async () => {
    if (!API_KEY) {
      console.error("Chave de API do Gemini não configurada. Por favor, verifique sua variável de ambiente.");
      return null;
    }
    try {
      // Filter out topics already used in this session to encourage variety
      let availableTopics = GRAMMAR_TOPICS.filter(topic => !usedTopicsInSession.has(topic));

      // If all topics have been used, reset the set for the next batch of questions
      // This ensures that a new set of distinct topics can be chosen if the user starts a new quiz
      if (availableTopics.length === 0) {
        setUsedTopicsInSession(new Set());
        availableTopics = GRAMMAR_TOPICS; // Reset available topics to all
      }

      // Randomly select a topic from the available ones
      const randomTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];

      const prompt = `Gere uma nova pergunta de múltipla escolha sobre "${randomTopic}" na gramática da língua portuguesa para alunos do ensino fundamental/médio. Inclua 4 opções e indique a resposta correta. Formato: {'pergunta': '...', 'opcoes': ['...', '...', '...', '...'], 'resposta_correta': '...'}`;

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
      const newQuestion = JSON.parse(jsonResponse);

      // Add the chosen topic to the set of used topics for the current session
      setUsedTopicsInSession(prev => new Set(prev).add(randomTopic));

      return newQuestion;
    } catch (error) {
      console.error("Erro ao chamar a API do Gemini para gerar pergunta:", error);
      // Fallback for API errors: you could return a predefined basic question
      return {
        pergunta: "Houve um erro ao carregar a pergunta. Qual a capital do Brasil?",
        opcoes: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
        resposta_correta: "Brasília"
      };
    }
  };

  // Effect to load the 5 questions when the component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      const newQuestions = [];
      for (let i = 0; i < totalQuestions; i++) {
        const q = await generateSingleQuestion();
        if (q) {
          newQuestions.push(q);
        } else {
          console.warn(`Falha ao carregar a pergunta ${i + 1}. Usando uma pergunta padrão.`);
          // Add a fallback question if API fails
          newQuestions.push({
            pergunta: `Questão ${i + 1}: Qual o plural de "pão"?`,
            opcoes: ["pãos", "pães", "panos", "pãeses"],
            resposta_correta: "pães"
          });
        }
      }
      setQuestions(newQuestions);
      setIsLoading(false);
      setQuizCompleted(false);
      setCurrentQuestionIndex(0); // Reset to the first question on load
      setUserAnswers([]); // Clear user answers
      setCorrectAnswersCount(0); // Reset correct answers count
      setUsedTopicsInSession(new Set()); // Reset used topics for a fresh quiz
    };

    loadQuestions();
  }, []); // The empty array ensures this runs only once on mount

  // --- Text-to-Speech Functionality ---
  const speakText = (text) => {
    if ('speechSynthesis' in window && isScreenReaderEnabled) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech before starting a new one
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR'; // Set language to Portuguese (Brazil)
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Effect to speak the question when currentQuestion changes (if enabled)
  useEffect(() => {
    if (isScreenReaderEnabled && currentQuestion && !isLoading && !quizCompleted) {
      speakText(`Questão ${currentQuestionIndex + 1}: ${currentQuestion.pergunta}. Opções: ${currentQuestion.opcoes.join(', ')}.`);
    }
    // Cleanup function to stop speech if the component unmounts or state changes relevance
    return () => {
      stopSpeaking();
    };
  }, [currentQuestion, currentQuestionIndex, isScreenReaderEnabled, isLoading, quizCompleted]);

  // Effect to speak feedback when it appears
  useEffect(() => {
    if (isScreenReaderEnabled && feedback) {
      speakText(feedback);
    }
  }, [feedback, isScreenReaderEnabled]);

  // Effect to speak completion message
  useEffect(() => {
    if (isScreenReaderEnabled && quizCompleted) {
      speakText(`Quiz completo! Você acertou ${correctAnswersCount} de ${totalQuestions} perguntas!`);
    }
  }, [quizCompleted, correctAnswersCount, totalQuestions, isScreenReaderEnabled]);

  // --- End Text-to-Speech Functionality ---

  // Function to advance to the next question or finish the quiz
  const handleNextQuestion = () => {
    if (selectedOption === null) {
      setFeedback("Por favor, selecione uma opção antes de continuar.");
      return;
    }

    const isCorrect = selectedOption === currentQuestion.resposta_correta;
    const newFeedback = isCorrect ? 'Correto! Muito bem!' : `Incorreto. A resposta correta é: ${currentQuestion.resposta_correta}`;
    setFeedback(newFeedback);

    // Store the user's answer for review
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = {
      question: currentQuestion.pergunta,
      userSelection: selectedOption,
      correctAnswer: currentQuestion.resposta_correta,
      isCorrect: isCorrect,
      options: currentQuestion.opcoes // Added for complete review
    };
    setUserAnswers(updatedUserAnswers);

    // Count correct answers
    if (isCorrect) {
      setCorrectAnswersCount(prevCount => prevCount + 1);
    }

    // Use a setTimeout to give the user time to see the feedback before advancing
    setTimeout(() => {
      setFeedback(''); // Clear previous feedback
      setSelectedOption(null); // Clear selected option
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        setQuizCompleted(true); // Finalize the quiz
      }
    }, 1500); // 1.5 seconds feedback time
  };

  // Function to start a new quiz (reload 5 new questions)
  const startNewQuiz = async () => {
    setIsLoading(true);
    setQuestions([]); // Clear previous questions
    setCurrentQuestionIndex(0);
    setFeedback('');
    setSelectedOption(null);
    setQuizCompleted(false);
    setUserAnswers([]); // Clear user answers
    setCorrectAnswersCount(0); // Reset correct answers count
    setUsedTopicsInSession(new Set()); // Reset used topics for a fresh quiz
    stopSpeaking(); // Stop any ongoing speech

    const newQuestions = [];
    for (let i = 0; i < totalQuestions; i++) {
      const q = await generateSingleQuestion();
      if (q) {
        newQuestions.push(q);
      } else {
        console.warn(`Falha ao recarregar a pergunta ${i + 1}. Usando uma pergunta padrão.`);
        newQuestions.push({
          pergunta: `Questão ${i + 1}: Qual o plural de "mesa"?`,
          opcoes: ["mesas", "mese", "mesos", "mesas"],
          resposta_correta: "mesas"
        });
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

  // Render block for the final review screen
  if (quizCompleted) {
    return (
      <div className="flex flex-col items-center space-y-8 p-4">
        <h1 className="text-3xl font-bold text-blue-600">Revisão das Atividades</h1>
        <p className="text-xl text-gray-700">Você acertou {correctAnswersCount} de {totalQuestions} perguntas!</p>

        <div className="w-full max-w-3xl space-y-8">
          {userAnswers.map((item, index) => (
            <div key={index} className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
              <h2 className="text-xl font-semibold mb-3">Questão {index + 1}:</h2>
              <p className="mb-4">{item.question}</p>
              <div className="space-y-2">
                {item.options.map((option, optIndex) => (
                  <p
                    key={optIndex}
                    className={`p-2 rounded-md ${
                      option === item.correctAnswer ? 'bg-green-100 font-bold' :
                      option === item.userSelection && !item.isCorrect ? 'bg-red-100' :
                      ''
                    }`}
                  >
                    {option}
                    {option === item.correctAnswer && <span className="ml-2 text-green-700">(Correta)</span>}
                    {option === item.userSelection && !item.isCorrect && <span className="ml-2 text-red-700">(Sua resposta)</span>}
                  </p>
                ))}
              </div>
              <p className={`mt-4 font-semibold ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                Sua resposta: <span className="font-normal">{item.userSelection}</span>
                {item.isCorrect ? ' (Correto)' : ' (Incorreto)'}
              </p>
              {!item.isCorrect && (
                <p className="mt-2 text-gray-600">
                  Resposta correta: <span className="font-normal">{item.correctAnswer}</span>
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex space-x-4 mt-8">
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
      </div>
    );
  }

  // Render the current question
  return (
    <div className="flex flex-col items-center space-y-8 p-4">
      <h1 className="text-3xl font-bold text-blue-600">Atividades</h1>
      <p className="text-xl text-gray-700">Questão {currentQuestionIndex + 1} de {totalQuestions}</p>

      {/* Screen Reader Toggle */}
      <div className="flex items-center space-x-2 my-4">
        <label htmlFor="screen-reader-toggle" className="text-lg text-gray-700 font-semibold">Ativar Leitor de Tela:</label>
        <input
          type="checkbox"
          id="screen-reader-toggle"
          checked={isScreenReaderEnabled}
          onChange={(e) => {
            setIsScreenReaderEnabled(e.target.checked);
            // If turning off, stop any ongoing speech
            if (!e.target.checked) {
              stopSpeaking();
            }
          }}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="ml-4 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300 shadow-sm"
          >
            Parar Leitor
          </button>
        )}
      </div>

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
                    setFeedback(''); // Clear feedback when a new option is selected
                  }}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="text-lg" style={{ fontSize: `${fontSize}px` }}>{option}</span>
              </label>
            ))}
          </div>
          <div className="mt-6 flex justify-end items-center">
            <button
              onClick={handleNextQuestion}
              className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300 shadow-md"
              disabled={isLoading || selectedOption === null}
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