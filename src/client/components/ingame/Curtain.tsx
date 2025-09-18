import clsx from 'clsx';
import { useTrivia } from '../../hooks/useTrivia';
import GlissandoWord from '../../ui/glissandotext';
import {
  ACCENT_COLOR,
  ACCENT_COLOR3,
  ACCENT_COLOR4,
  ERROR_COLOR,
  SUCCESS_COLOR,
} from '../../helpers/colors';

const Curtain = () => {
  const {
    gameStatus,
    trivia: {},
  } = useTrivia();

  return (
    <div
      className={clsx(
        'absolute top-0 left-0 w-full h-full transition-all duration-300 ease-in-out flex justify-center items-center pointer-events-none',
        gameStatus === 'between' && 'pointer-events-auto'
      )}
    >
      <div className="relative w-full h-full">
        <CurtainManager />
      </div>
    </div>
  );
};

const CurtainManager = () => {
  const { curtainState } = useTrivia();
  if (curtainState === 'hidden') return null;
  else if (curtainState === 'bank')
    return (
      <CurtainItem text="Banked! 🤑💰😻" brightColor="text-yellow-400" glowColor="251, 191, 36" />
    );
  else if (curtainState === 'error')
    return <CurtainItem brightColor={ERROR_COLOR} glowColor="245, 106, 106" text="Close one!" />;
  else if (curtainState === 'run_out_of_time')
    return <CurtainItem brightColor={ERROR_COLOR} glowColor="245, 106, 106" text="Time’s up!" />;
  else if (curtainState === 'good_answer')
    return <CurtainItem text="Noice!" glowColor="60, 196, 144" brightColor={SUCCESS_COLOR} />;
  else if (curtainState === 'perfect_chain')
    return (
      <CurtainItem brightColor={ACCENT_COLOR4} glowColor="243, 91, 170" text="Perfect Chain!" />
    );
  return <CurtainItem text="I got you!" brightColor={ACCENT_COLOR} glowColor="194, 163, 245" />;
};

const CurtainItem = ({
  text,
  glowColor = 'red',
  brightColor = 'red',
}: {
  text: string;
  glowColor?: string;
  brightColor?: string;
}) => {
  const { resetCurtainState } = useTrivia();

  return (
    <div className="flex-col top-0 left-0 w-full h-full flex justify-center items-center">
      <div className="w-full flex-1 pointer-events-none flex justify-center items-center">
        <GlissandoWord word={text} brightColor={'transparent'} onComplete={resetCurtainState} />
      </div>
      <div className="w-full flex-2 pointer-events-none" />
    </div>
  );
};

export default Curtain;
