import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import Onboarding from './Onboarding';
import Home from './Home';
import Login from './Login';

const Index: React.FC = () => {
  const { onboardingCompleted } = useApp();
  const { user, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <Login />;
  }

  // Show onboarding if not completed
  if (!onboardingCompleted) {
    return <Onboarding />;
  }

  return <Home />;
};

export default Index;
