import { useCallback, useEffect, useRef, useState } from 'react';
import { GET_REQUEST } from '../../helpers/https';
import { useAppState } from '../../hooks/useAppState';
import { BasicAPI } from '../../../shared/types/basic';
import UserProfileResult from './leaderboardresult';

const UserProfile = () => {
  const { data: userData, navigationPayload } = useAppState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const render = useRef<boolean>(false);
  const fetchData = useCallback(
    async (key: string) => {
      try {
        if (!userData) return;
        if (!userData.member) return;
        const fetchedData: any[] = await GET_REQUEST<any[]>(
          BasicAPI.BASIC_API_ENDPOINTS.USERS_DATA + `/${key}`
        );
        setData(fetchedData);
        setIsLoading(false);
        setIsError(false);
        render.current = true;
      } catch (e) {
        setIsError(true);
        return;
      }
    },
    [userData]
  );

  useEffect(() => {
    if (render.current) return;
    if (navigationPayload === null) return;
    fetchData(navigationPayload);
  }, [navigationPayload]);

  if (isLoading) {
    return <div className="w-full h-full bg-sky-800"></div>;
  }
  if (isError) {
    return <div className="w-full h-full bg-red-300"></div>;
  }
  return <UserProfileResult data={data} />;
};

export default UserProfile;
