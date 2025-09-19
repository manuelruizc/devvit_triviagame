import { useCallback, useEffect, useRef, useState } from 'react';
import { useTrivia } from '../../../hooks/useTrivia';
import SpeechBubble from '../../../ui/speechbubble';
import clsx from 'clsx';
import GoBackButton from '../../../ui/GoBackButton';
import { useAppState } from '../../../hooks/useAppState';
import ScreenTitle from '../../../ui/screentitle';

const forgottenKittenTextDC =
  'Hey hooman 👋 it’s me, Forgotten Kitten 😼💭\nI was about to remember something… breakfast? Daily challenge? Who knows!?\n\nI need your braincells—answer my questions like an r/AskReddit post, and maybe together we’ll figure out what I keep forgetting.\nDon’t leave me hanging… let’s go before I forget again!\n\nRemember, every answer counts! 🧠✨';
const forgottenKittenTextFP =
  'Hey hooman 👋 it’s me, Forgotten Kitten 😼💭\nWanna try Free Play? Here’s the deal:\n\n⏱️ 1 minute timer! Answer as many questions as you can.\n✅ Every correct answer builds a chain.\n⚠️ Mess up and your unsaved chain is gone!\n🌟 Hit a perfect chain and it’s yours automatically!\n\nThink fast, answer quick, and let’s see how long your chain can go!';

// const text1 = `"aaaaaa`;
const text2 = "Ok, it's time. Let's do this. Good Luck";

const SPEED = 135;

const Idle = () => {
  const { playSound, stopAllSounds } = useAppState();
  const { startTimer, type } = useTrivia();
  const [catIsReady, setCatIsReady] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(SPEED);

  useEffect(() => {
    setTimeout(() => {
      playSound('meow');
    }, 800);
    return () => {
      stopAllSounds();
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center box-border">
      <div
        className={clsx(
          'w-full h-full flex flex-col justify-center items-center box-border max-w-[1250px]'
        )}
        onMouseDown={() => {
          if (catIsReady) {
            if (speed === SPEED) return;
            setSpeed(SPEED);
            return;
          }
          setSpeed(34);
        }}
        onMouseUp={() => {
          setSpeed(SPEED);
        }}
      >
        <GoBackButton />
        <ScreenTitle title={type === 'dc' ? 'DAILY CHALLENGE!' : 'FREE PLAY!'} />
        <div className="w-full flex-1 flex items-end justify-center mb-4">
          <SpeechBubble
            text={
              catIsReady ? text2 : type === 'dc' ? forgottenKittenTextDC : forgottenKittenTextFP
            }
            className={clsx('w-11/12', 'sm:w-9/12', 'md:w-7/12', 'lg:w-6/12')}
            onFinish={() => {
              if (catIsReady) {
                setTimeout(() => {
                  startTimer('trivia');
                }, 2000);
                return;
              }
              setTimeout(() => {
                setTimeout(() => {
                  playSound('meow');
                }, 800);
                setCatIsReady(true);
              }, 1500);
            }}
            speed={speed}
          />
        </div>

        {/* confused kitten */}
        <div className={clsx('w-full flex flex-col justify-end items-center')}>
          <div
            style={{
              backgroundImage: 'url(/cat/confusedkitten.png',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
            className={clsx('w-10/12 aspect-video', '', 'sm:w-7/12', '', 'xl:w-5/12', '2xl:w-6/12')}
          />
        </div>
      </div>
    </div>
  );
};

export default Idle;
