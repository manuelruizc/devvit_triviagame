import { useEffect, useRef, useState } from 'react';
import { useTrivia } from '../../../hooks/useTrivia';

const Idle = () => {
  const { startTimer } = useTrivia();
  const [seconds, setSeconds] = useState<number>(3);
  const secondsRef = useRef<number>(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      secondsRef.current -= 1;
      setSeconds(secondsRef.current);
      if (secondsRef.current === 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        timerRef.current = null;
        startTimer('trivia');
      }
    }, 1000);
  });
  return (
    <div className="w-full h-full bg-orange-300 flex flex-col justify-center items-center">
      <span>Let's get ready to rumble!!!</span>
      <span className="text-xl">{seconds}</span>
    </div>
  );
};

export default Idle;
