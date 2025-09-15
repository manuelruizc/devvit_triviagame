import { Router } from 'express';
import { redis, context, reddit } from '@devvit/web/server';
import { LeaderboardAPI, LeaderboardKeyType } from '../../shared/types/leaderboard';
import { BasicAPI } from '../../shared/types/basic';
import { saveToLeaderBoard } from '../helpers/leaderboard';
import { saveUserAchievements, saveUserMetrics } from '../helpers/metrics';

const leaderboardRoute = Router();

const { LEADERBOARD_API_ENDPOINTS, LEADERBOARD_NAMES } = LeaderboardAPI;

leaderboardRoute.post<
  { postId: string },
  BasicAPI.GetUserBasicData & { leaderboard: LeaderboardAPI.LeaderboardItem[] },
  BasicAPI.GetUserBasicData & { score: number; key: LeaderboardKeyType }
>(LEADERBOARD_API_ENDPOINTS.POST_TO_LEADERBOARD, async (_req, res): Promise<void> => {
  const { postId } = context;
  try {
    const redditUser = await reddit.getCurrentUser();
    console.log(redditUser);
    if (!postId || !redditUser) {
      res.status(400).json({
        type: BasicAPI.BasicAPIResponseType.INIT,
        member: '',
        allTimeDCRank: -1,
        allTimeFPRank: -1,
        dCRank: -1,
        metrics: {
          totalQuestionsAnswered: -1,
          correctAnswers: -1,
          longestStreak: -1,
          currentStreak: -1,
          totalPoints: -1,
          totalTime: -1,
          fastestDCSession: -1,
          totalSessions: -1,
          highestScoreSession: -1,
          hintsUsed: -1,
          entertainmentCorrect: 0,
          entertainmentCount: 0,
          redditCount: 0,
          redditCorrect: 0,
          sportsCount: 0,
          sportsCorrect: 0,
          generalCount: 0,
          generalCorrect: 0,
          historyCount: 0,
          historyCorrect: 0,
          geographyCount: 0,
          geographyCorrect: 0,
        },
        achievements: {},
        leaderboard: [],
        status: 'error',
      });
      return;
    }
    console.log('hhhhereee');
    const member = redditUser.username;
    const { score, metrics, achievements, key } = _req.body;
    const allTimeDcLeaderboard = key;
    const leaderboardsData = await saveToLeaderBoard(member, key, score);
    //  leaderboardsData.dcScore;
    //  leaderboardsData.fpScore;
    // let storedScore = await redis.zScore(allTimeDcLeaderboard, member);

    // if (storedScore === null) {
    //   // Add the member with inverted score
    //   await redis.zAdd(allTimeDcLeaderboard, { member, score: score * -1 });
    // } else {
    //   // Increment existing score
    //   await redis.zIncrBy(allTimeDcLeaderboard, member, score * -1);
    // }

    // // Always re-fetch to ensure it's persisted
    // storedScore = await redis.zScore(allTimeDcLeaderboard, member);
    // const rank = await redis.zRank(allTimeDcLeaderboard, member);

    // let finalScore = 0;
    // if (storedScore) finalScore = storedScore;
    // const userRank = rank !== null && rank !== undefined ? rank + 1 : -1;

    const leaderboardData = await redis.zRange(allTimeDcLeaderboard, 0, 99);
    const leaderboard: LeaderboardAPI.LeaderboardItem[] = leaderboardData.map((item) => ({
      member: item.member,
      score: -item.score,
      rank: leaderboardData.indexOf(item) + 1,
    }));

    const saved = await saveUserMetrics(_req.body, member);
    const achievementsSaved = await saveUserAchievements(_req.body, member);

    if (!saved || !achievementsSaved) {
      res.status(400).json({
        type: BasicAPI.BasicAPIResponseType.INIT,
        member: '',
        allTimeDCRank: -1,
        allTimeFPRank: -1,
        dCRank: -1,
        metrics: {
          totalQuestionsAnswered: -1,
          correctAnswers: -1,
          longestStreak: -1,
          currentStreak: -1,
          totalPoints: -1,
          totalTime: -1,
          fastestDCSession: -1,
          totalSessions: -1,
          highestScoreSession: -1,
          hintsUsed: -1,
          entertainmentCorrect: 0,
          entertainmentCount: 0,
          redditCount: 0,
          redditCorrect: 0,
          sportsCount: 0,
          sportsCorrect: 0,
          generalCount: 0,
          generalCorrect: 0,
          historyCount: 0,
          historyCorrect: 0,
          geographyCount: 0,
          geographyCorrect: 0,
        },
        achievements: {},
        leaderboard: [],
        status: 'error',
      });
      return;
    }

    res.json({
      type: BasicAPI.BasicAPIResponseType.INIT,
      member: '',
      allTimeDCRank: leaderboardsData.dcRank,
      allTimeFPRank: leaderboardsData.fpRank,
      dCRank: -69,
      metrics,
      leaderboard,
      achievements: { ...achievements },
      status: 'ok',
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      type: BasicAPI.BasicAPIResponseType.INIT,
      member: '',
      allTimeDCRank: -1,
      allTimeFPRank: -1,
      dCRank: -1,
      achievements: {},
      metrics: {
        totalQuestionsAnswered: -1,
        correctAnswers: -1,
        longestStreak: -1,
        currentStreak: -1,
        totalPoints: -1,
        totalTime: -1,
        fastestDCSession: -1,
        totalSessions: -1,
        highestScoreSession: -1,
        hintsUsed: -1,
        entertainmentCorrect: 0,
        entertainmentCount: 0,
        redditCount: 0,
        redditCorrect: 0,
        sportsCount: 0,
        sportsCorrect: 0,
        generalCount: 0,
        generalCorrect: 0,
        historyCount: 0,
        historyCorrect: 0,
        geographyCount: 0,
        geographyCorrect: 0,
      },
      leaderboard: [],
      status: 'error',
    });
  }
});

// GET LEADERBOARD BY KEY
leaderboardRoute.get<
  { member: string; postId: string; leaderboard_key: string },
  LeaderboardAPI.GetAllTimeDailyChallengesLeaderboard | { status: string; message: string }
>(
  LEADERBOARD_API_ENDPOINTS.GET_LEADERBOARD_WITH_KEY + '/:member/:leaderboard_key',
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
      const { member, leaderboard_key: leaderboardKey } = _req.params;
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
