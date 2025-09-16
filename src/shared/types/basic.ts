export namespace BasicAPI {
  export namespace USER_HASH_NAMES {
    export const USER_INFO = 'user_info';
    export const USER_ACHIEVEMENTS = 'user_achievements';
  }

  export namespace QUESTION_HASHES {
    export const ALL_QUESTIONS = 'all_questions_hash';
  }

  export namespace BASIC_API_ENDPOINTS {
    export const INIT = '/api/init/basic_data';
    export const RESET_DATA = '/api/init/reset_data';
    export const USERS_DATA = '/api/users/data';
    export const SAVE_QUESTIONS = '/api/questions/save_questions';
    export const CREATE_POST = '/api/daily_challenge/create_post';
    export const GET_DAILY_CHALLENGE = '/api/daily_challenge/user_answered_already';
    export const GET_QUESTIONS = '/api/questions/get_questions';
    export const SAVE_POST_CHALLENGE = '/api/questions/save_post_challenge';
  }
  export enum BasicAPIResponseType {
    INIT = 'init_basic_data',
  }
  export type QuestionCategory =
    | 'entertainment'
    | 'sports'
    | 'reddit'
    | 'general'
    | 'history'
    | 'geography';

  export type CategoryMetrics = {
    [C in QuestionCategory as `${C}Count`]: number;
  } & {
    [C in QuestionCategory as `${C}Correct`]: number;
  };

  export type AchievementType =
    | 'firstquestion'
    | 'hotstreak'
    | 'firestreak'
    | 'bigbrains'
    | 'lightingfast'
    | 'justintime'
    | 'perfectionist'
    | 'ontheboard'
    | 'climber'
    | 'topten'
    | 'numberone'
    | 'none';

  export interface UserMetrics extends CategoryMetrics {
    totalQuestionsAnswered: number;
    correctAnswers: number;
    longestStreak: number;
    currentStreak: number;
    totalPoints: number;
    totalTime: number;
    fastestDCSession: number;
    totalSessions: number;
    highestScoreSession: number;
    hintsUsed: number;
    coins: number;
  }

  export interface ResetData {
    status: 'ok' | 'error';
  }

  export interface GetUserBasicData {
    type: BasicAPIResponseType.INIT;
    member?: string;
    allTimeDCRank: number;
    allTimeFPRank: number;
    dCRank: number;
    metrics: UserMetrics;
    achievements: Partial<Record<AchievementType, boolean>>;
    status: 'ok' | 'error';
  }
}
