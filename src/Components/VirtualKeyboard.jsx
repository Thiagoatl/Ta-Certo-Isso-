import React, { useState, useRef, useEffect } from 'react';

function VirtualKeyboard({ isVisible, onClose }) {
  // Guardamos uma referência para o elemento que estava focado
  const lastActiveElementRef = useRef(null);
  // Estado para controlar se o SHIFT está ativo (maísculas/símbolos)
  const [isShiftActive, setIsShiftActive] = useState(false);

  // Monitora o foco em inputs/textareas para guardar a referência
  // Este useEffect continua importante para capturar o input/textarea inicial
  useEffect(() => {
    const handleFocusIn = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        lastActiveElementRef.current = event.target;
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  // Mapeamento de teclas para caracteres com e sem Shift
  // CHAVE: [Sem Shift, Com Shift]
  const keyMap = {
    '1': ['1', '!'], '2': ['2', '@'], '3': ['3', '#'], '4': ['4', '$'], '5': ['5', '%'],
    '6': ['6', '¨'], '7': ['7', '&'], '8': ['8', '*'], '9': ['9', '('], '0': ['0', ')'],
    '-': ['-', '_'], '=': ['=', '+'],
    '[': ['[', '{'], ']': [']', '}'], '\\': ['\\', '|'],
    ';': [';', ':'], "'": ["'", '"'], ',': [',', '<'], '.': ['.', '>'], '/': ['/', '?'],
    '`': ['`', '~'],
    // Você pode adicionar mais aqui, como:
    // 'ç': ['ç', 'Ç'],
    // '^': ['^', '~'], // Exemplo para o til em alguns layouts
  };

  const handleKeyPress = (key) => {
    const activeElement = lastActiveElementRef.current; // Usamos a referência guardada
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      const value = activeElement.value;

      let charToInsert = key;

      // Lógica para letras (A-Z)
      if (key.length === 1 && key.match(/[a-z]/i)) {
        charToInsert = isShiftActive ? key.toUpperCase() : key.toLowerCase();
      }
      // Lógica para números e pontuações/símbolos mapeados
      else if (keyMap[key]) {
        charToInsert = isShiftActive ? keyMap[key][1] : keyMap[key][0];
      }

      activeElement.value = value.substring(0, start) + charToInsert + value.substring(end);
      activeElement.selectionStart = activeElement.selectionEnd = start + charToInsert.length;

      // Não precisamos mais do activeElement.focus() aqui
      // porque o onMouseDown={e => e.preventDefault()} já impede a perda de foco.

      // Disparar evento de input para que React detecte a mudança
      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);

      // Desliga o shift automaticamente após uma letra ou símbolo ser digitado
      if (isShiftActive && key.length === 1 && key !== 'shift') {
        setIsShiftActive(false);
      }
    }
  };

  const handleDelete = () => {
    const activeElement = lastActiveElementRef.current; // Usamos a referência guardada
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      const value = activeElement.value;
      if (start === end && start > 0) {
        activeElement.value = value.substring(0, start - 1) + value.substring(end);
        activeElement.selectionStart = activeElement.selectionEnd = start - 1;
      } else if (start !== end) {
        activeElement.value = value.substring(0, start) + value.substring(end);
        activeElement.selectionStart = activeElement.selectionEnd = start;
      }
      // Não precisamos mais do activeElement.focus() aqui
      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);
    }
  };

  const handleSpace = () => handleKeyPress(' ');
  const handleShift = () => setIsShiftActive(prev => !prev);

  // Mapeamento das teclas no layout do teclado
  const keys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
    // Você pode adicionar uma linha para símbolos menos comuns ou apenas para demonstração
    // ['`'], // Para o botão de crase/til
  ];

  if (!isVisible) {
    return null;
  }

  // Função auxiliar para obter o caractere a ser exibido no botão
  const getDisplayChar = (key) => {
    if (key.length === 1 && key.match(/[a-z]/i)) {
      return isShiftActive ? key.toUpperCase() : key.toLowerCase();
    }
    if (keyMap[key]) {
      return isShiftActive ? keyMap[key][1] : keyMap[key][0];
    }
    return key;
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 p-4 rounded-lg shadow-xl z-50">
      <div className="absolute top-2 right-2">
        <button
          onClick={onClose}
          // Adiciona onMouseDown para impedir a perda de foco ao clicar no "X"
          onMouseDown={e => e.preventDefault()}
          className="bg-gray-600 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-gray-700 transition duration-150"
          aria-label="Fechar teclado"
        >
          X
        </button>
      </div>
      <div className="flex flex-col space-y-2">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-2">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                // **CORREÇÃO AQUI:** Adiciona onMouseDown para evitar a perda de foco
                onMouseDown={e => e.preventDefault()}
                className={`
                  bg-gray-600 text-white p-3 rounded-md
                  w-10 h-10 flex items-center justify-center text-lg
                  hover:bg-gray-700 transition duration-150
                  ${isShiftActive && (key.match(/[a-z]/i) || keyMap[key]) ? 'font-bold' : ''}
                `}
              >
                {getDisplayChar(key)}
              </button>
            ))}
          </div>
        ))}
        <div className="flex justify-center space-x-2 mt-2">
          {/* Botão Shift */}
          <button
            onClick={handleShift}
            // Adiciona onMouseDown para evitar a perda de foco
            onMouseDown={e => e.preventDefault()}
            className={`
              bg-gray-600 text-white p-3 rounded-md
              w-20 flex items-center justify-center hover:bg-gray-700 transition duration-150
              ${isShiftActive ? 'bg-blue-500 hover:bg-blue-600' : ''}
            `}
          >
            Shift
          </button>
          <button
            onClick={handleSpace}
            // Adiciona onMouseDown para evitar a perda de foco
            onMouseDown={e => e.preventDefault()}
            className="bg-gray-600 text-white p-3 rounded-md flex-1 hover:bg-gray-700 transition duration-150"
          >
            Espaço
          </button>
          <button
            onClick={handleDelete}
            // Adiciona onMouseDown para evitar a perda de foco
            onMouseDown={e => e.preventDefault()}
            className="bg-red-500 text-white p-3 rounded-md w-24 flex items-center justify-center hover:bg-red-600 transition duration-150"
          >
            Apagar
          </button>
        </div>
      </div>
    </div>
  );
}

export default VirtualKeyboard;