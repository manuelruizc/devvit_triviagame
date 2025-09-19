import { GameScreens, useAppState } from '../../hooks/useAppState';
import { useAPI } from '../../hooks/useAPI';
import { Button, BUTTON_CLASS } from '../../ui/Button';
import clsx from 'clsx';
import {
  ACCENT_COLOR,
  ACCENT_COLOR2,
  ACCENT_COLOR3,
  ACCENT_COLOR4,
  ACCENT_COLOR6,
} from '../../helpers/colors';
import ScreenTitle from '../../ui/screentitle';

const MainMenu = () => {
  const { data, isReady, navigate, dailyTrivia, postTriviaAnswered } = useAppState();
  const { postQuestions, resetData, resetDataCustom } = useAPI();
  if (!isReady) return null;
  const { metrics, achievements } = data;
  const {
    // totalQuestionsAnswered,
    // correctAnswers,
    // longestStreak,
    // currentStreak,
    // totalPoints,
    // totalTime,
    // fastestDCSession,
    // totalSessions,
    // highestScoreSession,
    // hintsUsed,
  } = metrics;

  return (
    <div
      className={clsx(
        'w-full h-full flex flex-col justify-center items-center overflow-hidden overflow-x-hidden overflow-y-hidden'
        // 'md:bg-blue-500',
        // 'sm:bg-green-500',
        // 'lg:bg-emerald-800',
        // 'xl:bg-purple-500',
        // '2xl:bg-orange-500',
      )}
      style={{
        backgroundImage: 'url(/bg_wide.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        className={clsx(
          'w-full h-full flex flex-col justify-center items-center',
          'sm:',
          'md:',
          'lg:',
          'xl:max-w-[1250px]',
          '2xl:'
        )}
      >
        <div className={clsx('w-full flex flex-col justify-center items-center flex-1')}>
          <div
            className="w-3/5 aspect-square sm:w-3/12"
            style={{
              backgroundImage: 'url(/cat/logo.png',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'contain',
            }}
          ></div>
          <ScreenTitle
            title={`Welcome${data.member ? ` u/${data.member}` : ''}!`}
            className="mb-2"
          />
        </div>
        <div className={clsx('w-full flex flex-1 flex-col justify-end items-center')}>
          <Button
            onClick={() => navigate(GameScreens.INGAME, 'dc')}
            title={postTriviaAnswered ? 'CHALLENGE COMPLETED' : 'COMPLETE DAILY CHALLENGE'}
            className={BUTTON_CLASS}
            backgroundColor={ACCENT_COLOR}
            disabled={postTriviaAnswered}
          />
          <Button
            onClick={() => navigate(GameScreens.INGAME, 'fp')}
            title="FREE PLAY"
            className={BUTTON_CLASS}
            backgroundColor={ACCENT_COLOR2}
          />
          <Button
            onClick={() => navigate(GameScreens.UCG)}
            title="CREATE QUIZ"
            className={BUTTON_CLASS}
            backgroundColor={ACCENT_COLOR3}
          />
          <Button
            onClick={() => navigate(GameScreens.LEADERBOARDS)}
            title="LEADERBOARDS"
            className={BUTTON_CLASS}
            backgroundColor={ACCENT_COLOR6}
          />
          <Button
            onClick={() => navigate(GameScreens.ACHIEVEMENTS)}
            title="ACHIEVEMENTS"
            className={BUTTON_CLASS}
            backgroundColor={ACCENT_COLOR4}
          />
          {/* {data.member === 'webdevMX' ? (
            <button onClick={postQuestions}>PostQuestions</button>
          ) : null} */}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
