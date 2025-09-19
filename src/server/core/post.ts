import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      appDisplayName: 'Forgetful Kitty Trivia!',
      appIconUri: 'icon.png',
      backgroundUri: 'defaultsplashscren.png',
      buttonLabel: "Let's do it",
    },
    subredditName: subredditName,
    title: 'A hard one, but I trust you - Daily Challenge',
    postData: {
      dailyChallenge: {
        mainQuestion: 'Based on these clues, what do I want to watch in Netflix?',
        mainAnswer: 'The Office',
        answerLength: 'The Office'.length,
        questions: [
          {
            level: '',
            question:
              "Which famous American comedian started his career on 'Saturday Night Live' and starred in 'Elf'?",
            unlockedClue: '',
            answers: ['Adam Sandler', 'Will Ferrell', 'Jim Carrey', 'Chris Farley'],
            correctAnswer: 'Will Ferrell',
            category: '',
            type: 'trivia',
          },
          {
            level: '',
            question:
              'What is the former name of the arena in Los Angeles where the Lakers play basketball?',
            unlockedClue: '',
            answers: ['Staples', 'Pepsi Center', 'Madison Square Garden', 'United Center'],
            correctAnswer: 'Staples',
            category: '',
            type: 'trivia',
          },
          {
            level: '',
            question:
              "Which British singer-songwriter is known for the 2005 hit song 'You're Beautiful'?",
            unlockedClue: '',
            answers: ['James Blunt', 'Ed Sheeran', 'Sam Smith', 'Coldplay'],
            correctAnswer: 'James Blunt',
            category: '',
            type: 'trivia',
          },
          {
            level: '',
            question:
              'Which 2004 comedy follows a self-absorbed 1970s San Diego news anchor navigating his quirky newsroom and rival reporters?',
            unlockedClue: '',
            answers: ['Anchorman', 'The 40-Year-Old Virgin', 'Office Space', 'Superbad'],
            correctAnswer: 'Anchorman',
            category: '',
            type: 'trivia',
          },
          {
            level: '',
            question:
              'Which 2009 Quentin Tarantino film features Brad Pitt, B.J. Novak, Diane Kruger, and Christoph Waltz in a World War II revenge plot?',
            unlockedClue: '',
            answers: [
              'Inglourious Basterds',
              'Pulp Fiction',
              'Django Unchained',
              'Once Upon a Time in Hollywood',
            ],
            correctAnswer: 'Inglourious Basterds',
            category: '',
            type: 'trivia',
          },
        ],
      },
    },
  });
};
