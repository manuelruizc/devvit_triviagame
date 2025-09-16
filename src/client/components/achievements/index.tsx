import clsx from 'clsx';
import { ACHIEVEMENTS, useAppState } from '../../hooks/useAppState';
import {
  ACCENT_COLOR,
  ACCENT_COLOR2,
  ACCENT_COLOR3,
  ACCENT_COLOR6,
  SECONDARY_COLOR,
} from '../../helpers/colors';
import GoBackButton from '../../ui/GoBackButton';

const COLORS = [ACCENT_COLOR, ACCENT_COLOR2, ACCENT_COLOR3, ACCENT_COLOR6];

const Achievements = () => {
  const { goBack, data, isReady } = useAppState();
  if (!isReady) return null;
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full h-full flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-[1250px]">
          <GoBackButton />
        </div>
        <div className="w-full flex justify-center items-center mb-4">
          <span className="text-lg font-bold">ACHIEVEMENTS</span>
        </div>
        <div className="w-full flex flex-wrap justify-center items-center max-w-[1250px]">
          {ACHIEVEMENTS.map((achievement) => (
            <div
              key={achievement}
              className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 2xl:w-1/3 p-2 flex flex-col items-center mb-1 box-border px-0.5"
            >
              <div className="w-8/12 aspect-square">
                <div
                  className={clsx(
                    'w-full h-full bg-center bg-contain bg-no-repeat',
                    data.achievements[achievement] ? '' : 'filter grayscale'
                  )}
                  style={{
                    backgroundImage: `url(/badges/${achievement}.png)`,
                  }}
                ></div>
              </div>
              <div
                className={clsx(
                  'w-9/12 mt-2 py-2 px-1 rounded-lg flex flex-col items-center border-4 text-center -translate-y-[40%]',
                  data.achievements[achievement]
                    ? 'border-black/60'
                    : 'opacity-75 border-gray-50/60'
                )}
                style={{
                  backgroundColor: data.achievements[achievement]
                    ? ACCENT_COLOR2
                    : 'rgba(200, 200, 200, 1)',
                }}
              >
                <span className="font-semibold">{achievement.toUpperCase()}</span>
                <span className="text-sm">
                  This is the description omg this is so bad omg is a description super force
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
