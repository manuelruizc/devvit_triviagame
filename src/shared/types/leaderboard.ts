export type LeaderboardKeyType =
  | (typeof LeaderboardAPI.LEADERBOARD_NAMES)[keyof typeof LeaderboardAPI.LEADERBOARD_NAMES]
  | `${(typeof LeaderboardAPI.LEADERBOARD_NAMES)[keyof typeof LeaderboardAPI.LEADERBOARD_NAMES]},${string}`;

export namespace LeaderboardAPI {
  //   GetAllTimeDailyChallengesLeaderboardResponse: GetAllTimeDailyChallengesLeaderboard;
  //   GetAllTimeFreePlayLeaderboard: GetAllTimeFreePlayLeaderboard;
  //   GetDailyLeaderboard: GetDailyLeaderboard;
  //   PostScoreToDailyChallengeLeaderboard: PostScoreToDailyChallengeLeaderboard;

  //   PostScoreToFreePlay: PostScoreToFreePlay;

  export namespace LEADERBOARD_NAMES {
    export const ALL_TIME_DC = 'at_dc_leaderboard';
    export const ALL_TIME_FP = 'at_fp_leaderboard';
    export const POST_DC = 'post_dc_leaderboard';
  }

  export enum LeaderboardAPIResponseType {
    GET_ALL_TIME_DC_LEADERBOARD = 'getAllTimeDailyChallengesLeaderboard',
    GET_ALL_TIME_FP_LEADERBOARD = 'getAllTimeFreePlayLeaderboard',
    GET_DAILY_LEADERBOARD = 'getDailyLeaderBoard',
    POST_SCORE_TO_DC = 'postScoreToDailyChallenge',
    POST_SCORE_TO_FP = 'postScoreToFreePlay',
  }

  export type LeaderboardItem = { member: string; score: number; rank: number };

  export namespace LEADERBOARD_API_ENDPOINTS {
    export const GET_ALL_TIME_DC_LEADERBOARD =
      '/api/leaderboard/get_all_time_daily_challenge_leaderboard';
    export const GET_LEADERBOARD_WITH_KEY = '/api/leaderboard/get_leaderboard';
    export const GET_ALL_TIME_FP_LEADERBOARD =
      '/api/leaderboard/get_all_time_free_play_leaderboard';
    export const GET_DAILY_SCOREBOARD = '/api/leaderboard/get_daily_scoreboard';
    export const POST_TO_LEADERBOARD = '/api/leaderboard/post_to_leaderboard';
    export const POST_TO_DAILY_CHALLENGE = '/api/leaderboard/post_to_daily_challenge';
    export const POST_TO_FREE_PLAY = '/api/leaderboard/post_to_free_play';
  }

  export interface GetAllTimeDailyChallengesLeaderboard {
    type: LeaderboardAPIResponseType.GET_ALL_TIME_DC_LEADERBOARD;
    member?: string;
    score: number;
    rank: number;
    leaderboard: LeaderboardItem[];
    status: 'ok' | 'error';
  }

  export interface GetAllTimeFreePlayLeaderboard {
    type: LeaderboardAPIResponseType.GET_ALL_TIME_FP_LEADERBOARD;
    member?: string;
    score: number;
    rank: number;
    leaderboard: LeaderboardItem[];
    status: 'ok' | 'error';
  }

  export interface GetDailyLeaderboard {
    type: LeaderboardAPIResponseType.GET_DAILY_LEADERBOARD;
    member?: string;
    score: number;
    rank: number;
    leaderboard: LeaderboardItem[];
    status: 'ok' | 'error';
  }

  export interface PostScoreToDailyChallengeLeaderboard {
    type: LeaderboardAPIResponseType.POST_SCORE_TO_DC;
    member?: string;
    score: number;
    rank: number;
    leaderboard: LeaderboardItem[];
    status: 'ok' | 'error';
  }

  export interface PostScoreToFreePlay {
    type: LeaderboardAPIResponseType.POST_SCORE_TO_FP;
    member?: string;
    score: number;
    rank: number;
    leaderboard: LeaderboardItem[];
    status: 'ok' | 'error';
  }
}
