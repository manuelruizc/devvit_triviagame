import { Router } from 'express';
import { redis, context, reddit } from '@devvit/web/server';
import { BasicAPI } from '../../shared/types/basic';
import { LeaderboardAPI } from '../../shared/types/leaderboard';
import { getLeaderboadRanks, saveToLeaderBoard } from '../helpers/leaderboard';
import { saveQuestions, shuffleArray } from '../helpers/questions';

const basicRoute = Router();

const { BASIC_API_ENDPOINTS, USER_HASH_NAMES, QUESTION_HASHES } = BasicAPI;

// GET USER DATA
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
            coins: 0,
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
      let postDCRank = -1;
      let postDCScore = -1;
      let leaderboardRankings = null;
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
          coins: '0',
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
        const leaderboardsData = await getLeaderboadRanks(member, postId);
        leaderboardRankings = leaderboardsData;
        dcRank = leaderboardsData.dcRank;
        dcScore = leaderboardsData.dcScore;
        fpScore = leaderboardsData.fpScore;
        fpRank = leaderboardsData.fpRank;
        postDCRank = leaderboardsData.postDCRank;
        postDCScore = leaderboardsData.postDCScore;
      }

      const record = await redis.hGetAll(hashKey);
      const achiev = await redis.hGetAll(achievementsHashKey);
      res.json({
        type: BasicAPI.BasicAPIResponseType.INIT,
        member: member,
        dCRank: postDCRank,
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
          coins: Number(record?.coins || 0),
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
        member: '',
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
          coins: 0,
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
            member: 'user_data_first_error',
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
      let postDCScore = -1;
      let postDCRank = -1;

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
        const leaderboardsData = await getLeaderboadRanks(member, postId);
        dcRank = leaderboardsData.dcRank;
        dcScore = leaderboardsData.dcScore;
        fpScore = leaderboardsData.fpScore;
        fpRank = leaderboardsData.fpRank;
        postDCRank = leaderboardsData.postDCRank;
        postDCScore = leaderboardsData.postDCScore;
      }

      const record = await redis.hGetAll(hashKey);
      const achiev = await redis.hGetAll(achievementsHashKey);

      res.json({
        userRedditData: user,
        gameData: {
          type: BasicAPI.BasicAPIResponseType.INIT,
          member,
          dCRank: postDCRank,
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
          member: 'user_data_catch_error',
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

basicRoute.post<{ questions: []; postId: string }, any>(
  BASIC_API_ENDPOINTS.SAVE_QUESTIONS,
  async (_req, res): Promise<void> => {
    const { postId } = context;
    const member = await reddit.getCurrentUsername();
    try {
      if (!postId || !member || member === undefined || member !== 'webdevMX') {
        res.status(400).json({
          questions: [],
          status: 'error',
        });
        return;
      }
      const { questions } = _req.body;
      const newQuestions = await saveQuestions(questions);

      res.json({
        questions: newQuestions,
        status: 'ok',
      });
    } catch (error) {
      res.status(400).json({
        questions: [],
        status: 'error',
      });
    }
  }
);

basicRoute.get<{ postId: string }, any>(
  BASIC_API_ENDPOINTS.GET_QUESTIONS,
  async (_req, res): Promise<void> => {
    const { postId } = context;
    const member = await reddit.getCurrentUsername();
    try {
      if (!postId) {
        res.status(400).json({
          questions: [],
          status: 'error',
        });
        return;
      }
      const newQuestions = await saveQuestions([]);
      const shuffledQuestions = shuffleArray(newQuestions);
      res.json({
        questions: shuffledQuestions,
        status: 'ok',
        postId,
      });
    } catch (error) {
      res.status(400).json({
        questions: [],
        status: 'error',
      });
    }
  }
);

// CREATE POST
basicRoute.post<{ questions: []; postId: string; dailyChallenge: any }, any>(
  BASIC_API_ENDPOINTS.CREATE_POST,
  async (_req, res): Promise<void> => {
    const { postId } = context;
    const member = await reddit.getCurrentUsername();
    try {
      if (!postId || !member || member === undefined || member !== 'webdevMX') {
        res.status(400).json({
          status: 'error',
        });
        return;
      }
      const { dailyChallenge } = _req.body;
      const post = await reddit.submitCustomPost({
        subredditName: context.subredditName!,
        title: 'The Daily Challenge Is Here!!!',
        splash: {
          appDisplayName: 'The Daily Challenge Is Here!',
          backgroundUri: 'defaultsplashscren.png',
          appIconUri: 'https://i.imgur.com/JLZOVR4.png',
        },
        postData: {
          dailyChallenge,
          testing: 'helloo',
        },
      });
      res.json({
        status: 'ok',
        dailyChallenge: 'savado',
        punk: { ..._req.body },
        post,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        post: null,
      });
    }
  }
);

basicRoute.get<{ postId: string }, any>(
  BASIC_API_ENDPOINTS.GET_DAILY_CHALLENGE,
  async (_req, res): Promise<void> => {
    const { postId } = context;
    const member = await reddit.getCurrentUsername();
    try {
      if (!postId) {
        res.status(400).json({
          questions: [],
          status: 'error',
        });
        return;
      }
      const key = `${postId},${member}`;
      const exists = await redis.exists(key);
      res.json({
        answered: exists > 0,
        status: 'ok',
        postId,
        exists,
      });
    } catch (error) {
      res.status(400).json({
        questions: [],
        status: 'error',
      });
    }
  }
);

export default basicRoute;
