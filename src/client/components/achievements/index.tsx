import { ACHIEVEMENTS, useAppState } from '../../hooks/useAppState';

const Achievements = () => {
  const { goBack } = useAppState();
  return (
    <div className="w-full h-full bg-amber-400 flex flex-col justify-center items-center">
      <button onClick={goBack}>Go Back</button>
      <span>{'Achievements'}</span>
      <div className="w-full flex flex-wrap max-w-full">
        {ACHIEVEMENTS.map((achievement) => (
          <div className="flex flex-col justify-center items-center flex-1/5" key={achievement}>
            <div className="w-4 h-4 bg-fuchsia-400"></div>
            <span>{achievement}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
