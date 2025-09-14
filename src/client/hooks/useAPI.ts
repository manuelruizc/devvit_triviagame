import { useCallback } from 'react';
import { BasicAPI } from '../../shared/types/basic';
import { APIResponse, GET_REQUEST } from '../helpers/https';

interface ApiHookInterface {
  getInitialData: () => Promise<APIResponse<BasicAPI.GetUserBasicData>>;
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

  return {
    getInitialData,
  };
};
