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

const ACHIEVEMENTS: BasicAPI.AchievementType[] = [
  'firstquestion',
  'hotstreak',
  'firestreak',
  'bigbrains',
  'lightingfast',
  'perfectionist',
  'ontheboard',
  'climber',
  'topten',
  'numberone',
  'justintime',
];
const ACHIEVEMENTS_SET: Set<BasicAPI.AchievementType> = new Set([...ACHIEVEMENTS]);

export enum GameScreens {
  MAIN = 'main',
  INGAME = 'ingame',
  LEADERBOARDS = 'leaderboards',
}

interface AchievementsFunctions {
  checkForStreakAchievements: (streak: number) => BasicAPI.AchievementType[];
  checkForTimeAchievements: (timeLeft: number, timeToAnswer: number) => BasicAPI.AchievementType[];
  checkForPerfectRound: (
    correctAnswers: number,
    totalQuestions: number
  ) => BasicAPI.AchievementType[];
  checkForFirstQuestionAnswered: () => BasicAPI.AchievementType[];
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

type AppState = (AppStateNotReady | AppStateReady) & AchievementsFunctions;

const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const { getInitialData } = useAPI();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<BasicAPI.GetUserBasicData | null>(null);
  const [screen, setScreen] = useState<GameScreens>(GameScreens.MAIN);

  const checkForStreakAchievements = useCallback(
    (streak: number): BasicAPI.AchievementType[] => {
      if (!data) return [];
      const { achievements } = data;
      const unlocked: BasicAPI.AchievementType[] = [];
      if (!achievements.firestreak && streak >= 15) {
        achievements.firestreak = true;
        unlocked.push('firestreak');
      }
      if (!achievements.hotstreak && streak >= 5) {
        achievements.hotstreak = true;
        unlocked.push('hotstreak');
      }
      setData((prev) => {
        if (prev === null) return null;
        return {
          ...prev,
          achievements: {
            ...achievements,
          },
        };
      });
      console.log('!!!!unlockedStreak!!!!', unlocked);
      return unlocked;
    },
    [data]
  );

  const checkForTimeAchievements = useCallback(
    (timeLeft: number, timeToAnswer: number): BasicAPI.AchievementType[] => {
      if (!data) return [];
      const { achievements } = data;
      const unlocked: BasicAPI.AchievementType[] = [];
      const speed = timeToAnswer - timeLeft;
      if (!achievements.lightingfast && speed <= 3) {
        achievements.lightingfast = true;
        unlocked.push('lightingfast');
      }
      if (!achievements.justintime && speed >= timeToAnswer - 2) {
        achievements.justintime = true;
        unlocked.push('justintime');
      }
      setData((prev) => {
        if (prev === null) return null;
        return {
          ...prev,
          achievements: {
            ...achievements,
          },
        };
      });
      console.log('!!!!unlockedTime!!!!', unlocked);
      return unlocked;
    },
    [data]
  );

  const checkForPerfectRound = useCallback(
    (correctAnswers: number, totalQuestions: number): BasicAPI.AchievementType[] => {
      if (!data) return [];
      const { achievements } = data;
      const unlocked: BasicAPI.AchievementType[] = [];
      if (!achievements.perfectionist && correctAnswers === totalQuestions && totalQuestions > 0) {
        achievements.perfectionist = true;
        unlocked.push('perfectionist');
      }
      setData((prev) => {
        if (prev === null) return null;
        return {
          ...prev,
          achievements: {
            ...achievements,
          },
        };
      });
      console.log('!!!!unlockedPurrrfect!!!!', unlocked);
      return unlocked;
    },
    [data]
  );

  const checkForFirstQuestionAnswered = useCallback((): BasicAPI.AchievementType[] => {
    if (!data) return [];
    const { achievements } = data;
    const unlocked: BasicAPI.AchievementType[] = [];
    if (!achievements.firstquestion) {
      achievements.firstquestion = true;
      unlocked.push('firstquestion');
    }
    setData((prev) => {
      if (prev === null) return null;
      return {
        ...prev,
        achievements: {
          ...achievements,
        },
      };
    });
    console.log('!!!!unlockedFirstQuestion!!!!', unlocked);
    return unlocked;
  }, [data]);

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
          entertainmentCorrect: Number(data.metrics.entertainmentCorrect || 0),
          entertainmentCount: Number(data.metrics.entertainmentCount || 0),
          redditCount: Number(data.metrics.redditCount || 0),
          redditCorrect: Number(data.metrics.redditCorrect || 0),
          sportsCount: Number(data.metrics.sportsCount || 0),
          sportsCorrect: Number(data.metrics.sportsCorrect || 0),
          generalCount: Number(data.metrics.generalCount || 0),
          generalCorrect: Number(data.metrics.generalCorrect || 0),
          historyCount: Number(data.metrics.historyCount || 0),
          historyCorrect: Number(data.metrics.historyCorrect || 0),
          geographyCount: Number(data.metrics.geographyCount || 0),
          geographyCorrect: Number(data.metrics.geographyCorrect || 0),
        },
        achievements: { ...data.achievements },
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
      return {
        isReady: true,
        data,
        screen,
        navigate,
        checkForStreakAchievements,
        checkForTimeAchievements,
        checkForPerfectRound,
        checkForFirstQuestionAnswered,
      } as const;
    } else {
      return {
        isReady: false,
        data: null,
        screen,
        navigate,
        checkForStreakAchievements,
        checkForTimeAchievements,
        checkForPerfectRound,
        checkForFirstQuestionAnswered,
      } as const;
    }
  }, [
    isReady,
    data,
    screen,
    checkForStreakAchievements,
    checkForTimeAchievements,
    checkForPerfectRound,
    checkForFirstQuestionAnswered,
  ]);

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
