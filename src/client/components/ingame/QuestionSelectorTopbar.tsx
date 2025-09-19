import clsx from 'clsx';
import { DC_CLUE_COST, FP_CLUE_COST, useTrivia } from '../../hooks/useTrivia';
import { use, useEffect, useMemo, useRef } from 'react';
import { ACCENT_COLOR3, ACCENT_COLOR6, SECONDARY_COLOR } from '../../helpers/colors';
import BankStreakInformation from './bankstreak';
import { useAppState } from '../../hooks/useAppState';

export const TopLogo = ({
  type,
  text,
  className,
  useBadgeStyle = true,
  isAtTopbar = true,
}: {
  type: 'coins' | 'time' | 'bank' | 'points' | 'correct';
  text: string | number;
  isAtTopbar?: boolean;
  className?: string;
  useBadgeStyle?: boolean;
}) => {
  const iconSrc = useMemo<string>(() => {
    let src = '/icons/';
    if (type === 'coins') src += 'coins.png';
    else if (type === 'time') src += 'clock.png';
    else if (type === 'points') src += 'fish.png';
    else if (type === 'correct') src += 'checkmark.png';
    else src += 'moneybag.png';
    return src;
  }, []);
  return (
    <div
      className={clsx(
        `flex px-1.5 rounded-lg h-8`,
        isAtTopbar
          ? 'lg:h-12 justify-start items-center'
          : 'lg:h-20 lg:w-40 justify-center items-center border-2 lg:border-4',
        className,
        useBadgeStyle && isAtTopbar && 'border-2 border-black/60'
      )}
      style={{
        backgroundColor: !isAtTopbar ? ACCENT_COLOR3 : useBadgeStyle ? ACCENT_COLOR6 : undefined,
        borderColor: !isAtTopbar ? SECONDARY_COLOR : undefined,
      }}
    >
      <img
        className={clsx(
          type === 'coins' || !isAtTopbar
            ? 'w-6 h-6 object-contain object-center mr-1 lg:w-8 lg:h-8'
            : 'w-6 h-6 object-contain object-center mr-1',
          isAtTopbar
            ? 'lg:w-10 lg:h-10'
            : type !== 'coins' && isAtTopbar
              ? 'lg:w-9/12 lg:aspect-square'
              : ''
        )}
        src={iconSrc}
      />
      <span
        className={clsx(
          type === 'time'
            ? 'text-xl lg:text-3xl'
            : !isAtTopbar
              ? 'text-xl lg:text-2xl xl:text-3xl'
              : 'text-lg lg:text-xl'
        )}
      >
        {text}
      </span>
    </div>
  );
};

const QuestionSelectorTopbar = ({}: {}) => {
  const {
    trivia: { questions },
    currentQuestionIndex,
    time,
    points,
    gameStatus,
    clueIsActive,
    coins,
    coinsBanked,
    streak,
    seconds,
    type,
    saveToBank,
    startTimer,
    activateClue,
  } = useTrivia();
  const { playSound, stopAllSounds } = useAppState();
  const clueCost = useMemo(() => (type === 'dc' ? DC_CLUE_COST : FP_CLUE_COST), [type]);
  const canBuyClue = useMemo(() => {
    return coins >= clueCost;
  }, [type, coins]);
  const TIME_THRESHOLD = useMemo(() => (type === 'dc' ? 5 : 10), [type]);
  const soundPlayed = useRef<boolean>(false);

  useEffect(() => {
    if (seconds > TIME_THRESHOLD) {
      soundPlayed.current = false;
      return;
    }
    if (soundPlayed.current) return;
    if (seconds <= TIME_THRESHOLD) {
      soundPlayed.current = true;
      playSound('timeticking');
    }
  }, [TIME_THRESHOLD, seconds]);

  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, []);

  return (
    <div className={clsx('w-full flex flex-col justify-start items-center')}>
      <div
        className={clsx(
          'w-full flex justify-between items-center py-4',
          'lg:justify-between lg:w-full'
        )}
      >
        {/* for DC */}
        {type === 'dc' ? (
          <div className={clsx('flex justify-center items-center')}>
            <TopLogo text={coins} type="coins" className={clsx('mr-3 ml-3')} />
            <TopLogo text={points} type="points" />
          </div>
        ) : (
          <div className={clsx('flex justify-center items-center')}>
            <TopLogo text={coins} type="coins" className={clsx('mr-3 ml-3')} />
            <TopLogo text={coinsBanked} type="bank" />
          </div>
        )}
        <TopLogo
          text={time}
          type="time"
          className={clsx('mr-3', seconds <= TIME_THRESHOLD && 'animate-bounce')}
          useBadgeStyle={false}
        />
      </div>
      <BankStreakInformation />
    </div>
  );
};

export default QuestionSelectorTopbar;
