import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAppState } from '../../../hooks/useAppState';
import { useTrivia } from '../../../hooks/useTrivia';
import {
  ACCENT_COLOR,
  ACCENT_COLOR2,
  ACCENT_COLOR3,
  ACCENT_COLOR6,
  ERROR_COLOR,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  SUCCESS_COLOR,
} from '../../../helpers/colors';
import clsx from 'clsx';
import { TopLogo } from '../QuestionSelectorTopbar';
import { Button, BUTTON_CLASS } from '../../../ui/Button';

const SuccessFinish = ({ finished }: { finished: boolean }) => {
  const { goBack, data, isReady } = useAppState();
  const { coinsBanked, type, correctAnswersCount, trivia } = useTrivia();
  const [animate, setAnimate] = useState<boolean>(false);
  const rendered = useRef<boolean>(false);

  const title = useMemo(() => {
    if (type === 'fp') return 'Whiskers Down!';
    if (finished) return 'That’s the one!';
    return 'Time’s Up!';
  }, [type, finished]);

  const catPhrase = useMemo(() => {
    if (type === 'dc') {
      if (correctAnswersCount === trivia.questions.length + 1)
        return 'Purr-fect score! You didn’t forget a single thing — I’m so proud of you!';
      if (finished) return 'Purr-fect! My whiskers tingled and somehow we guessed it!';
      if (!finished)
        return 'Oops… that didn’t go as smoothly as I hoped. I’ll just curl up for a nap and try again later';
    }
    if (coinsBanked > 64 * 2.5) {
      return 'Me-WOW! You’ve got skills sharper than my claws';
    } else if (coinsBanked < 40) {
      return 'Even the best kittens start small. Let’s pounce on the next game!';
    } else if (coinsBanked === 0) {
      return 'No points this time… but hey, at least we didn’t lose any fur!';
    }
    return 'Smooth moves! Not too shabby at all.';
  }, [finished, type, coinsBanked, correctAnswersCount, trivia]);

  useEffect(() => {
    if (rendered.current) return;
    rendered.current = true;
    setAnimate(true);
  }, []);

  if (!isReady) return null;

  return (
    <div
      className={clsx(
        'w-full h-full flex justify-center items-start duration-500 transition-all ease-in',
        animate ? 'opacity-100' : 'opacity-0'
      )}
      style={{ backgroundColor: finished ? PRIMARY_COLOR : ERROR_COLOR }}
    >
      <div className="w-full h-full flex-1 flex flex-col justify-start items-center max-w-[1250px]">
        <div
          className={clsx(
            'w-10/12 h-full flex-1 flex flex-col justify-center items-center lg:w-full'
          )}
        >
          <span
            className="text-2xl md:text-4xl xl:text-6xl font-extrabold max-w-10/12 border-4 p-2 rounded-2xl"
            style={{ backgroundColor: ACCENT_COLOR3, borderColor: SECONDARY_COLOR }}
          >
            {title.toUpperCase()}
          </span>
          <div className={clsx('h-5/12 aspect-square lg:6/12 xl:7/12')}>
            <img
              src="/cat/cat-in-circle.png"
              className="w-full h-full object-contain object-center"
            />
          </div>
          <span
            className="md:text-lg lg:text-xl xl:text-2xl 2xl:text-4xl max-w-full text-center border-4 lg:p-6 rounded-2xl w-10/12 md:5/12 lg:8/12 xl:6/12 py-6 px-7"
            style={{ backgroundColor: ACCENT_COLOR3, borderColor: SECONDARY_COLOR }}
          >
            {catPhrase}
          </span>
          <RoundStats finished={finished} />
          <span>
            {data.allTimeDCRank} | {data.allTimeFPRank} | {data.allTimeFPRank}
          </span>
          <Button
            onClick={goBack}
            title={'GO BACK'}
            className={clsx(BUTTON_CLASS, 'mt-4')}
            backgroundColor={ACCENT_COLOR}
          />
        </div>
      </div>
    </div>
  );
};

const RoundStats = ({ finished }: { finished: boolean }) => {
  const { type, coins, coinsBanked, points, correctAnswersCount } = useTrivia();
  if (type === 'dc') {
    return (
      <div className="flex w-10/12 md:5/12 lg:8/12 xl:6/12 justify-between items-center mt-3">
        <TopLogo isAtTopbar={false} type="points" text={points} />
        <TopLogo isAtTopbar={false} type="coins" text={coins} />
        <TopLogo isAtTopbar={false} type="correct" text={correctAnswersCount} />
      </div>
    );
  }
  return (
    <div className="flex w-10/12 md:5/12 lg:8/12 xl:6/12 justify-between items-center mt-3">
      <TopLogo isAtTopbar={false} type="coins" text={coinsBanked} />
      <TopLogo isAtTopbar={false} type="correct" text={correctAnswersCount} />
    </div>
  );
};

export default SuccessFinish;
