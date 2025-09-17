import { useCallback, useEffect, useMemo, useState } from 'react';
import { Question, useTrivia } from '../../hooks/useTrivia';
import MainGuess from './MainGuess';
import clsx from 'clsx';
import { Button, BUTTON_CLASS } from '../../ui/Button';
import { ERROR_COLOR, SECONDARY_COLOR, SUCCESS_COLOR } from '../../helpers/colors';

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

const checkIfAnswerIsCorrect = (userAnswer: string, realAnswer: string) => {
  return userAnswer === realAnswer;
};

const Questions = () => {
  const {
    currentQuestionIndex,
    trivia: { questions },
    handleQuestionAnswer,
    gameStatus,
    clueIsActive,
  } = useTrivia();
  const question = questions[currentQuestionIndex];
  const [playerAnswerIndex, setPlayerAnswerIndex] = useState<number>(-1);
  const randomlySortedAnswers = useMemo(() => {
    if (!question) return null;
    const arr = shuffleArray(question.answers);
    return arr;
  }, [question]);
  const randomIndexSet = useMemo<Set<number>>(() => {
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

  useEffect(() => {
    setPlayerAnswerIndex(-1);
  }, [currentQuestionIndex]);

  if (!question || !randomlySortedAnswers || gameStatus === 'main-guess') return <MainGuess />;

  return (
    <div className="w-full flex flex-col justify-start items-center">
      <span>{question.question}</span>
      {randomlySortedAnswers.map((answer, index) => (
        <TriviaButton
          key={answer + index}
          answer={answer}
          clueIsActive={clueIsActive}
          playerAnswerIndex={playerAnswerIndex}
          onClick={() => {
            handleQuestionAnswer(question, answer, question.category);
            setPlayerAnswerIndex(index);
          }}
          randomIndexSet={randomIndexSet}
          index={index}
          question={question}
        />
      ))}
    </div>
  );
};

const TriviaButton = ({
  answer,
  clueIsActive,
  onClick,
  index,
  playerAnswerIndex,
  randomIndexSet,
  question,
}: {
  answer: string;
  question: Question | undefined;
  onClick: () => void;
  clueIsActive: boolean;
  playerAnswerIndex: number;
  randomIndexSet: Set<number>;
  index: number;
}) => {
  const { gameStatus } = useTrivia();
  const ranOutOfTime = useMemo(() => gameStatus === 'between', [gameStatus]);
  const isCorrect = useMemo(
    () => checkIfAnswerIsCorrect(answer, question?.correctAnswer || ''),
    [answer, question]
  );
  const backgroundColor = useMemo(() => {
    if (!question) return '';
    if (playerAnswerIndex === index) {
      if (isCorrect) return SUCCESS_COLOR;
      return ERROR_COLOR;
    }
    if (isCorrect) return SUCCESS_COLOR;
    return '';
  }, [question, answer, playerAnswerIndex, isCorrect]);

  const renderButtonInnerLayer = useMemo(() => {
    if (playerAnswerIndex < 0 && !ranOutOfTime) return false;
    if (isCorrect) return true;
    return playerAnswerIndex === index;
  }, [isCorrect, playerAnswerIndex, index, ranOutOfTime]);

  const userAnswered = useMemo(() => playerAnswerIndex !== -1, [playerAnswerIndex]);

  const shouldHide = useMemo(
    () => clueIsActive && !randomIndexSet.has(index),
    [randomIndexSet, clueIsActive, index]
  );

  if (!question) return null;

  return (
    <Button
      key={answer}
      onClick={
        userAnswered
          ? undefined
          : () => {
              if (userAnswered) return;
              onClick();
            }
      }
      disabled={shouldHide}
      title={answer}
      className={clsx(
        BUTTON_CLASS,
        shouldHide &&
          'translate-x-[200%] opacity-0 transition-all duration-200 ease-linear pointer-events-none'
      )}
      backgroundColor={SECONDARY_COLOR}
    >
      <div
        className={clsx(
          'absolute top-0 left-0 w-full h-full',
          renderButtonInnerLayer
            ? 'opacity-100 transition-all duration-200 ease-linear'
            : 'opacity-0'
        )}
        style={{
          backgroundColor,
        }}
      />
    </Button>
  );
};

export default Questions;
