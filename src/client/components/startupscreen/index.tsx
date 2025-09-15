import clsx from 'clsx';
import React from 'react';
import { useAppState } from '../../hooks/useAppState';

const StartupScreen = () => {
  const { isReady } = useAppState();
  return (
    <div
      className={clsx(
        'absolute top-0 left-0 w-full h-full bg-amber-600 flex justify-center items-center duration-300 transition-all ease-in-out',
        isReady && 'opacity-0 pointer-events-none'
      )}
    >
      <span>Loading...</span>
    </div>
  );
};

export default StartupScreen;
