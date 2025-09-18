import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      appDisplayName: 'Forgetful Kitty Trivia!',
    },
    subredditName: subredditName,
    title: 'Forgetful Kitty Trivia!',
    postData: {
      dailyChallenge: {
        mainQuestion: 'Based on these clues, what movie are we trying to remember?',
        mainAnswer: 'Once Upon a Time in Hollywood',
        answerLength: 'Once Upon a Time in Hollywood'.length,
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
      },
    },
  });
};
