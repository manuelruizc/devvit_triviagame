import { AppStateProvider } from './hooks/useAppState';
import Root from './components/root';
import StartupScreen from './components/startupscreen';
import NavigationManager from './components/navigationmanager';
// import { useCounter } from './hooks/useCounter';

export const App = () => {
  return (
    <AppStateProvider>
      <Root>
        <NavigationManager />
        <StartupScreen />
      </Root>
      {/* <footer className="bottom-4 left-1/2 -translate-x-1/2 flex gap-3 text-[0.8em] text-gray-600">
        <button
        className="cursor-pointer"
        onClick={() => navigateTo('https://developers.reddit.com/docs')}
        >
        Docs
        </button>
        <span className="text-gray-300">|</span>
        <button
        className="cursor-pointer"
        onClick={() => navigateTo('https://www.reddit.com/r/Devvit')}
        >
        r/Devvit
        </button>
        <span className="text-gray-300">|</span>
        <button
        className="cursor-pointer"
        onClick={() => navigateTo('https://discord.com/invite/R7yu2wh9Qz')}
        >
        Discord
        </button>
        </footer> */}
    </AppStateProvider>
  );
};
