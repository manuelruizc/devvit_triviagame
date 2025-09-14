import { useCallback, useEffect, useState } from 'react';
import { AddToLeaderBoardResponse, InitResponse } from '../../shared/types/api';

interface User {
  username: string | null;
}

interface ApiHookInterface {
  testEndpoint: () => void;
  addToLeaderboard: (score: number) => void;
  user: User;
}

export const useAPI = (): ApiHookInterface => {
  const [user, setUser] = useState<User>({ username: null });
  const testEndpoint = useCallback(async () => {
    try {
      const res = await fetch('/api/test');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: any = await res.json();
      setUser((prev) => ({
        ...prev,
        username: data?.username || null,
      }));
    } catch (err) {
      console.error('Failed to init counter', err);
    }
  }, []);

  const addToLeaderboard = useCallback(
    async (score: number) => {
      if (!user) return null;
      if (!user.username || user.username.length === 0) return null;
      try {
        const res = await fetch('/api/add_to_leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user.username, score }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: AddToLeaderBoardResponse = await res.json();
        console.log({ data });
      } catch (err) {
        console.error('Failed to save score in leaderboard', err);
      }
    },
    [user]
  );

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/api/init');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: InitResponse = await res.json();
        if (data.type !== 'init') throw new Error('Unexpected response');
        setUser((prev) => ({
          ...prev,
          username: data?.username || null,
        }));
      } catch (err) {
        console.error('Error', err);
      }
    };
    void init();
  }, []);

  return {
    testEndpoint,
    addToLeaderboard,
    user,
  };
};
