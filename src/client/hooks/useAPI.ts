import { useCallback } from 'react';
import { BasicAPI } from '../../shared/types/basic';
import { APIResponse, GET_REQUEST } from '../helpers/https';

interface ApiHookInterface {
  getInitialData: () => Promise<APIResponse<BasicAPI.GetUserBasicData>>;
  getUserData: () => void;
  // getUserData: () => Promise<APIResponse<void>>;
  resetData: () => void;
  // resetData: () => Promise<APIResponse<void>>;
}

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
  };
};
