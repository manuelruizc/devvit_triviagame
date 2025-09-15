import React from 'react';
import { GameScreens, useAppState } from '../../hooks/useAppState';
import { useAPI } from '../../hooks/useAPI';
import { LeaderboardAPI } from '../../../shared/types/leaderboard';

const MainMenu = () => {
  const { data, isReady, navigate } = useAppState();
  const { getUserData, postQuestions } = useAPI();
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
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-teal-600">
      <span>All time daily challenge ranking: {data.allTimeDCRank}</span>
      <span>All time free play ranking: {data.allTimeFPRank}</span>
      {data.dCRank < 0 ? null : <span>Today's challenge rank: {data.dCRank}</span>}
      <br />
      <span>
        <b>Metrics</b>
      </span>
      <span>{JSON.stringify(metrics)}</span>
      <span>{JSON.stringify(achievements)}</span>
      <button onClick={postQuestions}>Post Questions</button>
      <button onClick={() => navigate(GameScreens.INGAME, 'dc')}>Play Daily Challenge</button>
      <button onClick={() => navigate(GameScreens.INGAME, 'fp')}>Free Play</button>
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
      <button>ResetData</button>
    </div>
  );
};

export default MainMenu;
