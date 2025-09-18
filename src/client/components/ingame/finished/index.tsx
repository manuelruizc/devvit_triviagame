import { useTrivia } from '../../../hooks/useTrivia';
import SuccessFinish from './SuccessFinish';
import RunOutOfTime from './RunOutOfTime';

const Finished = () => {
  const { gameStatus, type } = useTrivia();
  return <SuccessFinish finished={type === 'fp' || gameStatus === 'finished-main-guess-correct'} />;
};

export default Finished;
