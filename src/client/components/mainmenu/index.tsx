import React from 'react';
import { GameScreens, useAppState } from '../../hooks/useAppState';

const MainMenu = () => {
  const { data, isReady, navigate } = useAppState();
  if (!isReady) return null;
  const { metrics } = data;
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
    <div>
      <span>All time daily challenge ranking: {data.allTimeDCRank}</span>
      <span>All time free play ranking: {data.allTimeFPRank}</span>
      {data.dCRank < 0 ? null : <span>Today's challenge rank: {data.dCRank}</span>}
      <br />
      <span>
        <b>Metrics</b>
      </span>
      <span>{JSON.stringify(metrics)}</span>
      <button onClick={() => navigate(GameScreens.INGAME)}>Play Daily Challenge</button>
      <button>Free play</button>
      <button onClick={() => navigate(GameScreens.LEADERBOARDS)}>All time DC leaderboard</button>
      <button onClick={() => navigate(GameScreens.LEADERBOARDS)}>All time FP leaderboard</button>
    </div>
  );
};

export default MainMenu;
