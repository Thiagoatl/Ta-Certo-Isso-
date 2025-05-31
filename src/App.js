import React, { useState, useEffect } from 'react';

import LoginScreen from './Components/LoginScreen';
import DashboardScreen from './Components/DashboardScreen';
import AudiobookScreen from './Components/AudiobookScreen';
import ActivitiesScreen from './Components/ActivitiesScreen';
import ProgressReportScreen from './Components/ProgressReportScreen';
import AccessibilitySettings from './Components/AccessibilitySettings';
import VirtualKeyboard from './Components/VirtualKeyboard';
import TextProductionFeedbackScreen from './Components/TextProductionFeedbackScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);

  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // To track if speech is ongoing


  const speakText = (text) => {
    if ('speechSynthesis' in window && isScreenReaderEnabled) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
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

  useEffect(() => {
    document.body.style.fontSize = `${fontSize}px`;
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [fontSize, highContrast]);


  useEffect(() => {
    let screenName = '';
    switch (currentScreen) {
      case 'login': screenName = 'Tela de Login'; break;
      case 'dashboard': screenName = 'Painel Principal'; break;
      case 'audiobooks': screenName = 'Tela de Audiolivros'; break;
      case 'activities': screenName = 'Tela de Atividades'; break;
      case 'progress': screenName = 'Relatório de Progresso'; break;
      case 'accessibility': screenName = 'Configurações de Acessibilidade'; break;
      case 'redacao': screenName = 'Produção de Texto e Feedback'; break;
      default: screenName = 'Tela desconhecida'; break;
    }
    if (isScreenReaderEnabled) {
      speakText(`Você está na ${screenName}.`);
    }
  }, [currentScreen, isScreenReaderEnabled]); 


  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentScreen('login');
    stopSpeaking(); 
  };

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
    stopSpeaking(); 
  };

  const toggleVirtualKeyboard = () => {
    setShowVirtualKeyboard(prev => !prev);
  };


  const renderScreen = () => {

    const commonProps = {
      navigateTo,
      fontSize,
      speakText,
      isScreenReaderEnabled,
      stopSpeaking
    };

    switch (currentScreen) {
      case 'login':
        return <LoginScreen {...commonProps} onLogin={handleLogin} toggleVirtualKeyboard={toggleVirtualKeyboard} />;
      case 'dashboard':
        return <DashboardScreen {...commonProps} userRole={userRole} onLogout={handleLogout} />;
      case 'audiobooks':
        return <AudiobookScreen {...commonProps} />;
      case 'activities':
        return <ActivitiesScreen {...commonProps} />;
      case 'progress':
        return <ProgressReportScreen {...commonProps} />;
      case 'accessibility':
        return (
          <AccessibilitySettings
            {...commonProps}
            setFontSize={setFontSize}
            highContrast={highContrast}
            setHighContrast={setHighContrast}
            showVirtualKeyboard={showVirtualKeyboard}
            toggleVirtualKeyboard={toggleVirtualKeyboard}
            setIsScreenReaderEnabled={setIsScreenReaderEnabled} // Pass setter for screen reader toggle
          />
        );
      case 'redacao':
        return <TextProductionFeedbackScreen {...commonProps} />;
      default:
        return <LoginScreen {...commonProps} onLogin={handleLogin} toggleVirtualKeyboard={toggleVirtualKeyboard} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-inter ${highContrast ? 'bg-gray-900 text-yellow-300' : 'bg-gray-100 text-gray-800'}`}>
      <div className={`w-full max-w-4xl bg-white p-8 rounded-lg shadow-xl ${highContrast ? 'border border-yellow-300' : ''}`}>
        {renderScreen()}
        {showVirtualKeyboard && (
          <VirtualKeyboard
            isVisible={showVirtualKeyboard}
            onClose={toggleVirtualKeyboard}
            speakText={speakText}
            isScreenReaderEnabled={isScreenReaderEnabled}
          />
        )}
      </div>
    </div>
  );
}

export default App;