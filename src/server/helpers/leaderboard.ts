import { redis } from '@devvit/web/server';
import { LeaderboardAPI, LeaderboardKeyType } from '../../shared/types/leaderboard';

export interface SaveToLeaderboardResponse {
  fpScore: number;
  fpRank: number;
  dcScore: number;
  dcRank: number;
  postDCRank: number;
  postDCScore: number;
}

export const saveToLeaderBoard = async (
  member: string,
  postId: string,
  leaderboardKey?: LeaderboardKeyType | null,
  score?: number
): Promise<SaveToLeaderboardResponse> => {
  try {
    const res = await _saveToLeaderboard(member, postId, leaderboardKey, score);
    return res;
  } catch (e) {
    return {
      fpScore: -1,
      fpRank: -1,
      dcRank: -1,
      dcScore: -1,
      postDCRank: -1,
      postDCScore: -1,
    };
  }
};

const _saveToLeaderboard = async (
  member: string,
  postId: string,
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
      if (leaderboardKey.startsWith('post_dc_leaderboard')) {
        await redis.set(`${postId},${member}`, 'answered');
      }
    }
    const leaderboardsInfo = await getLeaderboadRanks(member, postId);
    return leaderboardsInfo;
  } catch (e) {
    return {
      fpScore: -9,
      fpRank: -9,
      dcRank: -9,
      dcScore: -9,
      postDCRank: -9,
      postDCScore: -9,
    };
  }
};

export const getLeaderboadRanks = async (
  member: string,
  postId: string
): Promise<SaveToLeaderboardResponse> => {
  try {
    let dcRank = -1;
    let fpRank = -1;
    let fpScore = -1;
    let dcScore = -1;
    let postDCScore = -1;
    let postDCRank = -1;
    let fpStoredScore = await redis.zScore(LeaderboardAPI.LEADERBOARD_NAMES.ALL_TIME_FP, member);
    let dcStoredScore = await redis.zScore(LeaderboardAPI.LEADERBOARD_NAMES.ALL_TIME_DC, member);
    let dcRankStored = await redis.zRank(LeaderboardAPI.LEADERBOARD_NAMES.ALL_TIME_DC, member);
    let fpRankStored = await redis.zRank(LeaderboardAPI.LEADERBOARD_NAMES.ALL_TIME_FP, member);
    let postDCScoreStored = await redis.zScore(
      `${LeaderboardAPI.LEADERBOARD_NAMES.POST_DC},${postId}`,
      member
    );
    let postDCRankStored = await redis.zRank(
      `${LeaderboardAPI.LEADERBOARD_NAMES.POST_DC},${postId}`,
      member
    );

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

    if (postDCScoreStored !== null || postDCScoreStored !== undefined) {
      postDCScore =
        postDCScoreStored !== null && postDCScoreStored !== undefined ? postDCScoreStored : 0;
    }
    if (postDCRankStored !== null || postDCRankStored !== undefined) {
      postDCRank =
        postDCRankStored !== null && postDCRankStored !== undefined ? postDCRankStored + 1 : -1;
    }

    return {
      fpScore,
      fpRank,
      dcRank,
      dcScore,
      postDCRank,
      postDCScore,
    };
  } catch (e) {
    return {
      fpScore: -9,
      fpRank: -9,
      dcRank: -9,
      dcScore: -9,
      postDCRank: -9,
      postDCScore: -9,
    };
  }
};
