import clsx from 'clsx';
import { STREAKVALUES, useTrivia } from '../../hooks/useTrivia';
import { ACCENT_COLOR2, ACCENT_COLOR6 } from '../../helpers/colors';
import { useEffect, useRef, useState } from 'react';
import { BUTTON_CLASS_ONLY_WIDTH } from '../../ui/Button';

const BankStreakInformation = () => {
  const { streak, type, cluesObtained } = useTrivia();

  if (type === 'dc') {
    return (
      <div
        className={clsx(
          `flex flex-1 min-h-12 flex-wrap ${cluesObtained.length === 0 ? 'justify-start' : 'justify-between'} items-center box-border gap-0.5`,
          BUTTON_CLASS_ONLY_WIDTH
        )}
      >
        {cluesObtained.map((value, index) => (
          <span
            key={index}
            className={clsx(
              'w-auto border-2 box-border mb-1 px-[2px] border-black/60 opacity-55 duration-200 ease-in-out transition-all rounded-lg text-sm text-center flex justify-center items-center',
              `opacity-100`
            )}
            style={{ backgroundColor: ACCENT_COLOR6 }}
          >
            <span className="truncate max-w-full sm:text-lg lg:text-xl">{value}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'w-11/12 h-10 flex justify-between items-center gap-1',
        BUTTON_CLASS_ONLY_WIDTH
      )}
    >
      {STREAKVALUES.map((value, index) => (
        <span
          key={index}
          className={clsx(
            'flex-1 border-2 border-black/60 opacity-55 duration-200 ease-in-out transition-all rounded-lg text-center flex justify-center items-center lg:text-xl',
            streak >= index && index > 0 && `opacity-100`,
            index === 0 && 'opacity-100 flex-1'
          )}
          style={{
            backgroundColor: ACCENT_COLOR6,
            transform:
              streak >= index && index > 0 ? `translateX(-${index * 65}%)` : 'translateX(0)',
          }}
        >
          ${value}
        </span>
      ))}
    </div>
  );
};

const DCStreak = () => {
  const { streak } = useTrivia();
  const [animate, setAnimate] = useState<boolean>(false);
  const prevStreak = useRef<number>(streak || 0);
  useEffect(() => {
    if (streak > prevStreak.current) {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 100);
    }
  }, [streak]);

  return (
    <div className={clsx('w-11/12 h-6 flex justify-center items-center')}>
      <span
        className={clsx(
          'transition-all duration-100 ease-in-out rounded-xl border-4 px-4 border-black/60 text-xl lg:text-3xl',
          animate && 'scale-115'
        )}
        style={{ backgroundColor: ACCENT_COLOR2 }}
      >
        x{streak}
      </span>
    </div>
  );
};

export default BankStreakInformation;
