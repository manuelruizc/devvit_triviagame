import { useMemo } from 'react';
import { useTrivia } from '../../hooks/useTrivia';
import MainGuess from './MainGuess';

function shuffleArray(arr: any[]) {
  const array = [...arr]; // copy array to avoid mutating original
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // swap
  }
  return array;
}

const Questions = () => {
  const {
    currentQuestionIndex,
    trivia: { questions },
    handleQuestionAnswer,
    gameStatus,
  } = useTrivia();
  const question = questions[currentQuestionIndex];
  const randomlySortedAnswers = useMemo(() => {
    if (!question) return null;
    const arr = shuffleArray(question.answers);
    return arr;
  }, [question]);
  if (!question || !randomlySortedAnswers || gameStatus === 'main-guess') return <MainGuess />;
  return (
    <div className="w-full flex flex-col justify-start items-center">
      <span>{question.question}</span>
      {randomlySortedAnswers.map((answer) => (
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

export default Questions;
