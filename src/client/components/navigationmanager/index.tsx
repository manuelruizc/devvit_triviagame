import { GameScreens, useAppState } from '../../hooks/useAppState';
import Ingame from '../ingame';
import MainMenu from '../mainmenu';
import Leaderboard from '../leaderboard';
import Achievements from '../achievements';
import UserProfile from '../userprofile';
import CreatePost from '../createpost';
import UCG from '../ugc';

const NavigationManager = () => {
  const { isReady, screen } = useAppState();
  if (!isReady) return null;
  if (screen === GameScreens.INGAME) return <Ingame />;
  else if (screen === GameScreens.MAIN) return <MainMenu />;
  else if (screen === GameScreens.LEADERBOARDS) return <Leaderboard />;
  else if (screen === GameScreens.ACHIEVEMENTS) return <Achievements />;
  else if (screen === GameScreens.USER_PROFILE) return <UserProfile />;
  else if (screen === GameScreens.CREATE_POST) return <CreatePost />;
  else if (screen === GameScreens.UCG) return <UCG />;
  return <MainMenu />;
};

export default NavigationManager;
