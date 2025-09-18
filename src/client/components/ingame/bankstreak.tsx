import clsx from 'clsx';
import { STREAKVALUES, useTrivia } from '../../hooks/useTrivia';
import { ACCENT_COLOR2, ACCENT_COLOR6 } from '../../helpers/colors';
import { useEffect, useRef, useState } from 'react';

const BankStreakInformation = () => {
  const { streak, type } = useTrivia();

  if (type === 'dc') return null;

  return (
    <div className={clsx('w-11/12 h-10 flex justify-between items-center gap-1')}>
      {STREAKVALUES.map((value, index) => (
        <span
          key={index}
          className={clsx(
            'flex-1 border-4 border-black/60 opacity-55 duration-200 ease-in-out transition-all rounded-xl text-center flex justify-center items-center lg:text-xl',
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
