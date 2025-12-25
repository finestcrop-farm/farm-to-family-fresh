import React from 'react';
import { useApp } from '@/contexts/AppContext';
import Onboarding from './Onboarding';
import Home from './Home';

const Index: React.FC = () => {
  const { onboardingCompleted } = useApp();

  if (!onboardingCompleted) {
    return <Onboarding />;
  }

  return <Home />;
};

export default Index;
