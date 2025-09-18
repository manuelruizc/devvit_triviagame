import clsx from 'clsx';
import { DC_CLUE_COST, FP_CLUE_COST, useTrivia } from '../../hooks/useTrivia';
import { useMemo } from 'react';
import { ACCENT_COLOR6 } from '../../helpers/colors';
import BankStreakInformation from './bankstreak';

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
        `flex justify-start items-center px-1.5 rounded-lg h-8`,
        isAtTopbar ? 'lg:h-12' : 'lg:h-32',
        className,
        useBadgeStyle && 'border-2 border-black/60'
      )}
      style={{ backgroundColor: useBadgeStyle ? ACCENT_COLOR6 : undefined }}
    >
      <img
        className={clsx(
          type === 'coins'
            ? 'w-6 h-6 object-contain object-center mr-1 lg:w-8 lg:h-8'
            : 'w-6 h-6 object-contain object-center mr-1',
          isAtTopbar ? 'lg:w-10 lg:h-10' : type !== 'coins' ? 'lg:w-24 lg:h-24' : ''
        )}
        src={iconSrc}
      />
      <span className={clsx(type === 'time' ? 'text-xl lg:text-3xl' : 'text-lg lg:text-xl')}>
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
  const clueCost = useMemo(() => (type === 'dc' ? DC_CLUE_COST : FP_CLUE_COST), [type]);
  const canBuyClue = useMemo(() => {
    return coins >= clueCost;
  }, [type, coins]);
  const TIME_THRESHOLD = useMemo(() => (type === 'dc' ? 5 : 10), [type]);

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
