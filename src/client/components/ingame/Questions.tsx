import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTrivia } from './context';
import clsx from 'clsx';

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
  const [userGuess, setUserGuess] = useState<string[]>([]);
  const [userGuessWhenClueIsEnabled, setUserGuessWhenClueIsEnabled] = useState<string[]>([]);
  const [lastKeyPressed, setLastKeyPressed] = useState<any>('');
  const [withClueIndex, setWithClueIndex] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        if ((e.key === ' ' && lastKeyPressed === ' ') || e.key === '~') return;
        if (showLength) {
          if (e.key !== ' ') {
            setUserGuessWhenClueIsEnabled((prev) => {
              const arr = [...prev, e.key];
              const nextIndex = arr.length;
              if (nextIndex > userGuess.length) return prev;
              if (nextIndex === userGuess.length) return [...prev, e.key];
              if (userGuess[nextIndex - 1] === ' ') return [...prev, ' ', e.key];
              if (userGuess[nextIndex] === ' ') return [...prev, e.key, ' '];
              return [...prev, e.key];
            });
          }
        } else {
          setUserGuess((prev) => [...prev, e.key]);
        }
        setLastKeyPressed(e.key);
      } else if (e.key === 'Backspace') {
        if (showLength) {
          setUserGuessWhenClueIsEnabled((prev) => {
            const currentOnSpace = userGuess[userGuess.length - 1] === ' ';
            if (currentOnSpace) return [...prev.slice(0, -2)];
            const len = prev.length;
            if (len >= 0 && userGuess[len - 1] === ' ') return [...prev.slice(0, -2)];
            return [...prev.slice(0, -1)];
            // if (userGuess[arr.length - 1] === ' ') return [...arr.slice(0, -1)];
            // return [...arr];
          });
        } else {
          setUserGuess((prev) => [...prev.slice(0, -1)]);
        }
        setLastKeyPressed(e.key);
      } else if (e.key === 'Enter') {
        if (showLength) {
          setUserGuessWhenClueIsEnabled((prev) => [...prev, '=>']);
        } else {
          setUserGuess((prev) => [...prev, '=>']);
        }
        setLastKeyPressed(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userGuess, lastKeyPressed, userGuessWhenClueIsEnabled, showLength]);

  const enableLengthClue = useCallback(() => {
    setShowLength(true);
    setUserGuess(mainAnswer.split('').map((c) => (c === ' ' ? c : '~')));
  }, [userGuess, mainAnswer]);

  const onLengthClueIndex = useMemo(() => {
    if (!showLength) return -1;
    return userGuessWhenClueIsEnabled.length;
  }, [showLength, userGuessWhenClueIsEnabled]);

  const userGuessArray = useMemo<string[]>(() => {
    let word = '';
    let arr = [];
    for (let i = 0; i < userGuess.length; i++) {
      const c = userGuess[i];
      if (showLength && userGuessWhenClueIsEnabled[i]) {
        if (userGuessWhenClueIsEnabled[i]) {
          word += userGuessWhenClueIsEnabled[i];
        }
        continue;
      }
      if (c === ' ') {
        arr.push(word);
        word = '';
        arr.push(' ');
      } else {
        word += c;
      }
    }
    if (word.length > 0) arr.push(word);
    return arr;
  }, [userGuess, showLength, userGuessWhenClueIsEnabled]);

  return (
    <>
      <div className="w-full flex flex-col justify-start items-center">
        <span>Main Guess: {mainQuestion}</span>
        {showLength ? (
          mainAnswer.length
        ) : (
          <button onClick={enableLengthClue}>Get answer length</button>
        )}

        <div className="w-full flex justify-center items-center bg-sky-400 flex-wrap">
          {(() => {
            let runningIndex = 0; // keeps absolute position across blocks

            return userGuessArray.map((word, wordIdx) => {
              if (word !== ' ') {
                return (
                  <div key={`${word}-${wordIdx}`} className="flex justify-start items-center">
                    {word.split('').map((letter) => {
                      const absoluteIndex = runningIndex;
                      runningIndex++;

                      return (
                        <LetterBlock
                          key={`${letter}-${absoluteIndex}`}
                          letter={letter === '~' ? '~' : letter}
                          activeBorder={onLengthClueIndex === absoluteIndex}
                        />
                      );
                    })}
                  </div>
                );
              }

              // Handle space as a block
              const absoluteIndex = runningIndex;
              runningIndex++;

              return (
                <LetterBlock
                  key={`space-${wordIdx}`}
                  letter=" "
                  activeBorder={onLengthClueIndex === absoluteIndex}
                />
              );
            });
          })()}
        </div>
      </div>
    </>
  );
};

const LetterBlock = ({ letter, activeBorder }: { letter: string; activeBorder: boolean }) => {
  if (letter === '~')
    return (
      <div
        className={clsx(
          'w-6 h-6 flex justify-center items-center mx-1 my-2 bg-blue-500 text-white',
          activeBorder && 'border'
        )}
      />
    );
  if (letter === ' ')
    return (
      <div
        className={clsx(
          'w-6 h-6 flex justify-center items-center mx-1 my-2 bg-transparent text-white'
        )}
      />
    );
  return (
    <div
      className={clsx(
        'w-6 h-6 flex justify-center items-center mx-1 my-1 bg-blue-500 text-white',
        activeBorder && 'border'
      )}
    >
      {letter}
    </div>
  );
};

export default Questions;
