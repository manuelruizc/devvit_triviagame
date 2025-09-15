import { DailyTrivia, TriviaProvider } from '../../hooks/useTrivia';
4;
import { useAPI } from '../../hooks/useAPI';
import useLeaderboard from '../../hooks/useLeaderboard';
import { useState } from 'react';
import Curtain from './Curtain';
import QuestionSelectorTopbar from './QuestionSelectorTopbar';
import Questions from './Questions';
import { useAppState } from '../../hooks/useAppState';

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
const randomNumber = Math.floor(Math.random() * 11) + 1;
const Ingame = () => {
  const { isReady } = useAppState();
  const { data } = useAppState();
  const {
    postScoreToFreePlay,
    getAllTimeDailyChallengesLeaderboard,
    getAllTimeFreePlayLeaderboard,
  } = useLeaderboard();
  if (!isReady) return null;
  return (
    <TriviaProvider trivia={TRIVIA}>
      <div className="w-full flex-1 flex">
        <div className="w-full flex flex-col justify-center items-center">
          <span className="text-3xl font-bold">{data?.member || 'no member'}</span>
          <span className="text-xs text-center font-bold">{JSON.stringify(data)}</span>
          <button onClick={() => getAllTimeDailyChallengesLeaderboard(data?.member || '')}>
            Check All-Time DailyChallenge
          </button>
          <button onClick={() => getAllTimeFreePlayLeaderboard(data?.member || '')}>
            Check All-Time Freeplay
          </button>
          {/* <button
            onClick={() => {
              if (
                !user ||
                !user.username ||
                user.username.length === 0 ||
                user.username === 'anonymous'
              )
                return;
              postScoreToFreePlay(user.username, rn);
              setRn(Math.floor(Math.random() * 11) + 1);
            }}
          >
            Save to leaderboard: {rn}
          </button> */}
          <QuestionSelectorTopbar />
          <Questions />
        </div>
        <Curtain />
      </div>
    </TriviaProvider>
  );
};

export default Ingame;
