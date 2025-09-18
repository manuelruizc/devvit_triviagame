import { DailyTrivia, TriviaProvider, useTrivia } from '../../hooks/useTrivia';
4;
import { useAPI } from '../../hooks/useAPI';
import useLeaderboard from '../../hooks/useLeaderboard';
import { useState } from 'react';
import Curtain from './Curtain';
import QuestionSelectorTopbar from './QuestionSelectorTopbar';
import Questions from './Questions';
import { useAppState } from '../../hooks/useAppState';
import Finished from './finished';
import Idle from './idle';
import HelpersButtons from './helpersbuttons';
import clsx from 'clsx';

const TRIVIA: DailyTrivia = {
  mainQuestion: 'Based on these clues, what movie are we trying to remember?',
  mainAnswer: 'Once Upon a Time in Hollywood',
  answerLength: 'Once Upon a Time in Hollywood'.length, // optional: helps with underscores
  category: 'entertainment',
  questions: [
    {
      level: 'easy',
      question: 'Which actor starred in movies like Fight Club and Troy?',
      unlockedClue: 'Brad Pitt',
      answers: ['Brad Pitt', 'Tom Cruise', 'Matt Damon', 'Leonardo DiCaprio'],
      correctAnswer: 'Brad Pitt',
      category: 'sports',
      type: 'trivia',
    },
    {
      level: 'easy',
      question: 'Which cult classic 1994 movie was directed by Quentin Tarantino?',
      unlockedClue: 'Pulp Fiction',
      answers: ['Kill Bill', 'Pulp Fiction', 'Reservoir Dogs', 'Jackie Brown'],
      correctAnswer: 'Pulp Fiction',
      category: 'sports',
      type: 'trivia',
    },
    {
      level: 'medium',
      question: 'Which film about finance starred Leonardo DiCaprio as Jordan Belfort?',
      unlockedClue: 'The Wolf of Wall Street',
      answers: ['The Big Short', 'The Wolf of Wall Street', 'Margin Call', 'American Psycho'],
      correctAnswer: 'The Wolf of Wall Street',
      category: 'sports',
      type: 'trivia',
    },
    {
      level: 'medium',
      question: "Which U.S. city is the hub of the film industry, often called 'Tinseltown'?",
      unlockedClue: 'Los Angeles',
      answers: ['New York', 'Los Angeles', 'Chicago', 'San Francisco'],
      correctAnswer: 'Los Angeles',
      category: 'general',
      type: 'trivia',
    },
    {
      level: 'hard',
      question: "Which actress starred in both 'Barbie' and 'The Wolf of Wall Street'?",
      unlockedClue: 'Margot Robbie',
      answers: ['Jennifer Lawrence', 'Margot Robbie', 'Emma Stone', 'Scarlett Johansson'],
      correctAnswer: 'Margot Robbie',
      category: 'sports',
      type: 'trivia',
    },
  ],
};
const randomNumber = Math.floor(Math.random() * 11) + 1;
const Ingame = () => {
  const { isReady, navigationPayload, dailyTrivia } = useAppState();
  const {
    // postScoreToFreePlay,
    // getAllTimeDailyChallengesLeaderboard,
    // getAllTimeFreePlayLeaderboard,
  } = useLeaderboard();
  if (!isReady || navigationPayload === null) return null;
  if (!dailyTrivia) {
    return (
      <TriviaProvider trivia={TRIVIA} type={navigationPayload as 'fp' | 'dc'}>
        <IngameInner />
      </TriviaProvider>
    );
  }
  return (
    <TriviaProvider trivia={dailyTrivia} type={navigationPayload as 'fp' | 'dc'}>
      <IngameInner />
    </TriviaProvider>
  );
};

const IngameInner = () => {
  const { gameStatus } = useTrivia();

  if (gameStatus === 'finished-main-guess-correct' || gameStatus === 'finished-run-out-of-time') {
    return <Finished />;
  }
  if (gameStatus === 'idle') return <Idle />;
  return (
    <div className={clsx('w-full h-full flex flex-1 justify-center items-center')}>
      <div
        className={clsx(
          'w-full h-full flex flex-1 flex-col justify-start items-center max-w-[1250px]'
        )}
      >
        <QuestionSelectorTopbar />
        <Questions />
        <HelpersButtons />
      </div>
      <Curtain />
    </div>
  );
};

export default Ingame;
