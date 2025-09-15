import clsx from 'clsx';
import React from 'react';
import { GameScreens, useAppState } from '../../hooks/useAppState';

const LeaderboardResult = ({ data }: { data: any }) => {
  const { member } = data;
  const { navigate } = useAppState();
  return (
    <div className="w-full h-full bg-purple-400 flex flex-col justify-center items-center">
      {data.leaderboard.map((item: any, idx: number) => (
        <button
          onClick={() => navigate(GameScreens.USER_PROFILE, item.member)}
          className={clsx('w-40 h-12 bg-amber-100', item.member === member && 'bg-blue-400')}
        >
          {item.member} - {item.score}
        </button>
      ))}
    </div>
  );
};

export default LeaderboardResult;
