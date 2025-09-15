import React from 'react';
import { GameScreens, useAppState } from '../../hooks/useAppState';
import Ingame from '../ingame';
import MainMenu from '../mainmenu';
import Leaderboard from '../leaderboard';
import { LeaderboardAPI } from '../../../shared/types/leaderboard';
import Achievements from '../achievements';

const NavigationManager = () => {
  const { isReady, screen } = useAppState();
  if (!isReady) return null;
  if (screen === GameScreens.INGAME) return <Ingame />;
  else if (screen === GameScreens.MAIN) return <MainMenu />;
  else if (screen === GameScreens.LEADERBOARDS) return <Leaderboard />;
  else if (screen === GameScreens.ACHIEVEMENTS) return <Achievements />;
  return <MainMenu />;
};

export default NavigationManager;
