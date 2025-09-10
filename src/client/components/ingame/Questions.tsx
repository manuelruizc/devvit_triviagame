import React from 'react';
import { Question } from '.';

const Questions = ({ question }: { question?: Question | undefined }) => {
  if (!question) return null;
  return (
    <div className="w-full flex flex-col justify-start items-center">
      <span>{question.question}</span>
      {question.answers.map((answer) => (
        <button key={answer} className="my-4 bg-purple-500 active:bg-purple-700 rounded-xl">
          {answer}
        </button>
      ))}
    </div>
  );
};

export default Questions;
