import clsx from 'clsx';
import { useTrivia } from '../../hooks/useTrivia';

const QuestionSelectorTopbar = ({}: {}) => {
  const {
    trivia: { questions },
    currentQuestionIndex,
    time,
    points,
    gameStatus,
    coins,
    coinsBanked,
    streak,
    saveToBank,
    startTimer,
  } = useTrivia();
  return (
    <div className={'w-full flex flex-col justify-center items-center py-12'}>
      <button className="cursor-pointer my-4" onClick={saveToBank}>
        Bank it
      </button>
      {/* <div className="w-[60%] my-12">
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
      </div> */}
      <span>{time}</span>
      <span>Streak: {streak}</span>
      <span>Coins: {coins}</span>
      <span>Saved: {coinsBanked}</span>
    </div>
  );
};

export default QuestionSelectorTopbar;
