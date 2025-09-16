import React, { useCallback, useState } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { POST_REQUEST } from '../../helpers/https';
import { BasicAPI } from '../../../shared/types/basic';

const CreatePost = () => {
  const { data, isReady } = useAppState();
  const [dailyQuestions, setDailyQuestions] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createPost = useCallback(async () => {
    try {
      setIsLoading(true);
      setDailyQuestions('');
      const data = await POST_REQUEST(BasicAPI.BASIC_API_ENDPOINTS.CREATE_POST, {
        dailyChallenge: JSON.parse(dailyQuestions),
      });
      console.log(data);
      setIsLoading(false);
      setDailyQuestions('');
    } catch (e) {
      console.log('error', e);
      setIsLoading(false);
      setIsError(true);
    }
  }, [dailyQuestions]);

  if (!isReady) return null;
  if (data.member !== 'webdevMX') return null;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <textarea
        value={dailyQuestions}
        onChange={(e) => setDailyQuestions(e.target.value)}
        className="bg-white"
      />
      <button onClick={createPost} disabled={dailyQuestions.length === 0}>
        Create Post
      </button>
    </div>
  );
};

export default CreatePost;
