import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';

export type QuestionLevels = 'easy' | 'medium' | 'hard';

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
}

export interface DailyTrivia {
  questions: Question[];
  mainQuestion: string;
  mainAnswer: string;
  answerLength: number;
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
  handleQuestionAnswer: (question: Question, answer: string) => void;
  handleMainGuessAnswer: (guess: string, answer: string) => boolean;
}

const TIME_PER_QUESTION = 15;
const TIME_FOR_MAIN_GUESS = 60;
const POINTS_MAIN_GUESS = 500;
const POINTS_CLUE_GUESS = 50;
const BONUS_SECONDS_MAIN_GUESS = 5;
const BONUS_SECONDS_CLUE_GUESS = 10;

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
  const minutes = Math.floor(secs / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (secs % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const getQuestionSafely = (questions: Question[], index: number): Question | null => {
  if (index < 0 || index >= questions.length) {
    return null;
  }
  return questions[index]!;
};

export const TriviaProvider: React.FC<{ children: ReactNode; trivia: DailyTrivia }> = ({
  children,
  trivia: _trivia,
}) => {
  const [trivia] = useState<DailyTrivia>(_trivia);
  const [time, setTime] = useState(formatTime(TIME_PER_QUESTION));
  const [points, setPoints] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [, setPreviousQuestion] = useState<Question | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [triviaHistory, setTriviaHistory] = useState<TriviaHistory[]>([]);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(
    new Array(_trivia.questions.length).fill(null)
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRef = useRef(TIME_PER_QUESTION);
  const currentQuestionIndexRef = useRef<number>(0);

  const startTimer = useCallback((status: GameStatus) => {
    if (timerRef.current) return;
    setGameStatus(status);
    timerRef.current = setInterval(() => {
      secondsRef.current -= 1;
      setTime(formatTime(secondsRef.current));
      if (secondsRef.current === 0) {
        if (status === 'main-guess') {
          stopTimer('finished-run-out-of-time');
        } else {
          handleWrongAnswer('trivia', null);
        }
      }
    }, 1000);
  }, []);

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
    setPoints((prevPoints) => prevPoints + _points);
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
    setCurrentQuestionIndex(nextIndex);
    currentQuestionIndexRef.current = nextIndex;
    const nextTimeBase = nextGameStatus === 'trivia' ? TIME_PER_QUESTION : TIME_FOR_MAIN_GUESS;
    setTime(formatTime(nextTimeBase));
    secondsRef.current = nextTimeBase;
    setTimeout(() => {
      startTimer(nextGameStatus);
    }, 400);
  };

  const handleWrongAnswer = (
    currentStatus: GameStatus,
    answer: string | null,
    time: number = -1
  ) => {
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

  const handleMainGuessAnswer = (guess: string, answer: string): boolean => {
    const isCorrect = guess.toLowerCase() === answer.toLowerCase();
    if (isCorrect) {
      stopTimer('finished-main-guess-correct');
      const _pointsTotal = addPoints(secondsRef.current, 'main-guess');
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

  const handleQuestionAnswer = (question: Question, answer: string) => {
    setUserAnswers((prev) => {
      prev[currentQuestionIndex] = answer;
      return [...prev];
    });
    const questionType: GameStatus = gameStatus;
    stopTimer('between');
    const isCorrect = question.correctAnswer === answer;
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
      const questionPoints = addPoints(
        secondsRef.current,
        questionType === 'main-guess' ? 'main-guess' : 'trivia'
      );
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
      handleWrongAnswer(questionType, answer, secondsRef.current);
    }
  };

  const resetGame = (nextStatus: GameStatus) => {
    stopTimer(nextStatus);
    setPoints(0);
    setTime(formatTime(TIME_PER_QUESTION));
    secondsRef.current = TIME_PER_QUESTION;
    setCurrentQuestionIndex(0);
    currentQuestionIndexRef.current = 0;
  };

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
        startTimer,
        stopTimer,
        addPoints,
        nextQuestion,
        resetGame,
        handleQuestionAnswer,
        handleMainGuessAnswer,
      }}
    >
      {children}
    </TriviaContext.Provider>
  );
};
