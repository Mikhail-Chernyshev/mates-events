import React, { useState } from 'react';
import { View } from 'react-native';
import ForgotPasswordModal from './forgot-password';
import LoginScreen from './login';
import RegisterScreen from './register';

type AuthScreen = 'login' | 'register';

export default function AuthScreen() {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleNavigateToRegister = () => {
    setCurrentScreen('register');
  };

  const handleNavigateToLogin = () => {
    setCurrentScreen('login');
  };

  const handleShowForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  if (currentScreen === 'login') {
    return (
      <View style={{ flex: 1 }}>
        <LoginScreen
          onNavigateToRegister={handleNavigateToRegister}
          onShowForgotPassword={handleShowForgotPassword}
        />
        <ForgotPasswordModal
          visible={showForgotPassword}
          onClose={handleCloseForgotPassword}
        />
      </View>
    );
  }

  return <RegisterScreen onNavigateToLogin={handleNavigateToLogin} />;
}
