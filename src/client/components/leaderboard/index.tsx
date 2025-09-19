import { useState } from 'react';
import { LeaderboardAPI } from '../../../shared/types/leaderboard';
import LeaderboardSelected from './leaderboardselected';
import { context } from '@devvit/web/client';
import clsx from 'clsx';
import { Button } from '../../ui/Button';
import { ACCENT_COLOR2, ACCENT_COLOR3, ACCENT_COLOR6 } from '../../helpers/colors';
import GoBackButton from '../../ui/GoBackButton';
import ScreenTitle from '../../ui/screentitle';

const BUTTONS = ['Daily Challenge', 'All-Time DC', 'All-Time FP'];
const COLORS: string[] = [ACCENT_COLOR2, ACCENT_COLOR3, ACCENT_COLOR6];
const TITLES = ['DAILY CHALLENGE LEADERBOARD', 'ALL-TIME DC LEADERBOARD', 'FREE PLAY LEADERBOARD'];

const Leaderboard = () => {
  const [index, setIndex] = useState<number>(0);

  return (
    <div className={clsx('w-full h-full flex flex-col justify-start items-center')}>
      <div
        className={clsx('w-full h-full flex flex-col justify-start items-center max-w-[1250px]')}
      >
        <GoBackButton />
        <div className={clsx('w-full flex justify-around items-center')}>
          {BUTTONS.map((title, i) => (
            <Button
              title={title.toUpperCase()}
              className={clsx(
                'w-[30%] text-xs !py-1 !h-12',
                'sm:w-[30%]',
                'md:w-[30%] md:text-sm',
                'lg:w-[30%] md:text-base',
                'xl:w-[30%]',
                '2xl:w-[30%]',
                i === index && 'border-2 border-black'
              )}
              backgroundColor={COLORS[i] as string}
              onClick={() => setIndex(i)}
              disabled={i === index}
            />
          ))}
        </div>
        <ScreenTitle title={TITLES[index] || 'LEADERBOARD'} className="mt-2" />
        <span className="mt-1">{BUTTONS[index]}</span>
        {index === 0 ? (
          <LeaderboardSelected
            leaderboardKey={`${LeaderboardAPI.LEADERBOARD_NAMES.POST_DC},${context.postId}`}
          />
        ) : index === 1 ? (
          <LeaderboardSelected
            leaderboardKey={LeaderboardAPI.LEADERBOARD_NAMES.ALL_TIME_DC as string}
          />
        ) : (
          <LeaderboardSelected
            leaderboardKey={LeaderboardAPI.LEADERBOARD_NAMES.ALL_TIME_FP as string}
          />
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
