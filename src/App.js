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

  useEffect(() => {
    document.body.style.fontSize = `${fontSize}px`;
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [fontSize, highContrast]);

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentScreen('login');
  };

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  // This function toggles the virtual keyboard visibility
  const toggleVirtualKeyboard = () => {
    setShowVirtualKeyboard(prev => !prev);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        // Pass the toggleVirtualKeyboard function
        return <LoginScreen onLogin={handleLogin} toggleVirtualKeyboard={toggleVirtualKeyboard} />;
      case 'dashboard':
        return <DashboardScreen userRole={userRole} navigateTo={navigateTo} onLogout={handleLogout} />;
      case 'audiobooks':
        return <AudiobookScreen navigateTo={navigateTo} fontSize={fontSize} />;
      case 'activities':
        return <ActivitiesScreen navigateTo={navigateTo} fontSize={fontSize} />;
      case 'progress':
        return <ProgressReportScreen navigateTo={navigateTo} />;
      case 'accessibility':
        return (
          <AccessibilitySettings
            navigateTo={navigateTo}
            fontSize={fontSize}
            setFontSize={setFontSize}
            highContrast={highContrast}
            setHighContrast={setHighContrast}
            showVirtualKeyboard={showVirtualKeyboard}
            toggleVirtualKeyboard={toggleVirtualKeyboard} // Pass the toggle function
          />
        );
      case 'redacao':
        return <TextProductionFeedbackScreen navigateTo={navigateTo} fontSize={fontSize} />;
      default:
        // Default to login screen, also passing the toggle function
        return <LoginScreen onLogin={handleLogin} toggleVirtualKeyboard={toggleVirtualKeyboard} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-inter ${highContrast ? 'bg-gray-900 text-yellow-300' : 'bg-gray-100 text-gray-800'}`}>
      <div className={`w-full max-w-4xl bg-white p-8 rounded-lg shadow-xl ${highContrast ? 'border border-yellow-300' : ''}`}>
        {renderScreen()}
        {/* Pass isVisible and onClose props to VirtualKeyboard */}
        {showVirtualKeyboard && (
          <VirtualKeyboard
            isVisible={showVirtualKeyboard}
            onClose={toggleVirtualKeyboard}
          />
        )}
      </div>
    </div>
  );
}

export default App;