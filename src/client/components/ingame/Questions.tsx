import React, { useState } from 'react';
import { useTrivia } from './context';

const Questions = () => {
  const {
    currentQuestionIndex,
    trivia: { questions },
    handleQuestionAnswer,
    gameStatus,
  } = useTrivia();
  const question = questions[currentQuestionIndex];
  if (!question || gameStatus === 'main-guess') return <MainGuess />;
  return (
    <div className="w-full flex flex-col justify-start items-center">
      <span>{question.question}</span>
      {question.answers.map((answer) => (
        <button
          onClick={() => handleQuestionAnswer(question, answer)}
          key={answer}
          className="my-4 bg-purple-500 active:bg-purple-700 rounded-xl"
        >
          {answer}
        </button>
      ))}
    </div>
  );
};

const MainGuess = () => {
  const {
    trivia: { mainAnswer, mainQuestion },
  } = useTrivia();
  const [showLength, setShowLength] = useState<boolean>(false);
  return (
    <div className="w-full flex flex-col justify-start items-center">
      <span>Main Guess: {mainQuestion}</span>
      {/* <button>Get extra clue</button> */}
      {showLength ? (
        mainAnswer.length
      ) : (
        <button onClick={() => setShowLength(true)}>Get answer length</button>
      )}
    </div>
  );
};

export default Questions;
