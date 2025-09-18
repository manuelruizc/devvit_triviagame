import clsx from 'clsx';
import { ACCENT_COLOR, ACCENT_COLOR4, PRIMARY_COLOR } from '../../../helpers/colors';

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
          'w-3 h-6 flex justify-center items-center mb-2 bg-transparent',
          isRevealed && ''
        )}
      />
    );
  if (letter === '~' && !isRevealed)
    return (
      <div
        className={clsx(
          'w-4 h-6 flex justify-center items-center mb-2 bg-transparent mr-0.5 rounded-tr-sm rounded-tl-sm',
          activeBorder && 'animate-pulse',
          isRevealed && '',
          showLength && 'border-b-2'
        )}
        style={{ backgroundColor: activeBorder ? PRIMARY_COLOR : undefined }}
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
        'w-4 h-6 flex justify-center items-center mb-2 text-black mr-0.5',
        showLength && 'border-2',
        isRevealed && 'border-2',
        activeBorder && 'animate-pulse'
      )}
      style={{ background: activeBorder ? `${ACCENT_COLOR4} !important` : undefined }}
    >
      <div className="w-full h-full flex justify-center items-center">
        {letter === '~' ? null : (
          <Char
            key={`${letter}-${index}`}
            letter={letter}
            wrongGuess={wrongGuess}
            isRevealed={isRevealed}
          />
        )}
      </div>
    </div>
  );
};

const Char = ({
  letter,
  wrongGuess,
  isRevealed,
}: {
  letter: string;
  wrongGuess: boolean;
  isRevealed: boolean;
}) => {
  return (
    <span
      className={clsx(
        'transition-all duration-500 ease-in-out text-xl lg:text-2xl xl:text-4xl',
        wrongGuess && 'text-red-500'
      )}
      style={{ color: isRevealed ? PRIMARY_COLOR : undefined }}
    >
      {letter.toUpperCase()}
    </span>
  );
};

export default LetterBlock;
