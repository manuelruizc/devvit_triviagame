import { useCallback } from 'react';
import { BasicAPI } from '../../shared/types/basic';
import { APIResponse, GET_REQUEST, POST_REQUEST } from '../helpers/https';

interface ApiHookInterface {
  getInitialData: () => Promise<APIResponse<BasicAPI.GetUserBasicData>>;
  getUserData: () => void;
  // getUserData: () => Promise<APIResponse<void>>;
  resetData: () => void;
  postQuestions: () => void;
  getQuestions: () => Promise<APIResponse<any>>;
  getDailyChallengeStatus: () => Promise<APIResponse<any>>;
  // resetData: () => Promise<APIResponse<void>>;
}

const questions = [
  {
    level: 'easy',
    question: 'Which country won the 2018 FIFA World Cup?',
    unlockedClue: 'France',
    answers: ['France', 'Croatia', 'Brazil', 'Germany'],
    correctAnswer: 'France',
    category: 'sports',
    type: 'trivia',
  },
  {
    level: 'easy',
    question: 'How many players are on a basketball team on the court?',
    unlockedClue: '5',
    answers: ['5', '6', '7', '4'],
    correctAnswer: '5',
    category: 'sports',
    type: 'trivia',
  },
  {
    level: 'medium',
    question: 'Which tennis player has won the most Grand Slam titles?',
    unlockedClue: 'Novak Djokovic',
    answers: ['Roger Federer', 'Rafael Nadal', 'Novak Djokovic', 'Serena Williams'],
    correctAnswer: 'Novak Djokovic',
    category: 'sports',
    type: 'trivia',
  },
  {
    level: 'medium',
    question: 'Which NFL team has the most Super Bowl wins?',
    unlockedClue: 'New England Patriots',
    answers: [
      'Pittsburgh Steelers',
      'Dallas Cowboys',
      'New England Patriots',
      'San Francisco 49ers',
    ],
    correctAnswer: 'New England Patriots',
    category: 'sports',
    type: 'trivia',
  },
  {
    level: 'hard',
    question: 'In which year were the first modern Olympic Games held?',
    unlockedClue: '1896',
    answers: ['1896', '1900', '1888', '1924'],
    correctAnswer: '1896',
    category: 'sports',
    type: 'trivia',
  },
];

export const useAPI = (): ApiHookInterface => {
  const getInitialData = useCallback(async () => {
    try {
      const data = await GET_REQUEST<BasicAPI.GetUserBasicData>(BasicAPI.BASIC_API_ENDPOINTS.INIT);
      return data; // already includes `error`
    } catch (e) {
      return {
        error: true,
      } as APIResponse<BasicAPI.GetUserBasicData>;
    }
  }, []);
  const postQuestions = useCallback(async () => {
    try {
      const data = await POST_REQUEST<any>(BasicAPI.BASIC_API_ENDPOINTS.SAVE_QUESTIONS, {
        questions,
      });
      return data; // already includes `error`
    } catch (e) {
      return {
        error: true,
      } as APIResponse<BasicAPI.GetUserBasicData>;
    }
  }, []);
  const getQuestions = useCallback(async () => {
    try {
      const data = await GET_REQUEST<BasicAPI.GetUserBasicData>(
        BasicAPI.BASIC_API_ENDPOINTS.GET_QUESTIONS
      );
      return data;
    } catch (e) {
      return {
        error: true,
      } as APIResponse<BasicAPI.GetUserBasicData>;
    }
  }, []);
  const getUserData = useCallback(async () => {
    try {
      const data = await GET_REQUEST<BasicAPI.GetUserBasicData>(
        BasicAPI.BASIC_API_ENDPOINTS.USERS_DATA + '/Stackunderflow22'
      );
      console.log(data);
      // return data; // already includes `error`
    } catch (e) {
      // return {
      //   error: true,
      // } as APIResponse<BasicAPI.GetUserBasicData>;
    }
  }, []);
  const getDailyChallengeStatus = useCallback(async () => {
    try {
      const data = await GET_REQUEST<BasicAPI.GetUserBasicData>(
        BasicAPI.BASIC_API_ENDPOINTS.GET_DAILY_CHALLENGE
      );
      console.log(data);
      return data;
    } catch (e) {
      // return {
      //   error: true,
      // } as APIResponse<BasicAPI.GetUserBasicData>;
    }
  }, []);
  const resetData = useCallback(async () => {
    try {
      const data = await GET_REQUEST<BasicAPI.GetUserBasicData>(
        BasicAPI.BASIC_API_ENDPOINTS.RESET_DATA
      );
      return data; // already includes `error`
    } catch (e) {
      // return {
      //   error: true,
      // } as APIResponse<BasicAPI.GetUserBasicData>;
    }
  }, []);

  return {
    getInitialData,
    resetData,
    getUserData,
    postQuestions,
    getQuestions,
    getDailyChallengeStatus,
  };
};
