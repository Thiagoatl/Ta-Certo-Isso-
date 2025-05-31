import React, { useEffect } from 'react';
// No need to import VirtualKeyboard here, it's rendered conditionally in App.js or handled by parent

function AccessibilitySettings({
  navigateTo,
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast,
  showVirtualKeyboard,
  toggleVirtualKeyboard,
  // New props for screen reader
  speakText,
  isScreenReaderEnabled,
  setIsScreenReaderEnabled // This is passed from App.js to control the global state
}) {
  // Announce screen title when component mounts
  useEffect(() => {
    if (isScreenReaderEnabled) {
      speakText("Configurações de Acessibilidade.");
    }
  }, [isScreenReaderEnabled, speakText]); // Depend on isScreenReaderEnabled and speakText

  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setFontSize(newSize);
    if (isScreenReaderEnabled) {
      speakText(`Tamanho da fonte alterado para ${newSize} pixels.`);
    }
  };

  const handleHighContrastToggle = () => {
    const newState = !highContrast;
    setHighContrast(newState);
    if (isScreenReaderEnabled) {
      speakText(`Modo de alto contraste ${newState ? 'ativado' : 'desativado'}.`);
    }
  };

  const handleVirtualKeyboardToggle = () => {
    const newState = !showVirtualKeyboard;
    toggleVirtualKeyboard(); // This function already toggles the state in App.js
    if (isScreenReaderEnabled) {
      speakText(`Teclado virtual ${newState ? 'ativado' : 'desativado'}.`);
    }
  };

  const handleScreenReaderToggle = () => {
    const newState = !isScreenReaderEnabled;
    setIsScreenReaderEnabled(newState); // Update the global state in App.js
    if (newState) {
      speakText("Leitor de tela ativado.");
    } else {
      speakText("Leitor de tela desativado."); // Speak before turning off
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-3xl font-bold text-blue-600">Configurações de Acessibilidade</h1>

      <div className={`w-full max-w-2xl p-6 border border-gray-300 rounded-lg shadow-lg space-y-6 ${highContrast ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Ajuste de Fonte */}
        <div>
          <label htmlFor="font-size" className={`block text-lg font-semibold mb-2 ${highContrast ? 'text-white' : 'text-blue-900'}`}>Tamanho da Fonte:</label>
          <input
            type="range"
            id="font-size"
            min="12"
            max="24"
            value={fontSize}
            onChange={handleFontSizeChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
            // Announce current value when focused (optional, can be verbose)
            // onFocus={() => isScreenReaderEnabled && speakText(`Tamanho da fonte atual: ${fontSize} pixels.`)}
          />
          <span className={`block text-right text-sm mt-1 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>{fontSize}px</span>
        </div>

        {/* Modo de Alto Contraste */}
        <div className="flex items-center justify-between">
          <span className={`text-lg font-semibold ${highContrast ? 'text-white' : 'text-blue-900'}`}>Modo de Alto Contraste:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={highContrast}
              onChange={handleHighContrastToggle} // Use the new handler
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Teclado Virtual */}
        <div className="flex items-center justify-between">
          <span className={`text-lg font-semibold ${highContrast ? 'text-white' : 'text-blue-900'}`}>Teclado Virtual:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showVirtualKeyboard}
              onChange={handleVirtualKeyboardToggle} // Use the new handler
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Leitor de Tela (Screen Reader) - NEW SECTION */}
        <div className="flex items-center justify-between">
          <span className={`text-lg font-semibold ${highContrast ? 'text-white' : 'text-blue-900'}`}>Leitor de Tela:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isScreenReaderEnabled}
              onChange={handleScreenReaderToggle} // New handler for screen reader
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

      </div>

      <button
        onClick={() => {
          navigateTo('dashboard');
          if (isScreenReaderEnabled) {
            speakText("Voltando ao painel.");
          }
        }}
        className={`mt-6 p-3 rounded-md hover:bg-gray-400 transition duration-300 shadow-md ${highContrast ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-300 text-gray-800'}`}
      >
        Voltar ao Painel
      </button>

      {/* VirtualKeyboard is rendered in App.js now based on showVirtualKeyboard state from App.js */}
    </div>
  );
}

export default AccessibilitySettings;