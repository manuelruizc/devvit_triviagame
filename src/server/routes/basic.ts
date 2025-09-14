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
          },
          status: 'error',
        });
        return;
      }
      const hashKey = `${USER_HASH_NAMES.USER_INFO},${member}`;

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
        });
      } else {
        const leaderboardsData = await saveToLeaderBoard(member);
        dcRank = leaderboardsData.dcRank;
        dcScore = leaderboardsData.dcScore;
        fpScore = leaderboardsData.fpScore;
        fpRank = leaderboardsData.fpRank;
      }

      const record = await redis.hGetAll(hashKey);

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
        },
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
        },
        status: 'error',
      });
    }
  }
);

export default basicRoute;
