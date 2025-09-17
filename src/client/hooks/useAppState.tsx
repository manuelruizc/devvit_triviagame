import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BasicAPI } from '../../shared/types/basic';
import { useAPI } from './useAPI';
import clsx from 'clsx';
import { DailyTrivia, Question } from './useTrivia';
import { context } from '@devvit/web/client';
import { ACCENT_COLOR, ACCENT_COLOR2, ACCENT_COLOR3, ACCENT_COLOR6 } from '../helpers/colors';

export const ACHIEVEMENTS: BasicAPI.AchievementType[] = [
  'firstquestion',
  'perfectionist',
  'justintime',
  'hotstreak',
  'firestreak',
  // 'bigbrains',
  'lightingfast',
  'ontheboard',
  // 'climber',
  'topten',
  'numberone',
];
const ACHIEVEMENTS_SET: Set<BasicAPI.AchievementType> = new Set([...ACHIEVEMENTS]);

export enum GameScreens {
  MAIN = 'main',
  INGAME = 'ingame',
  LEADERBOARDS = 'leaderboards',
  ACHIEVEMENTS = 'achievements',
  USER_PROFILE = 'userprofile',
  CREATE_POST = 'createpost',
}

interface AchievementsFunctions {
  checkForStreakAchievements: (streak: number) => BasicAPI.AchievementType[];
  checkForTimeAchievements: (timeLeft: number, timeToAnswer: number) => BasicAPI.AchievementType[];
  checkForPerfectRound: (
    correctAnswers: number,
    totalQuestions: number
  ) => BasicAPI.AchievementType[];
  checkForFirstQuestionAnswered: () => BasicAPI.AchievementType[];
  achievements: BasicAPI.AchievementType[];
  dailyTrivia: DailyTrivia | null;
  postTriviaAnswered: boolean;
  dailyTriviaFinished: () => void;
  playButtonSound: () => void;
}

interface AppStateNotReady {
  isReady: false;
  data: null;
  screen: GameScreens;
  navigationPayload: string | null;
  isError: boolean;
  navigate: (screen: GameScreens, payload?: string) => void;
  goBack: () => void;
}

interface AppStateReady {
  isReady: true;
  data: BasicAPI.GetUserBasicData;
  screen: GameScreens;
  navigationPayload: string | null;
  isError: boolean;
  navigate: (screen: GameScreens, payload?: string) => void;
  goBack: () => void;
}

type AppState = (AppStateNotReady | AppStateReady) & AchievementsFunctions;

const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const { getInitialData, getQuestions, getDailyChallengeStatus } = useAPI();
  const [dailyTrivia, setDailyTrivia] = useState<DailyTrivia | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [navigationPayload, setNavigationPayload] = useState<string | null>(null);
  const [data, setData] = useState<BasicAPI.GetUserBasicData | null>(null);
  const [screen, setScreen] = useState<GameScreens>(GameScreens.MAIN);
  const [navigatingActive, setNavigatingActive] = useState<boolean>(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<BasicAPI.AchievementType[]>([]);
  const [achievements, setAchievements] = useState<BasicAPI.AchievementType[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [postTriviaAnswered, setPostTriviaAnswered] = useState<boolean>(false);
  const navigationStack = useRef<GameScreens[]>([]);
  const navigationPayloadStack = useRef<(string | null)[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    audioCtx.current = new AudioContext();
    fetch('/sounds/buttonclick.mp3')
      .then((res) => res.arrayBuffer())
      .then((data) => audioCtx.current!.decodeAudioData(data))
      .then((decoded) => (bufferRef.current = decoded));
  }, []);

  const playButtonSound = useCallback(() => {
    if (audioCtx.current && bufferRef.current) {
      const source = audioCtx.current.createBufferSource();
      source.buffer = bufferRef.current;
      source.connect(audioCtx.current.destination);
      source.start(0);
    }
  }, []);
  const checkForStreakAchievements = useCallback(
    (streak: number): BasicAPI.AchievementType[] => {
      if (!data) return [];
      const { achievements } = data;
      console.log('streak', streak);
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
      if (unlocked.length > 0) {
        setUnlockedAchievements((prev) => [...prev, ...unlocked]);
        setAchievements((prev) => [...prev, ...unlocked]);
      }
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
      if (unlocked.length > 0) {
        setUnlockedAchievements((prev) => [...prev, ...unlocked]);
        setAchievements((prev) => [...prev, ...unlocked]);
      }
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
      if (unlocked.length > 0) {
        if (unlocked.length > 0) {
          setUnlockedAchievements((prev) => [...prev, ...unlocked]);
          setAchievements((prev) => [...prev, ...unlocked]);
        }
      }
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
    if (unlocked.length > 0) {
      setUnlockedAchievements((prev) => [...prev, ...unlocked]);
      setAchievements((prev) => [...prev, ...unlocked]);
    }
    return unlocked;
  }, [data]);

  const navigate = useCallback((nextScreen: GameScreens, payload?: string) => {
    const finalPayload = payload === undefined || payload === null ? null : payload;
    setNavigatingActive(true);
    setNavigationPayload(null);
    navigationPayloadStack.current.push(finalPayload);
    navigationStack.current.push(nextScreen);
    setTimeout(() => {
      setNavigationPayload(finalPayload);
      setScreen(nextScreen);
    }, 700);
    setTimeout(() => {
      setNavigatingActive(false);
    }, 1100);
  }, []);

  const goBack = useCallback(() => {
    if (navigationStack.current.length === 0) return;
    const navigationHistory = [...navigationStack.current];
    navigationHistory.pop();
    const payStack = [...navigationPayloadStack.current];
    payStack.pop();
    navigationStack.current = [...navigationHistory];
    navigationPayloadStack.current = [...payStack];
    if (navigationHistory.length === 0) {
      navigate(GameScreens.MAIN);
      setNavigationPayload(null);
      return;
    }
    setNavigationPayload(payStack[payStack.length - 1] || null);
    const screen = navigationHistory[navigationHistory.length - 1];
    if (screen) {
      navigate(screen);
    }
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      const data = await getInitialData();
      const questionsResponse = await getQuestions();
      const dailyChallengeStatus = await getDailyChallengeStatus();
      if (
        data.error ||
        dailyChallengeStatus.error ||
        questionsResponse.error ||
        !context ||
        !context.postData?.dailyChallenge
      ) {
        setIsError(true);
        return;
      }
      const images = [
        '/badges/firestreak.png',
        '/badges/firstquestion.png',
        '/badges/hotstreak.png',
        '/badges/justintime.png',
        '/badges/lightingfast.png',
        '/badges/numberone.png',
        '/badges/ontheboard.png',
        '/badges/perfectionist.png',
        '/badges/topten.png',
        '/cat/cat-empty-state.png',
        '/cat/cat-in-circle.png',
        '/cat/cat-sit-smiling-blink-one-eye.png',
        '/cat/cat-sit-smiling-blink-two-eyes.png',
        '/cat/cat-sit-smiling.png',
        '/cat/cat-snoo.png',
      ];

      images.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
      setPostTriviaAnswered(dailyChallengeStatus.answered || false);
      setDailyTrivia(context.postData!.dailyChallenge as unknown as DailyTrivia);
      setData({
        type: BasicAPI.BasicAPIResponseType.INIT,
        member: data.member || '',
        allTimeDCRank: Number(data.allTimeDCRank || -1),
        allTimeFPRank: Number(data.allTimeFPRank || -1),
        dCRank: Number(data.dCRank || -1),
        status: 'ok',
        metrics: {
          coins: Number(data.metrics.coins !== undefined ? data.metrics.coins : 0),
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
      setAchievements(
        data ? [...(Object.keys(data.achievements) as BasicAPI.AchievementType[])] : []
      );
      setQuestions([...questionsResponse.questions]);
      setIsError(false);
      setIsReady(true);
    } catch {
      setIsError(true);
      return {
        error: true,
      };
    }
  }, []);

  const dailyTriviaFinished = useCallback(() => {
    setPostTriviaAnswered(true);
  }, []);

  const value: AppState = useMemo(() => {
    if (isReady && data && dailyTrivia !== null) {
      return {
        isReady: true,
        data,
        screen,
        achievements,
        isError,
        navigationPayload,
        dailyTrivia,
        postTriviaAnswered,
        navigate,
        dailyTriviaFinished,
        checkForStreakAchievements,
        checkForTimeAchievements,
        checkForPerfectRound,
        checkForFirstQuestionAnswered,
        goBack,
        playButtonSound,
      } as const;
    } else {
      return {
        isReady: false,
        data: null,
        screen,
        achievements,
        navigationPayload,
        isError,
        dailyTrivia: null,
        postTriviaAnswered,
        navigate,
        checkForStreakAchievements,
        dailyTriviaFinished,
        checkForTimeAchievements,
        checkForPerfectRound,
        checkForFirstQuestionAnswered,
        goBack,
        playButtonSound,
      } as const;
    }
  }, [
    isReady,
    data,
    screen,
    data,
    screen,
    achievements,
    isError,
    navigationPayload,
    dailyTrivia,
    postTriviaAnswered,
    checkForStreakAchievements,
    playButtonSound,
    checkForTimeAchievements,
    checkForPerfectRound,
    checkForFirstQuestionAnswered,
  ]);

  // Fetch on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <AppStateContext.Provider value={value}>
      {children}

      {unlockedAchievements.length === 0 ? null : (
        <UnlockedAchievements
          achievements={unlockedAchievements}
          reset={() => setUnlockedAchievements([])}
        />
      )}
      <NavigationTransitionLayer transitionActive={navigatingActive} />
    </AppStateContext.Provider>
  );
};

const NavigationTransitionLayer = ({ transitionActive }: { transitionActive: boolean }) => {
  return (
    <div
      className={clsx(
        'absolute top-0 left-0 w-full h-full transition-all duration-500 ease-in-out flex flex-col',
        transitionActive ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      <div
        className={clsx(
          'flex-1 transition-all duration-500 ease-in-out w-full',
          transitionActive ? 'translate-x-0' : 'translate-x-[-100%]'
        )}
        style={{ backgroundColor: ACCENT_COLOR }}
      />
      <div
        className={clsx(
          'flex-1 transition-all duration-500 ease-in-out w-full',
          transitionActive ? 'translate-x-0' : 'translate-x-[100%]'
        )}
        style={{ backgroundColor: ACCENT_COLOR2 }}
      />
      <div
        className={clsx(
          'flex-1 transition-all duration-500 ease-in-out w-full',
          transitionActive ? 'translate-x-0' : 'translate-x-[-100%]'
        )}
        style={{ backgroundColor: ACCENT_COLOR3 }}
      />
      <div
        className={clsx(
          'flex-1 transition-all duration-500 ease-in-out w-full',
          transitionActive ? 'translate-x-0' : 'translate-x-[100%]'
        )}
        style={{ backgroundColor: ACCENT_COLOR6 }}
      />
      <div className={clsx('absolute top-0 left-0 w-full h-full flex justify-center items-center')}>
        <div className="w-full h-full max-w-[1250px] flex justify-center items-center">
          <div
            className={clsx(
              'w-7/12 aspect-square transition-all duration-500 ease-in-out lg:w-5/12',
              transitionActive
                ? 'scale-100 rotate-[0deg] opacity-100'
                : 'scale-50 opacity-0 rotate-[720deg]'
            )}
            style={{
              backgroundImage: 'url(/cat/cat-snoo.png',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'contain',
            }}
          />
        </div>
      </div>
    </div>
  );
};

const UnlockedAchievements = ({
  achievements: _ach,
  reset,
}: {
  achievements: BasicAPI.AchievementType[];
  reset: () => void;
}) => {
  const [achievements, setAchievements] = useState<BasicAPI.AchievementType[]>(_ach);
  const achievementsRef = useRef<BasicAPI.AchievementType[]>(_ach);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (intervalRef.current !== null) return;
    intervalRef.current = setInterval(() => {
      const arr = [...achievementsRef.current];
      arr.pop();
      const isEmpty = arr.length === 0;
      achievementsRef.current = [...arr];
      setAchievements([...arr]);
      if (isEmpty) {
        if (intervalRef.current === null) return;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        reset();
      }
    }, 1100);
  }, []);

  return (
    <div
      className={clsx(
        'absolute top-0 left-0 w-full h-full transition-all duration-300 ease-in-out pointer-events-none flex flex-col justify-end items-center'
      )}
    >
      {achievements.length === 0 ? null : (
        <div className="w-6/12 h-18 bg-green-400 flex justify-center items-center">
          <span>{achievements[achievements.length - 1]}</span>
        </div>
      )}
    </div>
  );
};

// ---- Hook ----
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return context;
};
