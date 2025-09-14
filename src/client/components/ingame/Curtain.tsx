import clsx from 'clsx';
import { useTrivia } from '../../hooks/useTrivia';
import useLeaderboard from '../../hooks/useLeaderboard';
import { useEffect } from 'react';
import { useAPI } from '../../hooks/useAPI';

const Curtain = () => {
  const {
    gameStatus,
    points,
    trivia: {},
    triviaHistory,
    correctAnswersCount,
  } = useTrivia();
  //   const { user } = useAPI();
  //   const { postScoreToDailyChallengeLeaderboard } = useLeaderboard();

  //   const finishGame = async () => {
  //     try {
  //       const data = await postScoreToDailyChallengeLeaderboard(user?.username || '', points);
  //       console.log('data,', data);
  //     } catch (e) {
  //       console.log('error');
  //     }
  //   };

  //   useEffect(() => {
  //     if (gameStatus === 'finished-main-guess-correct' || gameStatus === 'finished-run-out-of-time') {
  //       finishGame();
  //     }
  //   }, [gameStatus]);

  return (
    <div
      className={clsx(
        'absolute top-0 left-0 w-full h-full pointer-events-none transition-all duration-300 ease-in-out flex justify-center items-center',
        gameStatus !== 'between' &&
          gameStatus !== 'finished-main-guess-correct' &&
          gameStatus !== 'finished-run-out-of-time' &&
          'opacity-0',
        gameStatus === 'finished-main-guess-correct'
          ? 'bg-green-300'
          : gameStatus === 'finished-run-out-of-time'
            ? 'bg-red-500'
            : 'bg-black'
      )}
    >
      <span className="text-xs">{points}</span>
      <span className="text-xs">CorrectAnswers{correctAnswersCount}</span>
      {/* <span className="text-2xl">{JSON.stringify(userAnswers)}</span> */}
      <span className="text-xs">{JSON.stringify(triviaHistory)}</span>
    </div>
  );
};

export default Curtain;
