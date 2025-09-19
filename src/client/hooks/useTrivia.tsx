import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { useAppState } from './useAppState';
import useLeaderboard from './useLeaderboard';
import { LeaderboardAPI } from '../../shared/types/leaderboard';
import { BasicAPI } from '../../shared/types/basic';

export type QuestionLevels = 'easy' | 'medium' | 'hard';
export type CurtainStates =
  | 'error'
  | 'good_answer'
  | 'perfect_chain'
  | 'used_a_clue'
  | 'bank'
  | 'run_out_of_time'
  | 'hidden';

type TriviaHistory = {
  answer: string | null;
  isCorrect: boolean;
  time: number;
  points: number;
  type: 'main-guess' | 'trivia';
};

export interface Question {
  level: QuestionLevels;
  question: string;
  unlockedClue: string;
  answers: string[];
  correctAnswer: string;
  category: BasicAPI.QuestionCategory;
  type: 'guess' | 'trivia';
}

export interface DailyTrivia {
  questions: Question[];
  mainQuestion: string;
  mainAnswer: string;
  answerLength: number;
  category: BasicAPI.QuestionCategory;
}

interface TriviaContextProps {
  trivia: DailyTrivia;
  time: string;
  points: number;
  gameStatus: GameStatus;
  currentQuestionIndex: number;
  userAnswers: (string | null)[];
  correctAnswersCount: number;
  triviaHistory: TriviaHistory[];
  startTimer: (status: GameStatus) => void;
  stopTimer: (status: GameStatus) => void;
  addPoints: (timeLeft: number, questionType: 'main-guess' | 'trivia') => void;
  nextQuestion: (currentStatus: GameStatus) => void;
  resetGame: (nextStatus: GameStatus) => void;
  handleQuestionAnswer: (
    question: Question,
    answer: string,
    category: BasicAPI.QuestionCategory
  ) => void;
  handleMainGuessAnswer: (
    guess: string,
    answer: string,
    category: BasicAPI.QuestionCategory
  ) => boolean;
  onHintUsed: () => void;
  saveToBank: (isPerfectChain: boolean) => void;
  resetCurtainState: () => void;
  activateClue: (cost: number) => void;
  coins: number;
  coinsBanked: number;
  streak: number;
  toBankSeconds: number;
  seconds: number;
  clueIsActive: boolean;
  cluesObtained: string[];
  type: 'dc' | 'fp';
  curtainState: CurtainStates;
}

const TIME_PER_QUESTION = 15;
const TIME_FOR_MAIN_GUESS = 60;
const POINTS_MAIN_GUESS = 5;
const POINTS_CLUE_GUESS = 2;
const BONUS_SECONDS_MAIN_GUESS = 2;
const BONUS_SECONDS_CLUE_GUESS = 2;
const FP_COINS_PER_QUESTION_FP = 2;
const FP_COINS_PER_QUESTION_DC = 2;
const FP_TOTAL_TIME = 60;

export const LIMIT_TO_BANK = 4;
export const STREAKVALUES: number[] = [0, 2, 4, 8, 16, 32, 64];
export const STREAK_LIMIT = 6;
export const FP_CLUE_COST = 25;
export const DC_CLUE_COST = 30;

export type GameStatus =
  | 'idle' // before game has started
  | 'trivia'
  | 'between' // answering trivia clues
  | 'main-guess' // guessing the final answer
  | 'finished-main-guess-correct' // game over
  | 'finished-run-out-of-time'; // game over

const TriviaContext = createContext<TriviaContextProps | undefined>(undefined);

export const useTrivia = () => {
  const context = useContext(TriviaContext);
  if (!context) {
    throw new Error('useTrivia must be used within a TriviaProvider');
  }
  return context;
};

// Format seconds into mm:ss
const formatTime = (secs: number) => {
  return `${secs}s`;
};

const getQuestionSafely = (questions: Question[], index: number): Question | null => {
  if (index < 0 || index >= questions.length) {
    return null;
  }
  return questions[index]!;
};

export const TriviaProvider: React.FC<{
  children: ReactNode;
  trivia: DailyTrivia;
  type?: 'fp' | 'dc';
}> = ({ children, trivia: _trivia, type = 'dc' }) => {
  const {
    data,
    isReady,
    achievements,
    questions,
    checkForFirstQuestionAnswered,
    checkForPerfectRound,
    checkForStreakAchievements,
    checkForTimeAchievements,
    dailyTriviaFinished,
    updateUserData,
    checkForLeaderboardAchievements,
  } = useAppState();
  const { postScoreToLeaderboard } = useLeaderboard();
  const [trivia] = useState<DailyTrivia>(_trivia);
  const [time, setTime] = useState(formatTime(type === 'dc' ? TIME_PER_QUESTION : FP_TOTAL_TIME));
  const [points, setPoints] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [, setPreviousQuestion] = useState<Question | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [triviaHistory, setTriviaHistory] = useState<TriviaHistory[]>([]);
  const [curtainState, setCurtainState] = useState<CurtainStates>('hidden');
  const [usingClue, setUsingClue] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(
    new Array(_trivia.questions.length).fill(null)
  );
  const [streak, setStreak] = useState<number>(0);
  const totalTime = useRef<number>(0);
  const longestStreak = useRef<number>(0);
  const questionsAnswered = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRef = useRef(type === 'dc' ? TIME_PER_QUESTION : FP_TOTAL_TIME);
  const [secs, setSecs] = useState<number>(type === 'dc' ? TIME_PER_QUESTION : FP_TOTAL_TIME);
  const currentQuestionIndexRef = useRef<number>(0);
  const hintsUsed = useRef<number>(0);
  const [cluesObtained, setCluesObtained] = useState<string[]>([]);
  const categoriesCount = useRef<BasicAPI.CategoryMetrics>({
    entertainmentCorrect: 0,
    entertainmentCount: 0,
    redditCount: 0,
    redditCorrect: 0,
    sportsCount: 0,
    sportsCorrect: 0,
    generalCount: 0,
    generalCorrect: 0,
    historyCount: 0,
    historyCorrect: 0,
    geographyCount: 0,
    geographyCorrect: 0,
  });

  // fp state
  const [coins, setCoins] = useState<number>(data?.metrics.coins || 0);
  const [coinsBanked, setCoinsBanked] = useState<number>(0);
  const [toBankSeconds, setToBankSeconds] = useState<number>(LIMIT_TO_BANK);
  const initialCoins = useRef<number>(data?.metrics.coins || 0);
  const addToCategoryCount = useCallback(
    (isCorrect: boolean, category: BasicAPI.QuestionCategory) => {
      const countKey = `${category}Count` as `${BasicAPI.QuestionCategory}Count`;
      const correctKey = `${category}Correct` as `${BasicAPI.QuestionCategory}Correct`;

      categoriesCount.current[countKey] += 1;

      if (isCorrect) {
        categoriesCount.current[correctKey] += 1;
      }
    },
    []
  );

  const activateClue = useCallback(
    (clueCost: number) => {
      if (clueCost > coins) return;
      setCurtainState('used_a_clue');
      setCoins(coins - clueCost);
      setUsingClue(true);
      initialCoins.current = coins - clueCost;
    },
    [coins]
  );

  const resetCurtainState = useCallback(() => {
    setCurtainState('hidden');
  }, []);

  const onHintUsed = useCallback(() => {
    hintsUsed.current++;
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (!data || !data.metrics) return;
    longestStreak.current = data.metrics.longestStreak;
  }, [data, isReady]);

  const startTimer = useCallback(
    (status: GameStatus) => {
      if (timerRef.current) return;
      setGameStatus(status);
      setToBankSeconds(LIMIT_TO_BANK);
      setCurtainState('hidden');
      timerRef.current = setInterval(() => {
        secondsRef.current -= 1;
        setToBankSeconds((prev) => (prev - 1 <= 0 ? 0 : prev - 1));
        setSecs((prev) => prev - 1);
        setTime(formatTime(secondsRef.current));
        if (secondsRef.current === 0) {
          if (type === 'fp') {
            stopTimer('finished-main-guess-correct');
            return;
          }
          if (status === 'main-guess') {
            stopTimer('finished-run-out-of-time');
          } else {
            setCurtainState('run_out_of_time');
            handleWrongAnswer('trivia', null);
          }
        }
      }, 1000);
    },
    [toBankSeconds]
  );

  const stopTimer = useCallback((status: GameStatus) => {
    setGameStatus(status);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const addPoints = (timeLeft: number, questionType: 'main-guess' | 'trivia') => {
    const isMainGuess = questionType === 'main-guess';
    const secondsLeft = timeLeft;
    let currentPoints = isMainGuess ? POINTS_MAIN_GUESS : POINTS_CLUE_GUESS;
    currentPoints +=
      secondsLeft * (isMainGuess ? BONUS_SECONDS_MAIN_GUESS : BONUS_SECONDS_CLUE_GUESS);
    const _points = points + currentPoints;
    setPoints(_points);
    return _points;
  };

  const nextQuestion = (currentStatus: GameStatus) => {
    let nextIndex = currentQuestionIndexRef.current + 1;
    let nextGameStatus: GameStatus = 'trivia';
    if (nextIndex < 0 || nextIndex >= trivia.questions.length) {
      if (currentStatus === 'main-guess') {
        nextGameStatus = 'main-guess';
      } else {
        nextGameStatus = 'main-guess';
      }
      setPreviousQuestion(null);
    } else {
      setPreviousQuestion(getQuestionSafely(trivia.questions, nextIndex));
    }

    if (type === 'dc') {
      const nextTimeBase = nextGameStatus === 'trivia' ? TIME_PER_QUESTION : TIME_FOR_MAIN_GUESS;
      setTime(formatTime(nextTimeBase));
      secondsRef.current = nextTimeBase;
      setSecs(nextTimeBase);
      setToBankSeconds(LIMIT_TO_BANK);
      setTimeout(() => {
        setCurrentQuestionIndex(nextIndex);
        currentQuestionIndexRef.current = nextIndex;
        startTimer(nextGameStatus);
        setUsingClue(false);
      }, 1200);
      return;
    }
    setTimeout(() => {
      setUsingClue(false);
      setCurrentQuestionIndex(nextIndex);
      currentQuestionIndexRef.current = nextIndex;
      startTimer(nextGameStatus);
    }, 1200);
  };

  const handleWrongAnswer = (
    currentStatus: GameStatus,
    answer: string | null,
    time: number = -1
  ) => {
    questionsAnswered.current++;
    if (streak > longestStreak.current) {
      longestStreak.current = streak;
    }
    if (type === 'fp') {
      loseCoins();
    } else {
    }
    setStreak(0);
    totalTime.current += TIME_PER_QUESTION - time;
    setTriviaHistory((prev) => {
      prev.push({
        type: 'trivia',
        answer,
        points: 0,
        time,
        isCorrect: false,
      });
      return [...prev];
    });
    stopTimer('between');
    nextQuestion(currentStatus);
  };

  const handleMainGuessAnswer = (
    guess: string,
    answer: string,
    category: BasicAPI.QuestionCategory
  ): boolean => {
    const isCorrect = guess.toLowerCase() === answer.toLowerCase();
    addToCategoryCount(isCorrect, category);
    if (isCorrect) {
      addCoins(streak + 1);
      checkForFirstQuestionAnswered();
      stopTimer('finished-main-guess-correct');
      const _pointsTotal = addPoints(secondsRef.current, 'main-guess');
      checkForTimeAchievements(secondsRef.current, TIME_FOR_MAIN_GUESS);
      setTriviaHistory((prev) => {
        prev.push({
          answer,
          points: _pointsTotal,
          time: secondsRef.current,
          isCorrect,
          type: 'main-guess',
        });
        return [...prev];
      });
      setCorrectAnswersCount((prev) => prev + 1);
      return true;
    }
    setTriviaHistory((prev) => {
      prev.push({
        answer,
        points: 0,
        time: -1,
        isCorrect: false,
        type: 'main-guess',
      });
      return [...prev];
    });
    return false;
  };

  const handleQuestionAnswer = (
    question: Question,
    answer: string,
    category: BasicAPI.QuestionCategory
  ) => {
    setUserAnswers((prev) => {
      prev[currentQuestionIndex] = answer;
      return [...prev];
    });
    const questionType: GameStatus = gameStatus;
    stopTimer('between');
    const isCorrect = question.correctAnswer === answer;
    addToCategoryCount(isCorrect, category);
    if (isCorrect) {
      setCluesObtained((prev) => [...prev, answer]);
      checkForFirstQuestionAnswered();
      if (type === 'fp') {
        const netxStreak = streak + 1;
        if (netxStreak < STREAK_LIMIT) {
          setCurtainState('good_answer');
          checkForStreakAchievements(streak + 1);
          addCoins(streak + 1);
          setStreak((prev) => prev + 1);
        } else {
          setTimeout(() => {
            saveToBank(true);
          }, 250);
        }
      } else {
        setCurtainState('good_answer');
        checkForStreakAchievements(streak + 1);
        addCoins(streak + 1);
        setStreak((prev) => prev + 1);
      }
      setCorrectAnswersCount((prev) => prev + 1);
      const questionPoints = addPoints(
        secondsRef.current,
        questionType === 'main-guess' ? 'main-guess' : 'trivia'
      );
      checkForTimeAchievements(secondsRef.current, TIME_PER_QUESTION);
      questionsAnswered.current++;
      totalTime.current += TIME_PER_QUESTION - secondsRef.current;
      setTriviaHistory((prev) => {
        prev.push({
          type: 'trivia',
          answer: answer,
          points: questionPoints,
          time: secondsRef.current,
          isCorrect: true,
        });
        return [...prev];
      });
      nextQuestion(questionType);
    } else {
      setCurtainState('error');
      handleWrongAnswer(questionType, answer, secondsRef.current);
    }
  };

  const resetGame = (nextStatus: GameStatus) => {
    stopTimer(nextStatus);
    setPoints(0);
    setTime(formatTime(TIME_PER_QUESTION));
    secondsRef.current = TIME_PER_QUESTION;
    setSecs(TIME_PER_QUESTION);
    setToBankSeconds(LIMIT_TO_BANK);
    setCurrentQuestionIndex(0);
    currentQuestionIndexRef.current = 0;
  };

  const handleFinishedGame = useCallback(async () => {
    try {
      if (!isReady) return;
      if (!data || !data.metrics) return;
      checkForPerfectRound(correctAnswersCount, questionsAnswered.current);
      const { metrics, allTimeDCRank: atDC, allTimeFPRank: atFP, dCRank: dc } = data;

      const {
        totalQuestionsAnswered,
        correctAnswers,
        totalPoints,
        totalTime: _totalTime,
        fastestDCSession,
        totalSessions,
        highestScoreSession,
        hintsUsed: _hintsUsed,
        entertainmentCorrect,
        entertainmentCount,
        redditCount,
        redditCorrect,
        sportsCount,
        sportsCorrect,
        generalCount,
        generalCorrect,
        historyCount,
        historyCorrect,
        geographyCount,
        geographyCorrect,
      } = metrics;
      const obj = { ...data };
      if (type === 'fp') {
        obj.allTimeFPRank = Math.max(atFP, obj.allTimeFPRank);
      }
      obj.metrics = {
        coins: metrics.coins + coinsBanked,
        totalPoints: totalPoints + points,
        correctAnswers: correctAnswers + correctAnswersCount,
        longestStreak: Math.max(longestStreak.current, streak),
        currentStreak: streak,
        totalTime: _totalTime + totalTime.current,
        fastestDCSession: Math.min(fastestDCSession, totalTime.current),
        totalSessions: totalSessions + 1,
        highestScoreSession: Math.max(highestScoreSession, points),
        hintsUsed: _hintsUsed + hintsUsed.current, // TODO
        totalQuestionsAnswered: totalQuestionsAnswered + questionsAnswered.current,
        entertainmentCorrect: entertainmentCorrect + categoriesCount.current.entertainmentCorrect,
        entertainmentCount: entertainmentCount + categoriesCount.current.entertainmentCount,
        redditCount: redditCount + categoriesCount.current.redditCount,
        redditCorrect: redditCorrect + categoriesCount.current.redditCorrect,
        sportsCount: sportsCount + categoriesCount.current.sportsCount,
        sportsCorrect: sportsCorrect + categoriesCount.current.sportsCorrect,
        generalCount: generalCount + categoriesCount.current.generalCount,
        generalCorrect: generalCorrect + categoriesCount.current.generalCorrect,
        historyCount: historyCount + categoriesCount.current.historyCount,
        historyCorrect: historyCorrect + categoriesCount.current.historyCorrect,
        geographyCount: geographyCount + categoriesCount.current.geographyCount,
        geographyCorrect: geographyCorrect + categoriesCount.current.geographyCorrect,
      };
      const achievementsObj: Partial<Record<BasicAPI.AchievementType, boolean>> = {};
      for (const key of achievements) {
        achievementsObj[key] = true;
      }
      obj.achievements = { ...achievementsObj };
      const leaderboardKey =
        type === 'dc'
          ? LeaderboardAPI.LEADERBOARD_NAMES.ALL_TIME_DC
          : LeaderboardAPI.LEADERBOARD_NAMES.ALL_TIME_FP;
      let res: any = await postScoreToLeaderboard(
        obj,
        type === 'fp' ? coinsBanked : points,
        leaderboardKey
      );

      const { allTimeDCRank, allTimeFPRank, dCRank } = res;
      let rankAchievements: BasicAPI.AchievementType[] = [];
      if (type === 'fp') {
        rankAchievements = checkForLeaderboardAchievements(allTimeFPRank, 1000000000);
      } else {
        rankAchievements = checkForLeaderboardAchievements(dCRank, allTimeDCRank);
      }
      if (rankAchievements.length > 0) {
        const achievementsObj: Partial<Record<BasicAPI.AchievementType, boolean>> = {};
        for (const key of rankAchievements) {
          achievementsObj[key] = true;
        }
        obj.achievements = { ...obj.achievements, ...achievementsObj };
        res = await postScoreToLeaderboard(
          obj,
          type === 'fp' ? coinsBanked : points,
          leaderboardKey
        );
      }
      updateUserData(res);
      if (type === 'dc') dailyTriviaFinished();
    } catch (e) {
      console.log('error');
    }
  }, [
    data,
    isReady,
    points,
    type,
    correctAnswersCount,
    streak,
    points,
    questionsAnswered,
    achievements,
    coinsBanked,
    coins,
  ]);

  const addCoins = useCallback(
    (currentStreak: number) => {
      const roundCoins =
        (type === 'fp' ? FP_COINS_PER_QUESTION_FP : FP_COINS_PER_QUESTION_DC) * currentStreak;
      if (type === 'fp') {
        return;
      }
      setCoins((prev) => prev + roundCoins);
    },
    [coins, type]
  );

  const loseCoins = useCallback(() => {
    setCoins(initialCoins.current);
  }, []);

  const saveToBank = useCallback(
    (isPerfectChain: boolean = false) => {
      setCurtainState(isPerfectChain ? 'perfect_chain' : 'bank');
      const multiplier = streak >= STREAKVALUES.length ? STREAKVALUES.length - 1 : streak;
      const value: number = STREAKVALUES[multiplier] || 0;
      if (isPerfectChain)
        setCoinsBanked((prev) => prev + (STREAKVALUES[STREAKVALUES.length - 1] || 64));
      else setCoinsBanked((prev) => prev + value);
      setStreak(0);
    },
    [coins, streak]
  );

  useEffect(() => {
    if (gameStatus !== 'finished-main-guess-correct' && gameStatus !== 'finished-run-out-of-time')
      return;
    handleFinishedGame();
  }, [gameStatus]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <TriviaContext.Provider
      value={{
        trivia,
        time,
        points,
        gameStatus,
        userAnswers,
        currentQuestionIndex,
        correctAnswersCount,
        triviaHistory,
        coins,
        coinsBanked,
        streak,
        clueIsActive: usingClue,
        type,
        seconds: secs,
        toBankSeconds,
        cluesObtained,
        curtainState,
        onHintUsed,
        startTimer,
        stopTimer,
        addPoints,
        nextQuestion,
        resetGame,
        handleQuestionAnswer,
        handleMainGuessAnswer,
        saveToBank,
        activateClue,
        resetCurtainState,
      }}
    >
      {children}
    </TriviaContext.Provider>
  );
};
