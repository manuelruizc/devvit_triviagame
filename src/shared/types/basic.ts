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
  export interface UserMetrics {
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
    status: 'ok' | 'error';
  }
}
