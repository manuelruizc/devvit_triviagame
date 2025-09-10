import React from 'react';
import { Question } from '.';
import clsx from 'clsx';

const QuestionSelectorTopbar = ({
  questions,
  questionIndex,
  selectQuestionIndex,
}: {
  questions: Question[];
  questionIndex: number;
  selectQuestionIndex: (index: number) => void;
}) => {
  return (
    <div className={'w-full flex justify-center items-center'}>
      <div className="w-[60%]">
        {questions.map((item, index) => (
          <button
            onClick={() => selectQuestionIndex(index)}
            className={clsx(
              'text-xs',
              'px-8 py-4 bg-purple-300 active:bg-purple-900 transition-all duration-300 ease-in-out',
              questionIndex === index && 'bg-purple-600'
            )}
          >
            {item.level}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionSelectorTopbar;
