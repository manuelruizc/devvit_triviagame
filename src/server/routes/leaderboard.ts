import { Router } from 'express';
import { redis, context } from '@devvit/web/server';
import { LeaderboardAPI } from '../../shared/types/leaderboard';

const leaderboardRoute = Router();

const { LEADERBOARD_API_ENDPOINTS, LEADERBOARD_NAMES } = LeaderboardAPI;

leaderboardRoute.post<
  { postId: string },
  LeaderboardAPI.PostScoreToDailyChallengeLeaderboard,
  { member: string; score: number }
>(LEADERBOARD_API_ENDPOINTS.POST_TO_DAILY_CHALLENGE, async (_req, res): Promise<void> => {
  const { postId } = context;
  try {
    if (!postId) {
      res.status(400).json({
        status: 'error',
        score: 0,
        type: LeaderboardAPI.LeaderboardAPIResponseType.POST_SCORE_TO_DC,
        member: '',
        rank: -1,
        leaderboard: [],
      });
      return;
    }
    const allTimeDcLeaderboard = LEADERBOARD_NAMES.ALL_TIME_DC;
    const { member, score } = _req.body;
    let storedScore = await redis.zScore(allTimeDcLeaderboard, member);

    if (storedScore === null) {
      // Add the member with inverted score
      await redis.zAdd(allTimeDcLeaderboard, { member, score: score * -1 });
    } else {
      // Increment existing score
      await redis.zIncrBy(allTimeDcLeaderboard, member, score * -1);
    }

    // Always re-fetch to ensure it's persisted
    storedScore = await redis.zScore(allTimeDcLeaderboard, member);
    const rank = await redis.zRank(allTimeDcLeaderboard, member);
    const leaderboardData = await redis.zRange(allTimeDcLeaderboard, 0, 99);
    const leaderboard: LeaderboardAPI.LeaderboardItem[] = leaderboardData.map((item) => ({
      member: item.member,
      score: -item.score,
      rank: leaderboardData.indexOf(item) + 1,
    }));

    let finalScore = 0;
    if (storedScore) finalScore = storedScore;
    const userRank = rank !== null && rank !== undefined ? rank + 1 : -1;
    res.json({
      status: 'ok',
      member,
      rank: userRank,
      leaderboard,
      score: finalScore * -1,
      type: LeaderboardAPI.LeaderboardAPIResponseType.POST_SCORE_TO_DC,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      score: 0,
      type: LeaderboardAPI.LeaderboardAPIResponseType.POST_SCORE_TO_DC,
      member: '',
      rank: -1,
      leaderboard: [],
    });
  }
});

// POST SCORE TO FREE PLAY
leaderboardRoute.post<
  { postId: string },
  LeaderboardAPI.PostScoreToFreePlay,
  { member: string; score: number }
>(LEADERBOARD_API_ENDPOINTS.POST_TO_FREE_PLAY, async (_req, res): Promise<void> => {
  const { postId } = context;
  try {
    if (!postId) {
      res.status(400).json({
        status: 'error',
        score: 0,
        type: LeaderboardAPI.LeaderboardAPIResponseType.POST_SCORE_TO_FP,
        member: '',
        rank: -1,
        leaderboard: [],
      });
      return;
    }
    const allTimeFPLeaderboard = LEADERBOARD_NAMES.ALL_TIME_FP;
    const { member, score } = _req.body;
    let storedScore = await redis.zScore(allTimeFPLeaderboard, member);

    if (storedScore === null) {
      // Add the member with inverted score
      await redis.zAdd(allTimeFPLeaderboard, { member, score: score * -1 });
    } else {
      // Increment existing score
      await redis.zIncrBy(allTimeFPLeaderboard, member, score * -1);
    }

    // Always re-fetch to ensure it's persisted
    storedScore = await redis.zScore(allTimeFPLeaderboard, member);
    const rank = await redis.zRank(allTimeFPLeaderboard, member);
    const leaderboardData = await redis.zRange(allTimeFPLeaderboard, 0, 99);
    const leaderboard: LeaderboardAPI.LeaderboardItem[] = leaderboardData.map((item) => ({
      member: item.member,
      score: -item.score,
      rank: leaderboardData.indexOf(item) + 1,
    }));

    let finalScore = 0;
    if (storedScore) finalScore = storedScore;
    const userRank = rank !== null && rank !== undefined ? rank + 1 : -1;
    res.json({
      status: 'ok',
      member,
      rank: userRank,
      leaderboard,
      score: finalScore * -1,
      type: LeaderboardAPI.LeaderboardAPIResponseType.POST_SCORE_TO_FP,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      score: 0,
      type: LeaderboardAPI.LeaderboardAPIResponseType.POST_SCORE_TO_FP,
      member: '',
      rank: -1,
      leaderboard: [],
    });
  }
});

// GET DAILY CHALLENGE LEADERBOARD
leaderboardRoute.get<
  { member: string; postId: string },
  LeaderboardAPI.GetAllTimeDailyChallengesLeaderboard | { status: string; message: string }
>(
  LEADERBOARD_API_ENDPOINTS.GET_ALL_TIME_DC_LEADERBOARD + '/:member',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    try {
      if (!postId) {
        res.status(400).json({
          status: 'error',
          score: 0,
          type: LeaderboardAPI.LeaderboardAPIResponseType.GET_ALL_TIME_DC_LEADERBOARD,
          member: '',
          rank: -1,
          leaderboard: [],
        });
        return;
      }
      const leaderboardKey = LEADERBOARD_NAMES.ALL_TIME_DC;
      const { member } = _req.params;
      let storedScore = await redis.zScore(leaderboardKey, member);

      if (storedScore === null || storedScore === undefined) {
        // Add the member with inverted score
        await redis.zAdd(leaderboardKey, { member, score: 0 });
      }

      // Always re-fetch to ensure it's persisted
      storedScore = await redis.zScore(leaderboardKey, member);
      const rank = await redis.zRank(leaderboardKey, member);
      const leaderboardData = await redis.zRange(leaderboardKey, 0, 99);
      const leaderboard: LeaderboardAPI.LeaderboardItem[] = leaderboardData.map((item) => ({
        member: item.member,
        score: -item.score,
        rank: leaderboardData.indexOf(item) + 1,
      }));

      let finalScore = 0;
      if (storedScore) finalScore = storedScore;
      const userRank = rank !== null && rank !== undefined ? rank + 1 : -1;
      res.json({
        status: 'ok',
        member,
        rank: userRank,
        leaderboard,
        score: finalScore * -1,
        type: LeaderboardAPI.LeaderboardAPIResponseType.GET_ALL_TIME_DC_LEADERBOARD,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        score: 0,
        type: LeaderboardAPI.LeaderboardAPIResponseType.GET_ALL_TIME_DC_LEADERBOARD,
        member: '',
        rank: -1,
        leaderboard: [],
      });
    }
  }
);

// GET FREE PLAY LEADERBOARD
leaderboardRoute.get<
  { member: string; postId: string },
  LeaderboardAPI.GetAllTimeFreePlayLeaderboard | { status: string; message: string }
>(
  LEADERBOARD_API_ENDPOINTS.GET_ALL_TIME_FP_LEADERBOARD + '/:member',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    try {
      if (!postId) {
        res.status(400).json({
          status: 'error',
          score: 0,
          type: LeaderboardAPI.LeaderboardAPIResponseType.GET_ALL_TIME_FP_LEADERBOARD,
          member: '',
          rank: -1,
          leaderboard: [],
        });
        return;
      }
      const leaderboardKey = LEADERBOARD_NAMES.ALL_TIME_FP;
      const { member } = _req.params;
      let storedScore = await redis.zScore(leaderboardKey, member);

      if (storedScore === null || storedScore === undefined) {
        // Add the member with inverted score
        await redis.zAdd(leaderboardKey, { member, score: 0 });
      }

      // Always re-fetch to ensure it's persisted
      storedScore = await redis.zScore(leaderboardKey, member);
      const rank = await redis.zRank(leaderboardKey, member);
      const leaderboardData = await redis.zRange(leaderboardKey, 0, 99);
      const leaderboard: LeaderboardAPI.LeaderboardItem[] = leaderboardData.map((item) => ({
        member: item.member,
        score: -item.score,
        rank: leaderboardData.indexOf(item) + 1,
      }));

      let finalScore = 0;
      if (storedScore) finalScore = storedScore;
      const userRank = rank !== null && rank !== undefined ? rank + 1 : -1;
      res.json({
        status: 'ok',
        member,
        rank: userRank,
        leaderboard,
        score: finalScore * -1,
        type: LeaderboardAPI.LeaderboardAPIResponseType.GET_ALL_TIME_FP_LEADERBOARD,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        score: 0,
        type: LeaderboardAPI.LeaderboardAPIResponseType.GET_ALL_TIME_FP_LEADERBOARD,
        member: '',
        rank: -1,
        leaderboard: [],
      });
    }
  }
);

export default leaderboardRoute;
