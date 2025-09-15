import { redis } from '@devvit/web/server';
import { BasicAPI } from '../../shared/types/basic';
import { LeaderboardAPI } from '../../shared/types/leaderboard';

export const saveUserMetrics = async (data: BasicAPI.GetUserBasicData, member: string) => {
  try {
    const { metrics: newMetrics } = data;
    const temp = Object.fromEntries(Object.entries(newMetrics).map(([k, v]) => [k, String(v)]));
    const hashKey = `${BasicAPI.USER_HASH_NAMES.USER_INFO},${member}`;
    await redis.hSet(hashKey, { ...temp });
    return true;
  } catch (e) {
    return false;
  }
};
export const saveUserAchievements = async (data: BasicAPI.GetUserBasicData, member: string) => {
  try {
    const { achievements: newAchievements } = data;
    const hashKey = `${BasicAPI.USER_HASH_NAMES.USER_ACHIEVEMENTS},${member}`;
    const temp = Object.fromEntries(
      Object.entries(newAchievements).map(([k, v]) => [k, String(1)])
    );
    console.log(newAchievements, hashKey);
    await redis.hSet(hashKey, { ...temp });
    return true;
  } catch (e) {
    return false;
  }
};
