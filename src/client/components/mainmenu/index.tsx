import React, { useMemo } from 'react';
import { GameScreens, useAppState } from '../../hooks/useAppState';
import { useAPI } from '../../hooks/useAPI';
import { LeaderboardAPI } from '../../../shared/types/leaderboard';
import { context } from '@devvit/web/client';
import { Button } from '../../ui/Button';
import clsx from 'clsx';
import { ACCENT_COLOR, ACCENT_COLOR2, ACCENT_COLOR3, ACCENT_COLOR6 } from '../../helpers/colors';

const MainMenu = () => {
  const { data, isReady, navigate, dailyTrivia, postTriviaAnswered } = useAppState();
  // const { getUserData, postQuestions } = useAPI();
  if (!isReady) return null;
  const { metrics, achievements } = data;
  const {
    // totalQuestionsAnswered,
    // correctAnswers,
    // longestStreak,
    // currentStreak,
    // totalPoints,
    // totalTime,
    // fastestDCSession,
    // totalSessions,
    // highestScoreSession,
    // hintsUsed,
  } = metrics;

  const buttonClass = useMemo(() => {
    return clsx(
      'w-[88%] mb-2 text-sm',
      'sm:w-[70%]',
      'md:w-[70%] md:mb-6',
      'lg:w-[60%] lg:mb-8 lg:text-lg',
      'xl:w-[50%]',
      '2xl:w-[45%]'
    );
  }, []);

  return (
    <div
      className={clsx(
        'w-full h-full flex flex-col justify-center items-center overflow-hidden overflow-x-hidden overflow-y-hidden'
        // 'md:bg-blue-500',
        // 'sm:bg-green-500',
        // 'lg:bg-emerald-800',
        // 'xl:bg-purple-500',
        // '2xl:bg-orange-500',
      )}
      style={{
        backgroundImage: 'url(/bg_wide.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        className={clsx(
          'w-full h-full flex flex-col justify-center items-center',
          'sm:',
          'md:',
          'lg:',
          'xl:max-w-[1250px]',
          '2xl:'
        )}
      >
        <div className={clsx('w-full flex flex-col justify-center items-center flex-1')}>
          <div
            className="w-[95%] h-[95%]"
            style={{
              backgroundImage: 'url(/cat/logo.png',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'contain',
            }}
          ></div>
          {<span style={{ color: ACCENT_COLOR3 }}>Welcome {data.member}!</span>}
        </div>
        <div className={clsx('w-full flex flex-1 flex-col justify-end items-center')}>
          <Button
            onClick={() => navigate(GameScreens.INGAME, 'dc')}
            title={postTriviaAnswered ? 'DAILY CHALLENGE COMPLETED' : 'COMPLETE DAILY CHALLENGE'}
            className={buttonClass}
            backgroundColor={ACCENT_COLOR}
            disabled={postTriviaAnswered}
          />
          <Button
            onClick={() => navigate(GameScreens.INGAME, 'fp')}
            title="FREE PLAY"
            className={buttonClass}
            backgroundColor={ACCENT_COLOR2}
          />
          <Button
            onClick={() => navigate(GameScreens.ACHIEVEMENTS)}
            title="ACHIEVEMENTS"
            className={buttonClass}
            backgroundColor={ACCENT_COLOR3}
          />
          <Button
            onClick={() => navigate(GameScreens.LEADERBOARDS)}
            title="LEADERBOARDS"
            className={buttonClass}
            backgroundColor={ACCENT_COLOR6}
          />
        </div>
      </div>
      {/* <span className="">All time daily challenge ranking: {data.allTimeDCRank}</span>
      <span>All time free play ranking: {data.allTimeFPRank}</span>
      {data.dCRank < 0 ? null : <span>Today's challenge rank: {data.dCRank}</span>}
      <br />
      <text className="mt-1 font-bold">Post Data:</text>
      <text>Daily Trivia: {JSON.stringify(dailyTrivia, null, 2) ?? 'undefined'}</text>
      <span>
        <b>Metrics</b>
      </span>
      <span>{JSON.stringify(metrics.coins)}</span>
      <span>{JSON.stringify(achievements)}</span>
      <button onClick={postQuestions}>Post Questions</button>
      {!postTriviaAnswered ? (
        <button onClick={() => navigate(GameScreens.INGAME, 'dc')}>Play Daily Challenge</button>
      ) : null}
      <button onClick={() => navigate(GameScreens.INGAME, 'fp')}>Free Play</button>
      <button
        onClick={() =>
          navigate(
            GameScreens.LEADERBOARDS,
            LeaderboardAPI.LEADERBOARD_NAMES.POST_DC + ',' + context.postId
          )
        }
      >
        Daily Challenge Leaderboard
      </button>
      <button
        onClick={() =>
          navigate(GameScreens.LEADERBOARDS, LeaderboardAPI.LEADERBOARD_NAMES.ALL_TIME_DC)
        }
      >
        All time DC leaderboard
      </button>
      <button
        onClick={() =>
          navigate(GameScreens.LEADERBOARDS, LeaderboardAPI.LEADERBOARD_NAMES.ALL_TIME_FP)
        }
      >
        All time FP leaderboard
      </button>
      <button onClick={() => navigate(GameScreens.ACHIEVEMENTS)}>Achievements</button>
      <button onClick={getUserData}>GetUserData</button>
      <button onClick={() => navigate(GameScreens.CREATE_POST)}>Create Post</button>
      <button>ResetData</button> */}
    </div>
  );
};

export default MainMenu;
