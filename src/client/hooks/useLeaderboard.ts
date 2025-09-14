import { useCallback } from 'react';
import { GET_REQUEST, POST_REQUEST } from '../helpers/https';
import { LeaderboardAPI } from '../../shared/types/leaderboard';

interface LeaderboardHook {
  getAllTimeDailyChallengesLeaderboard: (member: string) => void;
  getAllTimeFreePlayLeaderboard: (member: string) => void;
  //   getDailyLeaderboard: (dailyChallengeId: string, member: string) => void;
  postScoreToDailyChallengeLeaderboard: (member: string, score: number) => void;
  postScoreToFreePlay: (member: string, score: number) => void;
}

function useLeaderboard(): LeaderboardHook {
  const postScoreToDailyChallengeLeaderboard = useCallback(
    async (member: string, score: number) => {
      try {
        const data = await POST_REQUEST(
          LeaderboardAPI.LEADERBOARD_API_ENDPOINTS.POST_TO_DAILY_CHALLENGE,
          { member, score }
        );
        console.log(data);
      } catch (e) {
        return;
      }
    },
    []
  );
  const postScoreToFreePlay = useCallback(async (member: string, score: number) => {
    try {
      const data = await POST_REQUEST(LeaderboardAPI.LEADERBOARD_API_ENDPOINTS.POST_TO_FREE_PLAY, {
        member,
        score,
      });
    } catch (e) {
      return;
    }
  }, []);
  const getAllTimeDailyChallengesLeaderboard = useCallback(async (member: string) => {
    try {
      const data = await GET_REQUEST(
        LeaderboardAPI.LEADERBOARD_API_ENDPOINTS.GET_ALL_TIME_DC_LEADERBOARD,
        member
      );
      console.log('allTimeDCChallenge', data);
    } catch (e) {
      return;
    }
  }, []);
  const getAllTimeFreePlayLeaderboard = useCallback(async (member: string) => {
    try {
      const data = await GET_REQUEST(
        LeaderboardAPI.LEADERBOARD_API_ENDPOINTS.GET_ALL_TIME_FP_LEADERBOARD,
        member
      );
      console.log('allTimeFreePlayLeaderboard', data);
    } catch (e) {
      return;
    }
  }, []);

  return {
    postScoreToDailyChallengeLeaderboard,
    postScoreToFreePlay,
    getAllTimeFreePlayLeaderboard,
    getAllTimeDailyChallengesLeaderboard,
  };
}

export default useLeaderboard;
