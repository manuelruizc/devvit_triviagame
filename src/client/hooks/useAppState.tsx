import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BasicAPI } from '../../shared/types/basic';
import { useAPI } from './useAPI';

export enum GameScreens {
  MAIN = 'main',
  INGAME = 'ingame',
  LEADERBOARDS = 'leaderboards',
}

interface AppStateNotReady {
  isReady: false;
  data: null;
  screen: GameScreens;
  navigate: (screen: GameScreens) => void;
}

interface AppStateReady {
  isReady: true;
  data: BasicAPI.GetUserBasicData;
  screen: GameScreens;
  navigate: (screen: GameScreens) => void;
}

type AppState = AppStateNotReady | AppStateReady;

const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const { getInitialData } = useAPI();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<BasicAPI.GetUserBasicData | null>(null);
  const [screen, setScreen] = useState<GameScreens>(GameScreens.MAIN);

  const navigate = useCallback((nextScreen: GameScreens) => {
    setScreen(nextScreen);
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      const data = await getInitialData();
      if (data.error) {
        setIsError(true);
        return;
      }
      setData({
        type: BasicAPI.BasicAPIResponseType.INIT,
        member: data.member || '',
        allTimeDCRank: Number(data.allTimeDCRank || -1),
        allTimeFPRank: Number(data.allTimeFPRank || -1),
        dCRank: Number(data.dCRank || -1),
        status: 'ok',
        metrics: {
          totalQuestionsAnswered: Number(data.metrics.totalQuestionsAnswered || 0),
          correctAnswers: Number(data.metrics.correctAnswers || 0),
          longestStreak: Number(data.metrics.longestStreak || 0),
          currentStreak: Number(data.metrics.currentStreak || 0),
          totalPoints: Number(data.metrics.totalPoints || 0),
          totalTime: Number(data.metrics.totalTime || 0),
          fastestDCSession: Number(data.metrics.fastestDCSession || 100000000000),
          totalSessions: Number(data.metrics.totalSessions || 0),
          highestScoreSession: Number(data.metrics.highestScoreSession || 0),
          hintsUsed: Number(data.metrics.hintsUsed || 0),
        },
      });
      setIsError(false);
      setIsReady(true);
    } catch {
      setIsError(true);
      return {
        error: true,
      };
    }
  }, []);

  const value: AppState = useMemo(() => {
    if (isReady && data) {
      return { isReady: true, data, screen, navigate } as const;
    } else {
      return { isReady: false, data: null, screen, navigate } as const;
    }
  }, [isReady, data, screen]);

  // Fetch on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

// ---- Hook ----
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return context;
};
