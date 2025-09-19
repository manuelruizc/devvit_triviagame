import { useCallback } from 'react';
import { GET_REQUEST, POST_REQUEST } from '../helpers/https';
import { LeaderboardAPI, LeaderboardKeyType } from '../../shared/types/leaderboard';
import { BasicAPI } from '../../shared/types/basic';

interface LeaderboardHook {
  getAllTimeDailyChallengesLeaderboard: (member: string) => void;
  getAllTimeFreePlayLeaderboard: (member: string) => void;
  //   getDailyLeaderboard: (dailyChallengeId: string, member: string) => void;
  postScoreToLeaderboard: (
    member: BasicAPI.GetUserBasicData,
    score: number,
    key: LeaderboardKeyType
  ) => void;
  postScoreToDailyChallengeLeaderboard: (member: BasicAPI.GetUserBasicData, score: number) => void;
  postScoreToFreePlay: (member: BasicAPI.GetUserBasicData, score: number) => void;
}

function useLeaderboard(): LeaderboardHook {
  const postScoreToLeaderboard = useCallback(
    async (data: BasicAPI.GetUserBasicData, score: number, key: LeaderboardKeyType) => {
      try {
        const res = await POST_REQUEST(
          LeaderboardAPI.LEADERBOARD_API_ENDPOINTS.POST_TO_LEADERBOARD,
          { ...data, score, key }
        );
        return res;
      } catch (e) {
        return {
          error: true,
        };
      }
    },
    []
  );
  const postScoreToDailyChallengeLeaderboard = useCallback(
    async (data: BasicAPI.GetUserBasicData, score: number) => {
      try {
        const res = await POST_REQUEST(
          LeaderboardAPI.LEADERBOARD_API_ENDPOINTS.POST_TO_DAILY_CHALLENGE,
          { ...data, score, key: 'dc' }
        );
        return res;
      } catch (e) {
        return {
          error: true,
        };
      }
    },
    []
  );
  const postScoreToFreePlay = useCallback(
    async (data: BasicAPI.GetUserBasicData, score: number) => {
      try {
        const res = await POST_REQUEST(LeaderboardAPI.LEADERBOARD_API_ENDPOINTS.POST_TO_FREE_PLAY, {
          ...data,
          score,
          key: 'fp',
        });
        return res;
      } catch (e) {
        return {
          error: true,
        };
      }
    },
    []
  );
  const getAllTimeDailyChallengesLeaderboard = useCallback(async (member: string) => {
    try {
      const data = await GET_REQUEST(
        LeaderboardAPI.LEADERBOARD_API_ENDPOINTS.GET_ALL_TIME_DC_LEADERBOARD,
        member
      );
      return data;
    } catch (e) {
      return {
        error: true,
      };
    }
  }, []);
  const getAllTimeFreePlayLeaderboard = useCallback(async (member: string) => {
    try {
      const data = await GET_REQUEST(
        LeaderboardAPI.LEADERBOARD_API_ENDPOINTS.GET_ALL_TIME_FP_LEADERBOARD,
        member
      );
      return data;
    } catch (e) {
      return {
        error: true,
      };
    }
  }, []);

  return {
    postScoreToLeaderboard,
    postScoreToDailyChallengeLeaderboard,
    postScoreToFreePlay,
    getAllTimeFreePlayLeaderboard,
    getAllTimeDailyChallengesLeaderboard,
  };
}

export default useLeaderboard;
