import { useState } from 'react';
import { useTrivia } from '../../../hooks/useTrivia';
import SpeechBubble from '../../../ui/speechbubble';
import clsx from 'clsx';
import GoBackButton from '../../../ui/GoBackButton';

const text1 = `"Uh… hey hooman 👋 it’s me, Forgotten Kitten. I swear I was about to remember something super important… was it my breakfast? Or the daily challenge? 😼💭\n\n
  Anyway, I need your braincells more than my nine lives right now. Think of this like a post in r/AskReddit — I throw questions, you drop the answers, and maybe together we’ll figure out what I keep forgetting.\n\n
  Don’t leave me hanging like a post with zero upvotes, okay? Let’s start before I forget again… "`;
const text2 = "Ok, it's time. Let's do this. Good Luck";

const Idle = () => {
  const { startTimer } = useTrivia();
  const [catIsReady, setCatIsReady] = useState<boolean>(false);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center box-border">
      {/* <span>Let's get ready to rumble!!!</span>
      <span className="text-xl">{seconds}</span> */}
      <div
        className={clsx(
          'w-full h-full flex flex-col justify-center items-center box-border max-w-[1250px]'
        )}
      >
        <GoBackButton />
        <span>Daily Challenge!</span>
        <div className="w-full flex-1 flex items-end justify-center mb-4">
          <SpeechBubble
            text={catIsReady ? text2 : text1}
            className={clsx('w-11/12', 'sm:w-9/12', 'md:w-7/12', 'lg:w-6/12')}
            onFinish={() => {
              if (catIsReady) {
                setTimeout(() => {
                  startTimer('trivia');
                }, 2000);
                return;
              }
              setTimeout(() => {
                setCatIsReady(true);
              }, 1500);
            }}
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
