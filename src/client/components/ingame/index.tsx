import Questions from './Questions';
import QuestionSelectorTopbar from './QuestionSelectorTopbar';
import { DailyTrivia, TriviaProvider, useTrivia } from './context';
import clsx from 'clsx';
import { useMemo } from 'react';

const TRIVIA: DailyTrivia = {
  mainQuestion: 'Based on these clues, what movie are we trying to remember?',
  mainAnswer: 'Once Upon a Time in Hollywood',
  answerLength: 'Once Upon a Time in Hollywood'.length, // optional: helps with underscores
  questions: [
    {
      level: 'easy',
      question: 'Which actor starred in movies like Fight Club and Troy?',
      unlockedClue: 'Brad Pitt',
      answers: ['Brad Pitt', 'Tom Cruise', 'Matt Damon', 'Leonardo DiCaprio'],
      correctAnswer: 'Brad Pitt',
    },
    {
      level: 'easy',
      question: 'Which cult classic 1994 movie was directed by Quentin Tarantino?',
      unlockedClue: 'Pulp Fiction',
      answers: ['Kill Bill', 'Pulp Fiction', 'Reservoir Dogs', 'Jackie Brown'],
      correctAnswer: 'Pulp Fiction',
    },
    {
      level: 'medium',
      question: 'Which film about finance starred Leonardo DiCaprio as Jordan Belfort?',
      unlockedClue: 'The Wolf of Wall Street',
      answers: ['The Big Short', 'The Wolf of Wall Street', 'Margin Call', 'American Psycho'],
      correctAnswer: 'The Wolf of Wall Street',
    },
    {
      level: 'medium',
      question: "Which U.S. city is the hub of the film industry, often called 'Tinseltown'?",
      unlockedClue: 'Los Angeles',
      answers: ['New York', 'Los Angeles', 'Chicago', 'San Francisco'],
      correctAnswer: 'Los Angeles',
    },
    {
      level: 'hard',
      question: "Which actress starred in both 'Barbie' and 'The Wolf of Wall Street'?",
      unlockedClue: 'Margot Robbie',
      answers: ['Jennifer Lawrence', 'Margot Robbie', 'Emma Stone', 'Scarlett Johansson'],
      correctAnswer: 'Margot Robbie',
    },
  ],
};

const Ingame = () => {
  return (
    <TriviaProvider trivia={TRIVIA}>
      <div className="w-full flex-1 flex">
        <div className="w-full flex flex-col justify-start items-center">
          <QuestionSelectorTopbar />
          <Questions />
        </div>
        <Curtain />
      </div>
    </TriviaProvider>
  );
};

const Curtain = () => {
  const {
    gameStatus,
    points,
    userAnswers,
    trivia: { questions },
    triviaHistory,
    correctAnswersCount,
  } = useTrivia();

  return (
    <div
      className={clsx(
        'absolute top-0 left-0 w-full h-full pointer-events-none transition-all duration-300 ease-in-out flex justify-center items-center',
        gameStatus !== 'between' &&
          gameStatus !== 'finished-main-guess-correct' &&
          gameStatus !== 'finished-run-out-of-time' &&
          'opacity-0',
        gameStatus === 'finished-main-guess-correct'
          ? 'bg-green-300'
          : gameStatus === 'finished-run-out-of-time'
            ? 'bg-red-500'
            : 'bg-black'
      )}
    >
      <span className="text-2xl">{points}</span>
      <span className="text-2xl">CorrectAnswers{correctAnswersCount}</span>
      {/* <span className="text-2xl">{JSON.stringify(userAnswers)}</span> */}
      <span className="text-2xl">{JSON.stringify(triviaHistory)}</span>
    </div>
  );
};

export default Ingame;
