import clsx from 'clsx';
import { Button } from '../../ui/Button';
import { DC_CLUE_COST, FP_CLUE_COST, useTrivia } from '../../hooks/useTrivia';

const HelpersButtons = () => {
  const { clueIsActive, activateClue, coins, type } = useTrivia();
  const clueCost = type === 'dc' ? DC_CLUE_COST : FP_CLUE_COST;

  return (
    <div className={clsx('w-full flex justify-center items-center')}>
      {clueCost > coins || clueIsActive ? null : (
        <Button
          title="R"
          className={clsx('w-12 h-12 rounded-xl border border-black/60')}
          onClick={() => activateClue(clueCost)}
        />
      )}
    </div>
  );
};

export default HelpersButtons;
