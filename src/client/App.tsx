import { navigateTo } from '@devvit/web/client';
import { useCallback, useMemo, useRef, useState } from 'react';
import Ingame from './components/ingame';
// import { useCounter } from './hooks/useCounter';

export const App = () => {
  // const { count, username, loading, increment, decrement } = useCounter();
  const [_count, setCount] = useState<number>(0);
  const [milliseconds, setMilliseconds] = useState<number>(0);
  const timer = useRef<any>(null);
  const startTimer = useCallback(() => {
    if (!timer.current) {
      timer.current = setInterval(() => {
        setMilliseconds((prev) => prev + 123);
      }, 123);
    }
  }, []);

  const stopTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const formattedTime = useMemo(() => {
    const ms = milliseconds;
    let minutes = Math.floor(ms / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    let millisecondss = Math.floor((ms % 1000) / 10); // keep 2 digits

    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(seconds).padStart(2, '0');
    let formattedMilliseconds = String(millisecondss).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
  }, [milliseconds]);
  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen gap-4">
      <div className="w-full flex-1 bg-amber-300">
        <Ingame />
      </div>
      {/* <footer className="bottom-4 left-1/2 -translate-x-1/2 flex gap-3 text-[0.8em] text-gray-600">
        <button
          className="cursor-pointer"
          onClick={() => navigateTo('https://developers.reddit.com/docs')}
        >
          Docs
        </button>
        <span className="text-gray-300">|</span>
        <button
          className="cursor-pointer"
          onClick={() => navigateTo('https://www.reddit.com/r/Devvit')}
        >
          r/Devvit
        </button>
        <span className="text-gray-300">|</span>
        <button
          className="cursor-pointer"
          onClick={() => navigateTo('https://discord.com/invite/R7yu2wh9Qz')}
        >
          Discord
        </button>
      </footer> */}
    </div>
  );
};
