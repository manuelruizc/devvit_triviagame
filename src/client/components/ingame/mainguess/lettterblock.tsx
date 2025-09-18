import clsx from 'clsx';
import { ACCENT_COLOR } from '../../../helpers/colors';

const LetterBlock = ({
  letter,
  activeBorder,
  wrongGuess,
  isRevealed,
  index,
  showLength,
}: {
  letter: string;
  index: number;
  activeBorder: boolean;
  wrongGuess: boolean;
  isRevealed: boolean;
  showLength: boolean;
}) => {
  if (letter === ' ')
    return (
      <div
        className={clsx(
          'w-2 h-6 flex justify-center items-center mb-2 bg-transparent',
          isRevealed && ''
        )}
      />
    );
  return (
    <Letter
      key={`${letter}-${index}`}
      showLength={showLength}
      wrongGuess={wrongGuess}
      activeBorder={activeBorder}
      isRevealed={isRevealed}
      letter={letter}
      index={index}
    />
  );
};

const Letter = ({
  activeBorder,
  isRevealed,
  wrongGuess,
  showLength,
  letter,
  index,
}: {
  activeBorder: boolean;
  isRevealed: boolean;
  wrongGuess: boolean;
  showLength: boolean;
  letter: string;
  index: number;
}) => {
  return (
    <div
      className={clsx(
        'h-6 flex justify-center items-center mb-2 text-black',
        showLength && 'border-b-2',
        isRevealed && 'border-2'
      )}
      style={{ borderBottomColor: activeBorder ? ACCENT_COLOR : undefined }}
    >
      <div className="w-full h-full flex justify-center items-center">
        {letter === '~' ? null : (
          <Char key={`${letter}-${index}`} letter={letter} wrongGuess={wrongGuess} />
        )}
      </div>
    </div>
  );
};

const Char = ({ letter, wrongGuess }: { letter: string; wrongGuess: boolean }) => {
  return (
    <span
      className={clsx(
        'transition-all duration-500 ease-in-out text-xl lg:text-2xl xl:text-4xl',
        wrongGuess && 'text-red-500'
      )}
    >
      {letter.toUpperCase()}
    </span>
  );
};

export default LetterBlock;
