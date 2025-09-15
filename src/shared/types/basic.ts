export namespace BasicAPI {
  export namespace USER_HASH_NAMES {
    export const USER_INFO = 'user_info';
  }

  export namespace BASIC_API_ENDPOINTS {
    export const INIT = '/api/init/basic_data';
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
    | 'numberone';

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
