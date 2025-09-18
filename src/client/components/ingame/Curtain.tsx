import clsx from 'clsx';
import { useTrivia } from '../../hooks/useTrivia';
import useLeaderboard from '../../hooks/useLeaderboard';
import { useEffect } from 'react';
import { useAPI } from '../../hooks/useAPI';

const Curtain = () => {
  const {
    gameStatus,
    trivia: {},
  } = useTrivia();

  return (
    <div
      className={clsx(
        'absolute top-0 left-0 w-full h-full transition-all duration-300 ease-in-out flex justify-center items-center pointer-events-none',
        gameStatus !== 'between' && 'pointer-events-auto'
      )}
    ></div>
  );
};

export default Curtain;
