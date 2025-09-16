import { useAppState } from '../hooks/useAppState';

const GoBackButton = () => {
  const { goBack, playButtonSound } = useAppState();

  return (
    <div className="w-full flex justify-start items-center py-1 px-4 box-border">
      <button
        onClick={() => {
          playButtonSound();
          goBack();
        }}
      >
        <span className={'flex justify-start items-center'}>
          <span className={'text-lg mt-0.5 mr-0.5'}>{'< '}</span>
          <span>BACK</span>
        </span>
      </button>
    </div>
  );
};

export default GoBackButton;
