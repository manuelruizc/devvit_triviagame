import clsx from 'clsx';
import { DC_CLUE_COST, FP_CLUE_COST, useTrivia } from '../../hooks/useTrivia';
import { useMemo } from 'react';

const TopLogo = ({
  type,
  text,
}: {
  type: 'coins' | 'time' | 'bank' | 'points';
  text: string | number;
}) => {
  const iconSrc = useMemo<string>(() => {
    let src = '/icons/';
    if (type === 'coins') src += 'coins.png';
    else if (type === 'time') src += 'clock.png';
    else if (type === 'points') src += 'fish.png';
    else src += 'moneybag.png';
    return src;
  }, []);
  return (
    <div className="flex justify-start items-center">
      <img className={clsx('w-20 h-20 object-contain')} src={iconSrc} />
      <span>{text}</span>
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
    type,
    saveToBank,
    startTimer,
    activateClue,
  } = useTrivia();
  const clueCost = useMemo(() => (type === 'dc' ? DC_CLUE_COST : FP_CLUE_COST), [type]);
  const canBuyClue = useMemo(() => {
    return coins >= clueCost;
  }, [type, coins]);

  return (
    <div className={'w-full flex justify-center items-center py-12'}>
      {/* for DC */}
      <TopLogo text={time} type="time" />
      <TopLogo text={coins} type="coins" />
      <TopLogo text={points} type="points" />
      {/* time */}
      {/* coins */}
      {/* streak */}
    </div>
  );
};

{
  /* <button className="cursor-pointer my-4" onClick={saveToBank}>
        Bank it
      </button> */
}
{
  /* <div className="w-[60%] my-12">
        {questions.map((item, index) => (
          <span
            className={clsx(
              'text-xs',
              'px-4 py-2 bg-purple-300 active:bg-purple-900 transition-all duration-300 ease-in-out',
              currentQuestionIndex === index && 'bg-purple-500'
            )}
          >
            {item.level}
          </span>
        ))}
      </div> */
}
// <span>{time}</span>
// <button
//   disabled={!canBuyClue}
//   className={clsx('cursor-pointer my-4', !canBuyClue && 'opacity-20')}
//   onClick={() => activateClue(clueCost)}
// >
//   {canBuyClue ? 'Get Clue for ' + clueCost : "Can't get clue"}
// </button>
// <span>{clueIsActive ? 'Clue is active' : 'Clue not active'}</span>
// <span>Streak: {streak}</span>
// <span>Coins: {coins}</span>
// <span>Saved: {coinsBanked}</span>

export default QuestionSelectorTopbar;
