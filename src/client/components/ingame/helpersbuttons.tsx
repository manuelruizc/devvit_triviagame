import clsx from 'clsx';
import { Button, BUTTON_CLASS_NO_TEXT, BUTTON_CLASS_ONLY_WIDTH } from '../../ui/Button';
import { DC_CLUE_COST, FP_CLUE_COST, useTrivia } from '../../hooks/useTrivia';
import { ACCENT_COLOR3, SECONDARY_COLOR } from '../../helpers/colors';

const HelpersButtons = () => {
  const { clueIsActive, saveToBank, activateClue, gameStatus, coins, type, toBankSeconds, streak } =
    useTrivia();
  const clueCost = type === 'dc' ? DC_CLUE_COST : FP_CLUE_COST;

  if (gameStatus === 'main-guess') {
    return null;
  }

  return (
    <div
      className={clsx(
        'flex py-4 justify-center items-end pb-1',
        type === 'dc' && 'justify-end',
        BUTTON_CLASS_ONLY_WIDTH
      )}
    >
      <TriviaHelperButton
        disabled={clueIsActive || clueCost > coins}
        onClick={() => activateClue(clueCost)}
        cost={clueCost}
        icon="/icons/remove.png"
      />

      {type === 'fp' ? (
        <Button
          disabled={toBankSeconds <= 0 || streak <= 0}
          title={
            streak > 0
              ? toBankSeconds === 0
                ? 'Time limit to save over'
                : `Save it on your bag ${toBankSeconds}s`
              : 'Start a chain!'
          }
          className={clsx(
            'px-4 h-12 rounded-xl border border-black/60',
            (toBankSeconds <= 0 || streak <= 0) && 'opacity-50'
          )}
          onClick={() => saveToBank(false)}
        />
      ) : null}
    </div>
  );
};

export const TriviaHelperButton = ({
  disabled,
  onClick,
  cost,
  icon,
}: {
  disabled: boolean;
  onClick: () => void;
  cost: number;
  icon: string;
}) => {
  return (
    <button
      disabled={disabled}
      className={clsx(
        'w-16 h-12 box-border rounded-xl border-4 border-black/60 active:scale-95 duration-200 ease-in-out transition-all relative lg:w-32 lg:h-16 px-2',
        disabled && 'opacity-50 active:scale-100'
      )}
      style={{ backgroundColor: ACCENT_COLOR3 }}
      onClick={onClick}
    >
      <img src={icon} className="w-12/12 h-12/12 object-contain object-center" />
      <div
        className="absolute -top-2/4 -right-7/12 flex justify-center items-center border-2 rounded-lg px-1"
        style={{ backgroundColor: ACCENT_COLOR3, borderColor: SECONDARY_COLOR }}
      >
        <img
          src="/icons/coins.png"
          className="w-4 h-4 lg:w-6 lg:h-6 object-contain object-center"
        />
        <span className="text-base lg:text-lg ml-1 lg:ml-2">{cost}</span>
      </div>
    </button>
  );
};

export default HelpersButtons;
