import React, { useState, useEffect, useRef } from 'react'; // Adicionado useRef

function AudiobookScreen({ navigateTo, fontSize }) {
  const audiobooks = [
    { id: 1, title: 'Dom Casmurro (Cap. 1)', author: 'Machado de Assis', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', text: 'Capítulo Primeiro: Alguma prosa. Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem um compatriota, que conhecia de vista e de chapéu. Cumprimentei-o. Ele respondeu-me e perguntou-me se eu tinha lido o livro de um tal Palha, que era o nosso vizinho, e que eu não conhecia. Respondi que não. Ele insistiu, dizendo que era um livro muito bom, e que eu devia lê-lo. Disse-lhe que o faria.' },
    { id: 2, title: 'O Cortiço (Cap. 1)', author: 'Aluísio Azevedo', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', text: 'Da porta da taverna, onde se vendiam mantimentos, via-se o cortiço, que se estendia por uma grande área, com suas casas de taipa e telhados de sapê. Era uma aglomeração de gente, de todas as cores e de todas as idades, vivendo em promiscuidade, sem higiene, sem conforto, sem moral. O cheiro de cachaça, de fumo, de fritura, de suor, de miséria, era insuportável.' },
    { id: 3, title: 'A Hora da Estrela', author: 'Clarice Lispector', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', text: 'Tudo no mundo começou com um sim. Uma molécula disse sim a outra molécula e a vida nasceu. Mas antes da pré-história havia a pré-história da pré-história e havia o nunca. Sim, no princípio era o nunca. E foi o sim que deu origem ao mundo. E o sim que deu origem ao mundo é o sim da vida. E o sim da vida é o sim do amor. E o sim do amor é o sim da morte. E o sim da morte é o sim da vida.' },
  ];

  const [selectedAudiobook, setSelectedAudiobook] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null); // Usando useRef

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, selectedAudiobook]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAudiobookSelect = (audiobook) => {
    setSelectedAudiobook(audiobook);
    setIsPlaying(false); // Pausa ao trocar de audiolivro
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-3xl font-bold text-blue-600">Audiolivros</h1>
      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Selecione um Audiolivro:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {audiobooks.map((book) => (
            <button
              key={book.id}
              onClick={() => handleAudiobookSelect(book)}
              className={`p-4 rounded-md shadow-md transition duration-300 ${
                selectedAudiobook?.id === book.id ? 'bg-blue-200 border-2 border-blue-500' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <h3 className="font-semibold text-lg">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
            </button>
          ))}
        </div>

        {selectedAudiobook && (
          <div className="mt-8 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">{selectedAudiobook.title}</h2>
            <p className="text-gray-600 mb-4">Autor: {selectedAudiobook.author}</p>

            <div className="flex items-center justify-center space-x-4 mb-6">
              <audio ref={audioRef} src={selectedAudiobook.audio} onEnded={() => setIsPlaying(false)} />
              <button
                onClick={handlePlayPause}
                className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition duration-300 shadow-md"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                )}
              </button>
            </div>

            <div className="border border-gray-200 p-4 rounded-md bg-gray-50 overflow-y-auto max-h-60" style={{ fontSize: `${fontSize}px` }}>
              <p className="whitespace-pre-wrap">{selectedAudiobook.text}</p>
            </div>
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

export default AudiobookScreen;