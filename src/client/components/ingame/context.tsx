import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';

interface TriviaContextProps {
  time: string;
  points: number;
  isGameActive: boolean;
  currentQuestionIndex: number;
  startTimer: () => void;
  stopTimer: () => void;
  addPoints: (amount: number) => void;
  nextQuestion: () => void;
  resetGame: () => void;
}

const TriviaContext = createContext<TriviaContextProps | undefined>(undefined);

export const useTrivia = () => {
  const context = useContext(TriviaContext);
  if (!context) {
    throw new Error('useTrivia must be used within a TriviaProvider');
  }
  return context;
};

export const TriviaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [time, setTime] = useState('00:00');
  const [points, setPoints] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRef = useRef(0);

  // Format seconds into mm:ss
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (secs % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const startTimer = useCallback(() => {
    if (timerRef.current) return; // prevent multiple intervals
    setIsGameActive(true);
    timerRef.current = setInterval(() => {
      secondsRef.current += 1;
      setTime(formatTime(secondsRef.current));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsGameActive(false);
  }, []);

  const addPoints = (amount: number) => {
    setPoints((prev) => prev + amount);
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const resetGame = () => {
    stopTimer();
    setPoints(0);
    setTime('00:00');
    secondsRef.current = 0;
    setCurrentQuestionIndex(0);
    setIsGameActive(false);
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
        time,
        points,
        isGameActive,
        currentQuestionIndex,
        startTimer,
        stopTimer,
        addPoints,
        nextQuestion,
        resetGame,
      }}
    >
      {children}
    </TriviaContext.Provider>
  );
};
