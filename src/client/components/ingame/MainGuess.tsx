import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DC_CLUE_COST, useTrivia } from '../../hooks/useTrivia';
import clsx from 'clsx';
import LetterBlock from './mainguess/lettterblock';
import { Button, BUTTON_CLASS_NO_TEXT, BUTTON_CLASS_ONLY_WIDTH } from '../../ui/Button';
import { ACCENT_COLOR3 } from '../../helpers/colors';
import SpeechBubble from '../../ui/speechbubble';
import { TriviaHelperButton } from './helpersbuttons';
import MobileKeyboard from '../../ui/keyboard';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    type,
    clueIsActive,
    activateClue,
    coins,
  } = useTrivia();
  const clueCost = DC_CLUE_COST;
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

  // const revealOneLetter = useCallback(() => {
  //   setUsingOneLetterClue(true);
  //   onHintUsed();
  //   const items = Array.from(letterCluesAvailableSlots.current); // convert Set to Array
  //   const randomIndex = Math.floor(Math.random() * items.length);
  //   const key = items[randomIndex] || 0;
  //   // const key = 10;
  //   revealedLetterIndexes.current.add(key);
  //   letterCluesAvailableSlots.current.delete(key);
  //   if (key === 0) {
  //     setUserGuessWhenClueIsEnabled([mainAnswer.charAt(0)]);
  //   }
  //   setUserGuess((prev) => {
  //     prev[key] = mainAnswer.charAt(key);
  //     return [...prev];
  //   });
  // }, [mainAnswer]);

  const revealRandomLetters = useCallback(async () => {
    if (!showLength) {
      enableLengthClue();
      await sleep(250);
    }
    onHintUsed();
    setUsingThreeLetterClue('enabled');
    setShowLength(true);
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
  }, [showLength]);

  useEffect(() => {
    for (let i = 0; i < mainAnswer.length; i++) {
      const c = mainAnswer.charAt(i);
      if (c === ' ') continue;
      letterCluesAvailableSlots.current.add(i);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        if (e.key === ' ' && userGuess.length === 0) return;
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
    },
    [userGuess, lastKeyPressed, userGuessWhenClueIsEnabled, showLength]
  );

  useEffect(() => {
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
    if (userGuessWhenClueIsEnabled.length === mainAnswer.length && showLength) {
      const isCorrect = handleMainGuessAnswer(
        userGuessWhenClueIsEnabled.join(''),
        mainAnswer.toLocaleLowerCase(),
        category
      );
      if (!isCorrect) handleWrongMainGuessAnswer();
    }
    if (!showLength && userGuess.length === mainAnswer.length) {
      const isCorrect = handleMainGuessAnswer(
        userGuess.join(''),
        mainAnswer.toLocaleLowerCase(),
        category
      );
      if (!isCorrect) handleWrongMainGuessAnswer();
    }
  }, [userGuessWhenClueIsEnabled, userGuess, mainAnswer]);

  return (
    <>
      <div className="w-full flex flex-1 flex-col justify-start items-center">
        <div className={clsx(BUTTON_CLASS_NO_TEXT, 'my-6')}>
          <SpeechBubble noTail text={mainQuestion} noAnimation />
        </div>
        <div
          id="here"
          className={clsx(
            'flex flex-1 justify-center items-center flex-wrap rounded-lg py-1 px-3',
            BUTTON_CLASS_ONLY_WIDTH
          )}
          style={{ backgroundColor: ACCENT_COLOR3 }}
        >
          {(() => {
            let runningIndex = 0;

            return userGuessArray.map((word, wordIdx) => {
              if (word !== ' ') {
                return (
                  <div
                    key={`${word}-${wordIdx}`}
                    className="flex max-w-full flex-wrap justify-start items-center"
                  >
                    {word.split('').map((letter) => {
                      const absoluteIndex = runningIndex;
                      runningIndex++;

                      return (
                        <LetterBlock
                          key={`${letter}-${absoluteIndex}`}
                          index={absoluteIndex}
                          letter={letter === '~' ? '~' : letter}
                          activeBorder={onLengthClueIndex === absoluteIndex}
                          wrongGuess={wrongGuess}
                          isRevealed={revealedLetterIndexes.current.has(absoluteIndex)}
                          showLength={showLength}
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
                  showLength={showLength}
                  index={absoluteIndex}
                  key={`space-${absoluteIndex}`}
                  letter=" "
                  activeBorder={onLengthClueIndex === absoluteIndex}
                  wrongGuess={wrongGuess}
                  isRevealed={false}
                />
              );
            });
          })()}
          {!showLength && (
            <div
              className="border-b-2 w-3 h-6"
              style={{ animation: 'caretblink 0.7s steps(1, start) infinite' }}
            />
          )}
        </div>
        <div className={clsx('flex flex-1 justify-between items-center', BUTTON_CLASS_ONLY_WIDTH)}>
          <TriviaHelperButton
            disabled={showLength || clueCost > coins}
            onClick={enableLengthClue}
            cost={clueCost}
            icon="/icons/length.png"
          />
          <TriviaHelperButton
            disabled={usingThreeLetterClue === 'enabled' || clueCost * 2 > coins}
            onClick={() => {
              if (usingThreeLetterClue === 'enabled') return;
              if (clueCost * 2 > coins) return;
              revealRandomLetters();
              activateClue(clueCost * 2);
            }}
            cost={clueCost * 2}
            icon="/icons/reveal.png"
          />
        </div>
        <MobileKeyboard
          onKeyPress={(key) => {
            let realKey = key;
            if (key === 'SPACE') realKey = '';
            else if (key === 'BACKSPACE') realKey = 'Backspace';
            const simulatedEvent = new KeyboardEvent('keydown', {
              key: realKey,
              code: 'KeyA',
              bubbles: true,
              cancelable: true,
            });
            handleKeyDown(simulatedEvent);
          }}
        />
      </div>
    </>
  );
};

export default MainGuess;
