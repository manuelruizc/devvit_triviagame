import { useCallback, useMemo } from 'react';
import { useTrivia } from '../../hooks/useTrivia';
import MainGuess from './MainGuess';
import clsx from 'clsx';

function shuffleArray(arr: any[]) {
  const array = [...arr]; // copy array to avoid mutating original
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // swap
  }
  return array;
}

function getRandomExcluding(n: number, x: number) {
  let r;
  do {
    r = Math.floor(Math.random() * (n + 1));
  } while (r === x);

  return r;
}

const Questions = () => {
  const {
    currentQuestionIndex,
    trivia: { questions },
    handleQuestionAnswer,
    gameStatus,
    clueIsActive,
  } = useTrivia();
  const question = questions[currentQuestionIndex];
  const randomlySortedAnswers = useMemo(() => {
    if (!question) return null;
    const arr = shuffleArray(question.answers);
    return arr;
  }, [question]);
  const randomIndexSet = useMemo(() => {
    if (randomlySortedAnswers === null) return new Set();
    if (!clueIsActive) return new Set();
    let idx = -1;
    for (let i = 0; i < randomlySortedAnswers.length; i++) {
      if (randomlySortedAnswers[i] === question?.correctAnswer) {
        idx = i;
      }
    }
    const i = getRandomExcluding(randomlySortedAnswers.length - 1, idx);
    return new Set([i, idx]);
  }, [randomlySortedAnswers, clueIsActive]);
  if (!question || !randomlySortedAnswers || gameStatus === 'main-guess') return <MainGuess />;

  return (
    <div className="w-full flex flex-col justify-start items-center">
      <span>{question.question}</span>
      {randomlySortedAnswers.map((answer, index) => (
        <button
          disabled={clueIsActive && !randomIndexSet.has(index)}
          onClick={() => handleQuestionAnswer(question, answer, question.category)}
          key={answer}
          className={clsx(
            'my-4 bg-purple-500 active:bg-purple-700 rounded-xl',
            clueIsActive && !randomIndexSet.has(index) && 'opacity-10'
          )}
        >
          {answer}
        </button>
      ))}
    </div>
  );
};

export default Questions;
