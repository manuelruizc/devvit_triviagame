import React, { useState } from 'react';
import Questions from './Questions';
import QuestionSelectorTopbar from './QuestionSelectorTopbar';

export type QuestionLevels = 'easy' | 'medium' | 'hard';
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

const TRIVIA: DailyTrivia = {
  mainQuestion:
    'Grandpa remembers a tall structure connected to a world fair, but he just can’t recall its name...',
  mainAnswer: 'Eiffel Tower',
  answerLength: 12,
  questions: [
    {
      level: 'easy',
      question: 'Which country is famous for croissants and the city of Paris?',
      unlockedClue: 'The structure is located in that country.',
      answers: ['Italy', 'France', 'Germany', 'Spain'],
      correctAnswer: 'France',
    },
    {
      level: 'easy',
      question: "Which European city is nicknamed the 'City of Light'?",
      unlockedClue: 'The structure is in that city.',
      answers: ['Rome', 'London', 'Paris', 'Berlin'],
      correctAnswer: 'Paris',
    },
    {
      level: 'medium',
      question:
        'This structure was originally criticized but became a symbol of modern engineering. In which century was it built?',
      unlockedClue: 'It was constructed in the 19th century.',
      answers: ['17th', '18th', '19th', '20th'],
      correctAnswer: '19th',
    },
    {
      level: 'medium',
      question: 'Which global event in 1889 was the reason for building this structure?',
      unlockedClue: 'It was created for a world exposition.',
      answers: ['Olympic Games', 'World Expo', 'French Revolution', 'World Cup'],
      correctAnswer: 'World Expo',
    },
    {
      level: 'hard',
      question: 'At night, this structure becomes especially famous for what feature?',
      unlockedClue: 'It’s covered in thousands of sparkling lights.',
      answers: ['A fireworks show', 'Illuminating lights', 'Projected art', 'A moving beacon'],
      correctAnswer: 'Illuminating lights',
    },
  ],
};

const Ingame = () => {
  const { mainQuestion, questions } = TRIVIA;
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  return (
    <div className="w-full flex-1 flex">
      <div className="w-full flex flex-col justify-start items-center">
        <span className="w-max[90%] text-center">{mainQuestion}</span>
        <QuestionSelectorTopbar
          questionIndex={questionIndex}
          questions={questions}
          selectQuestionIndex={(index) => setQuestionIndex(index)}
        />
        <Questions question={questions[questionIndex]} />
      </div>
    </div>
  );
};

export default Ingame;
