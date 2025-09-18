import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { REDDIT_RED } from '../../helpers/colors';
import { playSound } from '../../helpers/sounds';

const StartupScreen = () => {
  const { isReady } = useAppState();
  const [catAnimation, setCatAnimation] = useState<boolean>(false);
  const [stopRender, setStopRender] = useState<boolean>(false);

  useEffect(() => {
    if (isReady) {
      setTimeout(() => {
        setCatAnimation(true);
        setTimeout(() => {
          setStopRender(true);
        }, 400);
      }, 900);
    }
  }, [isReady]);

  if (stopRender) return null;

  return (
    <div
      className={clsx(
        'absolute top-0 left-0 w-full h-full flex justify-center items-center duration-300 transition-all ease-in-out !overflow-y-hidden overflow-x-hidden',
        isReady && catAnimation && 'opacity-0 pointer-events-none'
      )}
      style={{ backgroundColor: REDDIT_RED }}
    >
      <div className={'w-full h-full flex justify-center items-center'}>
        <div
          className={'w-full h-full'}
          style={{
            backgroundImage: 'url(/cat/cat-sit-smiling-blink-two-eyes.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '80%',
            height: '80%',
          }}
        />
      </div>
      <div className={'absolute z-10 top-0 left-0 w-full h-full flex justify-center items-center'}>
        {!isReady ? (
          <div
            className={'w-full h-full'}
            style={{
              backgroundImage: 'url(/cat/cat-sit-smiling.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '80%',
              height: '80%',
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default StartupScreen;
