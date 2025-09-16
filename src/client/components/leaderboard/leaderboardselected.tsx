import { useCallback, useEffect, useState } from 'react';
import { GET_REQUEST } from '../../helpers/https';
import LeaderboardResult from './leaderboardresult';
import { LeaderboardAPI } from '../../../shared/types/leaderboard';
import { useAppState } from '../../hooks/useAppState';

const LeaderboardSelected = ({ leaderboardKey }: { leaderboardKey: string }) => {
  const { data: userData, navigationPayload } = useAppState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);

  const fetchData = useCallback(
    async (key: string) => {
      try {
        if (!userData) return;
        if (!userData.member) return;
        const fetchedData: any[] = await GET_REQUEST<any[]>(
          LeaderboardAPI.LEADERBOARD_API_ENDPOINTS.GET_LEADERBOARD_WITH_KEY +
            `/${userData?.member || ''}/${key}`
        );
        setData(fetchedData);
        setIsLoading(false);
        setIsError(false);
      } catch (e) {
        setIsError(true);
        return;
      }
    },
    [userData]
  );

  useEffect(() => {
    fetchData(leaderboardKey);
  }, [leaderboardKey]);

  if (isLoading) {
    return <div className="w-full h-full bg-sky-800"></div>;
  }
  if (isError) {
    return <div className="w-full h-full bg-red-300"></div>;
  }
  return <LeaderboardResult data={data} />;
};

export default LeaderboardSelected;
