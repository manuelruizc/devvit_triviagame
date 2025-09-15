import { Router } from 'express';
import { redis, context, reddit } from '@devvit/web/server';
import { BasicAPI } from '../../shared/types/basic';
import { LeaderboardAPI } from '../../shared/types/leaderboard';
import { saveToLeaderBoard } from '../helpers/leaderboard';

const basicRoute = Router();

const { BASIC_API_ENDPOINTS, USER_HASH_NAMES } = BasicAPI;

// GET FREE PLAY LEADERBOARD
basicRoute.get<{ member: string; postId: string }, BasicAPI.GetUserBasicData>(
  BASIC_API_ENDPOINTS.INIT,
  async (_req, res): Promise<void> => {
    const { postId } = context;
    const member = await reddit.getCurrentUsername();
    try {
      if (!postId || !member || member.length === 0 || member === 'anonymous') {
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
            // categories
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
          status: 'error',
        });
        return;
      }
      const hashKey = `${USER_HASH_NAMES.USER_INFO},${member}`;
      const achievementsHashKey = `${USER_HASH_NAMES.USER_ACHIEVEMENTS},${member}`;

      let hashLength = await redis.hLen(hashKey);
      let dcRank = -1;
      let fpRank = -1;
      let fpScore = -1;
      let dcScore = -1;

      if (hashLength === 0) {
        await redis.hSet(hashKey, {
          score: '-1',
          allDCTimeRank: '-1',
          allFPTimeRank: '-1',
          dCRank: '-1',
          totalQuestionsAnswered: '0',
          correctAnswers: '0',
          longestStreak: '0',
          currentStreak: '0',
          totalPoints: '0',
          totalTime: '0',
          fastestDCSession: '0',
          totalSessions: '0',
          highestScoreSession: '0',
          hintsUsed: '0',

          entertainmentCorrect: '0',
          entertainmentCount: '0',
          redditCount: '0',
          redditCorrect: '0',
          sportsCount: '0',
          sportsCorrect: '0',
          generalCount: '0',
          generalCorrect: '0',
          historyCount: '0',
          historyCorrect: '0',
          geographyCount: '0',
          geographyCorrect: '0',
        });
      } else {
        const leaderboardsData = await saveToLeaderBoard(member);
        dcRank = leaderboardsData.dcRank;
        dcScore = leaderboardsData.dcScore;
        fpScore = leaderboardsData.fpScore;
        fpRank = leaderboardsData.fpRank;
      }

      const record = await redis.hGetAll(hashKey);
      const achiev = await redis.hGetAll(achievementsHashKey);
      res.json({
        type: BasicAPI.BasicAPIResponseType.INIT,
        member,
        dCRank: 99, // TODO
        allTimeDCRank: dcRank,
        allTimeFPRank: fpRank,
        metrics: {
          totalQuestionsAnswered: Number(record?.totalQuestionsAnswered || 0),
          correctAnswers: Number(record?.correctAnswers || 0),
          longestStreak: Number(record?.longestStreak || 0),
          currentStreak: Number(record?.currentStreak || 0),
          totalPoints: Number(record?.totalPoints || 0),
          totalTime: Number(record?.totalTime || 0),
          fastestDCSession: Number(record?.fastestDCSession || 0),
          totalSessions: Number(record?.totalSessions || 0),
          highestScoreSession: Number(record?.highestScoreSession || 0),
          hintsUsed: Number(record?.hintsUsed || 0),

          entertainmentCorrect: Number(record?.entertainmentCorrect || 0),
          entertainmentCount: Number(record?.entertainmentCount || 0),
          redditCount: Number(record?.redditCount || 0),
          redditCorrect: Number(record?.redditCorrect || 0),
          sportsCount: Number(record?.sportsCount || 0),
          sportsCorrect: Number(record?.sportsCorrect || 0),
          generalCount: Number(record?.generalCount || 0),
          generalCorrect: Number(record?.generalCorrect || 0),
          historyCount: Number(record?.historyCount || 0),
          historyCorrect: Number(record?.historyCorrect || 0),
          geographyCount: Number(record?.geographyCount || 0),
          geographyCorrect: Number(record?.geographyCorrect || 0),
        },
        achievements: { ...achiev },
        status: 'ok',
      });
    } catch (error) {
      res.status(400).json({
        type: BasicAPI.BasicAPIResponseType.INIT,
        member: 'string;',
        allTimeDCRank: -1,
        allTimeFPRank: -1,
        dCRank: -1,
        metrics: {
          totalQuestionsAnswered: 0,
          correctAnswers: 0,
          longestStreak: 0,
          currentStreak: 0,
          totalPoints: 0,
          totalTime: 0,
          fastestDCSession: 0,
          totalSessions: 0,
          highestScoreSession: 0,
          hintsUsed: 0,
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
        status: 'error',
      });
    }
  }
);

// RESET DATAAAAA
basicRoute.get<{ member: string; postId: string }, BasicAPI.ResetData>(
  BASIC_API_ENDPOINTS.RESET_DATA,
  async (_req, res): Promise<void> => {
    const { postId } = context;
    const member = await reddit.getCurrentUsername();
    try {
      if (!postId || !member || member.length === 0 || member === 'anonymous') {
        res.status(400).json({
          status: 'error',
        });
        return;
      }
      const hashKey = `${BasicAPI.USER_HASH_NAMES.USER_INFO},${member}`;
      await redis.del(member);
      await redis.del(hashKey);
      await redis.del(LeaderboardAPI.LEADERBOARD_NAMES.ALL_TIME_DC);
      await redis.del(LeaderboardAPI.LEADERBOARD_NAMES.ALL_TIME_FP);
      res.json({
        status: 'ok',
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
      });
    }
  }
);

// USER DATAAAAA
basicRoute.get<{ username: string; postId: string }, any>(
  BASIC_API_ENDPOINTS.USERS_DATA + '/:username',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    const { username: member } = _req.params;
    const user = await reddit.getUserByUsername(member);
    try {
      if (!postId || !user || user === undefined) {
        res.status(400).json({
          userRedditData: null,
          gameData: {
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
              // categories
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
            status: 'error',
          },
        });
        return;
      }
      const hashKey = `${USER_HASH_NAMES.USER_INFO},${member}`;
      const achievementsHashKey = `${USER_HASH_NAMES.USER_ACHIEVEMENTS},${member}`;

      let hashLength = await redis.hLen(hashKey);
      let dcRank = -1;
      let fpRank = -1;
      let fpScore = -1;
      let dcScore = -1;

      if (hashLength === 0) {
        await redis.hSet(hashKey, {
          score: '-1',
          allDCTimeRank: '-1',
          allFPTimeRank: '-1',
          dCRank: '-1',
          totalQuestionsAnswered: '0',
          correctAnswers: '0',
          longestStreak: '0',
          currentStreak: '0',
          totalPoints: '0',
          totalTime: '0',
          fastestDCSession: '0',
          totalSessions: '0',
          highestScoreSession: '0',
          hintsUsed: '0',

          entertainmentCorrect: '0',
          entertainmentCount: '0',
          redditCount: '0',
          redditCorrect: '0',
          sportsCount: '0',
          sportsCorrect: '0',
          generalCount: '0',
          generalCorrect: '0',
          historyCount: '0',
          historyCorrect: '0',
          geographyCount: '0',
          geographyCorrect: '0',
        });
      } else {
        const leaderboardsData = await saveToLeaderBoard(member);
        dcRank = leaderboardsData.dcRank;
        dcScore = leaderboardsData.dcScore;
        fpScore = leaderboardsData.fpScore;
        fpRank = leaderboardsData.fpRank;
      }

      const record = await redis.hGetAll(hashKey);
      const achiev = await redis.hGetAll(achievementsHashKey);
      res.json({
        userRedditData: user,
        gameData: {
          type: BasicAPI.BasicAPIResponseType.INIT,
          member,
          dCRank: 99, // TODO
          allTimeDCRank: dcRank,
          allTimeFPRank: fpRank,
          metrics: {
            totalQuestionsAnswered: Number(record?.totalQuestionsAnswered || 0),
            correctAnswers: Number(record?.correctAnswers || 0),
            longestStreak: Number(record?.longestStreak || 0),
            currentStreak: Number(record?.currentStreak || 0),
            totalPoints: Number(record?.totalPoints || 0),
            totalTime: Number(record?.totalTime || 0),
            fastestDCSession: Number(record?.fastestDCSession || 0),
            totalSessions: Number(record?.totalSessions || 0),
            highestScoreSession: Number(record?.highestScoreSession || 0),
            hintsUsed: Number(record?.hintsUsed || 0),

            entertainmentCorrect: Number(record?.entertainmentCorrect || 0),
            entertainmentCount: Number(record?.entertainmentCount || 0),
            redditCount: Number(record?.redditCount || 0),
            redditCorrect: Number(record?.redditCorrect || 0),
            sportsCount: Number(record?.sportsCount || 0),
            sportsCorrect: Number(record?.sportsCorrect || 0),
            generalCount: Number(record?.generalCount || 0),
            generalCorrect: Number(record?.generalCorrect || 0),
            historyCount: Number(record?.historyCount || 0),
            historyCorrect: Number(record?.historyCorrect || 0),
            geographyCount: Number(record?.geographyCount || 0),
            geographyCorrect: Number(record?.geographyCorrect || 0),
          },
          achievements: { ...achiev },
        },
        status: 'ok',
      });
    } catch (error) {
      res.status(400).json({
        userRedditData: null,
        gameData: {
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
            // categories
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
          status: 'error',
        },
      });
    }
  }
);

export default basicRoute;
