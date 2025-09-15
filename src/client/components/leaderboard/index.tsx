import React, { useCallback, useEffect, useState } from 'react';
import { POST_REQUEST } from '../../helpers/https';
import LeaderboardResult from './leaderboardresult';

const Leaderboard = ({ leaderboardKey }: { leaderboardKey: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const fetchData = useCallback(async (key: string) => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return;
    try {
      const fetchedData: any[] = await POST_REQUEST<any[]>('', {});
      setData([...fetchedData]);
      setIsLoading(false);
      setIsError(false);
    } catch (e) {
      setIsError(false);
      return;
    }
  }, []);

  useEffect(() => {
    fetchData(leaderboardKey);
  }, []);
  if (isLoading) {
    return <div className="w-full h-full bg-sky-800"></div>;
  }
  if (isError) {
    return <div className="w-full h-full bg-green-300"></div>;
  }
  return <LeaderboardResult />;
};

export default Leaderboard;
