import { useTrivia } from '../../../hooks/useTrivia';
import SuccessFinish from './SuccessFinish';
import RunOutOfTime from './RunOutOfTime';

const Finished = () => {
  const { gameStatus } = useTrivia();
  if (gameStatus === 'finished-main-guess-correct') {
    return <SuccessFinish />;
  }
  return <RunOutOfTime />;
};

export default Finished;
