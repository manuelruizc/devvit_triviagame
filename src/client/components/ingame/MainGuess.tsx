import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTrivia } from '../../hooks/useTrivia';
import clsx from 'clsx';

function getRandomFromSet(set: Set<number>, k: number): number[] {
  const arr = Array.from(set); // convert Set to Array
  const result = new Set<number>();

  while (result.size < k && result.size < arr.length) {
    const randIndex = Math.floor(Math.random() * arr.length);
    result.add(Number(arr[randIndex]));
  }

  return Array.from(result);
}

const MainGuess = () => {
  const {
    trivia: { mainAnswer, mainQuestion, category },
    handleMainGuessAnswer,
    onHintUsed,
  } = useTrivia();
  const [showLength, setShowLength] = useState<boolean>(false);
  const [userGuess, setUserGuess] = useState<string[]>([]);
  const [userGuessWhenClueIsEnabled, setUserGuessWhenClueIsEnabled] = useState<string[]>([]);
  const [lastKeyPressed, setLastKeyPressed] = useState<any>('');
  const [wrongGuess, setWrongGuess] = useState<boolean>(false);
  const [usingOneLetterClue, setUsingOneLetterClue] = useState<boolean>(false);
  const [usingThreeLetterClue, setUsingThreeLetterClue] = useState<
    'enabled' | 'not-available' | 'unabled'
  >(mainAnswer.length <= 4 ? 'not-available' : 'unabled');
  const letterCluesAvailableSlots = useRef<Set<number>>(new Set());
  const revealedLetterIndexes = useRef<Set<number>>(new Set());

  const handleWrongMainGuessAnswer = useCallback(() => {
    setWrongGuess(true);
    setTimeout(() => {
      setWrongGuess(false);
    }, 300);
  }, []);

  const revealOneLetter = useCallback(() => {
    setUsingOneLetterClue(true);
    onHintUsed();
    const items = Array.from(letterCluesAvailableSlots.current); // convert Set to Array
    const randomIndex = Math.floor(Math.random() * items.length);
    const key = items[randomIndex] || 0;
    // const key = 10;
    revealedLetterIndexes.current.add(key);
    letterCluesAvailableSlots.current.delete(key);
    if (key === 0) {
      setUserGuessWhenClueIsEnabled([mainAnswer.charAt(0)]);
    }
    setUserGuess((prev) => {
      prev[key] = mainAnswer.charAt(key);
      return [...prev];
    });
  }, [mainAnswer]);

  const revealRandomLetters = useCallback(() => {
    onHintUsed();
    setUsingThreeLetterClue('enabled');
    const randomIndexes = getRandomFromSet(letterCluesAvailableSlots.current, 3);

    for (const index of randomIndexes) {
      revealedLetterIndexes.current.add(index);
      letterCluesAvailableSlots.current.delete(index);
      if (index === 0) {
        setUserGuessWhenClueIsEnabled([mainAnswer.charAt(0)]);
      }
    }
    setUserGuess((prev) => {
      for (const index of randomIndexes) {
        prev[index] = mainAnswer.charAt(index);
      }
      return [...prev];
    });
  }, []);

  useEffect(() => {
    for (let i = 0; i < mainAnswer.length; i++) {
      const c = mainAnswer.charAt(i);
      if (c === ' ') continue;
      letterCluesAvailableSlots.current.add(i);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        if ((e.key === ' ' && lastKeyPressed === ' ') || e.key === '~') return;
        if (showLength) {
          if (e.key !== ' ') {
            setUserGuessWhenClueIsEnabled((prev) => {
              let arr = [...prev, e.key];
              const nextIndex = arr.length;
              if (nextIndex > userGuess.length) return prev;
              if (nextIndex === userGuess.length) return [...arr];
              if (userGuess[nextIndex - 1] === ' ') {
                let temp = [...prev, ' ', e.key];
                while (
                  temp.length < userGuess.length &&
                  (revealedLetterIndexes.current.has(temp.length) ||
                    mainAnswer.charAt(temp.length) === ' ')
                ) {
                  const index = temp.length;
                  temp.push(mainAnswer.charAt(index));
                }
                return [...temp];
              }
              if (userGuess[nextIndex] === ' ') {
                let temp = [...prev, e.key, ' '];
                while (
                  temp.length < userGuess.length &&
                  (revealedLetterIndexes.current.has(temp.length) ||
                    mainAnswer.charAt(temp.length) === ' ')
                ) {
                  const index = temp.length;
                  temp.push(mainAnswer.charAt(index));
                }
                return [...temp];
              }

              let temp = [...prev, e.key];
              while (
                temp.length < userGuess.length &&
                (revealedLetterIndexes.current.has(temp.length) ||
                  mainAnswer.charAt(temp.length) === ' ')
              ) {
                const index = temp.length;
                temp.push(mainAnswer.charAt(index));
              }

              return [...temp];
            });
          }
        } else {
          setUserGuess((prev) => [...prev, e.key]);
        }
        setLastKeyPressed(e.key);
      } else if (e.key === 'Backspace') {
        if (showLength) {
          setUserGuessWhenClueIsEnabled((prev) => {
            const isFirst = prev.length === 1;
            if (isFirst && revealedLetterIndexes.current.has(0)) return prev;
            const len = prev.length;

            // no space behind
            let temp = [...prev.slice(0, -1)];
            console.log({
              len,
              arr: userGuess[temp.length],
              ss: userGuess,
              mainAnswer,
              second: true,
              set: revealedLetterIndexes.current,
            });
            while (
              temp.length > 0 &&
              (revealedLetterIndexes.current.has(temp.length) || userGuess[temp.length] === ' ')
            ) {
              temp.pop();
            }
            return [...temp];
          });
          // end of showLegnth lol
        } else {
          setUserGuess((prev) => [...prev.slice(0, -1)]);
        }
        setLastKeyPressed(e.key);
      } else if (e.key === 'Enter') {
        if (showLength) {
          setLastKeyPressed(e.key);
          return;
        } else {
          const isCorrect = handleMainGuessAnswer(userGuess.join(''), mainAnswer, category);
          if (!isCorrect) handleWrongMainGuessAnswer();
        }
        setLastKeyPressed(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userGuess, lastKeyPressed, userGuessWhenClueIsEnabled, showLength]);

  const enableLengthClue = useCallback(() => {
    setShowLength(true);
    onHintUsed();
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

  useEffect(() => {
    if (
      (userGuessWhenClueIsEnabled.length === mainAnswer.length && showLength) ||
      userGuess.length === mainAnswer.length
    ) {
      const isCorrect = handleMainGuessAnswer(
        userGuessWhenClueIsEnabled.join(''),
        mainAnswer.toLocaleLowerCase(),
        category
      );
      if (!isCorrect) handleWrongMainGuessAnswer();
    }
  }, [userGuessWhenClueIsEnabled, userGuess]);

  return (
    <>
      <div className="w-full flex flex-col justify-start items-center">
        <span>Category: {category}</span>
        {showLength && (
          <>
            <button disabled={usingOneLetterClue} onClick={revealOneLetter}>
              Reveal one letter
            </button>
            <button disabled={usingOneLetterClue} onClick={revealRandomLetters}>
              Reveal Many letter
            </button>
          </>
        )}
        <span>Main Guess: {mainQuestion}</span>
        {showLength ? (
          mainAnswer.length
        ) : (
          <button onClick={enableLengthClue}>Get answer length</button>
        )}

        <div className="w-full flex justify-center items-center bg-sky-400 flex-wrap">
          {(() => {
            let runningIndex = 0;

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
                          wrongGuess={wrongGuess}
                          isRevealed={revealedLetterIndexes.current.has(absoluteIndex)}
                        />
                      );
                    })}
                  </div>
                );
              }
              const absoluteIndex = runningIndex;
              runningIndex++;

              return (
                <LetterBlock
                  key={`space-${wordIdx}`}
                  letter=" "
                  activeBorder={onLengthClueIndex === absoluteIndex}
                  wrongGuess={wrongGuess}
                  isRevealed={false}
                />
              );
            });
          })()}
        </div>
      </div>
    </>
  );
};

const LetterBlock = ({
  letter,
  activeBorder,
  wrongGuess,
  isRevealed,
}: {
  letter: string;
  activeBorder: boolean;
  wrongGuess: boolean;
  isRevealed: boolean;
}) => {
  if (letter === '~')
    return (
      <div
        className={clsx(
          'w-6 h-6 flex justify-center items-center mx-1 my-2 bg-blue-500 text-white',
          activeBorder && 'border',
          isRevealed && 'bg-green-400'
        )}
      />
    );
  if (letter === ' ')
    return (
      <div
        className={clsx(
          'w-6 h-6 flex justify-center items-center mx-1 my-2 bg-transparent text-white',
          isRevealed && 'bg-green-400'
        )}
      />
    );
  return (
    <div
      className={clsx(
        'w-6 h-6 flex justify-center items-center mx-1 my-1 bg-blue-500 text-white transition-all duration-300 ease-in-out',
        activeBorder && 'border',
        wrongGuess && 'bg-red-500',
        isRevealed && 'bg-green-400'
      )}
    >
      {letter.toUpperCase()}
    </div>
  );
};

export default MainGuess;
