import { redis } from '@devvit/web/server';
import { LeaderboardAPI, LeaderboardKeyType } from '../../shared/types/leaderboard';

export interface SaveToLeaderboardResponse {
  fpScore: number;
  fpRank: number;
  dcScore: number;
  dcRank: number;
}

export const saveToLeaderBoard = async (
  member: string,
  leaderboardKey?: LeaderboardKeyType | null,
  score?: number
): Promise<SaveToLeaderboardResponse> => {
  try {
    const res = await saveToLeaderboard(member, leaderboardKey, score);
    return res;
  } catch (e) {
    return {
      fpScore: -1,
      fpRank: -1,
      dcRank: -1,
      dcScore: -1,
    };
  }
};

const saveToLeaderboard = async (
  member: string,
  leaderboardKey?: LeaderboardKeyType | null,
  score?: number
): Promise<SaveToLeaderboardResponse> => {
  try {
    if (leaderboardKey !== null && leaderboardKey !== undefined) {
      let storedScore = await redis.zScore(leaderboardKey, member);

      if (storedScore === null && score && leaderboardKey) {
        // Add the member with inverted score
        await redis.zAdd(leaderboardKey, { member, score: score * -1 });
      } else if (score && leaderboardKey) {
        // Increment existing score
        await redis.zIncrBy(leaderboardKey, member, score * -1);
      }
    }
    let dcRank = -1;
    let fpRank = -1;
    let fpScore = -1;
    let dcScore = -1;
    let fpStoredScore = await redis.zScore(LeaderboardAPI.LEADERBOARD_NAMES.ALL_TIME_FP, member);
    let dcStoredScore = await redis.zScore(LeaderboardAPI.LEADERBOARD_NAMES.ALL_TIME_DC, member);
    let dcRankStored = await redis.zRank(LeaderboardAPI.LEADERBOARD_NAMES.ALL_TIME_DC, member);
    let fpRankStored = await redis.zRank(LeaderboardAPI.LEADERBOARD_NAMES.ALL_TIME_FP, member);

    if (fpStoredScore !== null || fpStoredScore !== undefined) {
      fpScore = fpStoredScore !== null && fpStoredScore !== undefined ? fpStoredScore : 0;
    }

    if (dcStoredScore !== null || dcStoredScore !== undefined) {
      dcScore = dcStoredScore !== null && dcStoredScore !== undefined ? dcStoredScore : 0;
    }

    if (dcRankStored !== null || dcRankStored !== undefined) {
      dcRank = dcRankStored !== null && dcRankStored !== undefined ? dcRankStored + 1 : -1;
    }
    if (fpRankStored !== null || fpRankStored !== undefined) {
      fpRank = fpRankStored !== null && fpRankStored !== undefined ? fpRankStored + 1 : -1;
    }

    return {
      fpScore,
      fpRank,
      dcRank,
      dcScore,
    };
  } catch (e) {
    return {
      fpScore: -1,
      fpRank: -1,
      dcRank: -1,
      dcScore: -1,
    };
  }
};
