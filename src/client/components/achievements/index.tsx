import clsx from 'clsx';
import { ACHIEVEMENTS, AchievementsMetadata, useAppState } from '../../hooks/useAppState';
import { ACCENT_COLOR, ACCENT_COLOR2, ACCENT_COLOR3, ACCENT_COLOR6 } from '../../helpers/colors';
import GoBackButton from '../../ui/GoBackButton';
import { useMemo } from 'react';
import { BasicAPI } from '../../../shared/types/basic';
import ScreenTitle from '../../ui/screentitle';

const Achievements = () => {
  const { data, isReady } = useAppState();
  const orderedAchievements = useMemo<BasicAPI.AchievementType[]>(() => {
    if (!isReady) return [];
    const ans: BasicAPI.AchievementType[] = [];
    for (const achiev of ACHIEVEMENTS) {
      if (data.achievements[achiev]) {
        ans.push(achiev);
      }
    }
    for (const achiev of ACHIEVEMENTS) {
      if (!data.achievements[achiev]) {
        ans.push(achiev);
      }
    }

    return ans;
  }, [isReady, data]);

  if (!isReady) return null;
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full h-full flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-[1250px]">
          <GoBackButton />
        </div>
        <div className="w-full flex justify-center items-center mb-4">
          <ScreenTitle title="ACHIEVEMENTS" />
        </div>
        <div className="w-full flex flex-wrap justify-center items-center max-w-[1250px]">
          {orderedAchievements.map((achievement) => (
            <div
              key={achievement}
              className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 2xl:w-1/3 p-2 flex flex-col items-center mb-0.5 lg:mb-1 box-border px-0.5"
            >
              <div className="w-8/12 aspect-square">
                <div
                  className={clsx(
                    'w-full h-full aspect-square bg-center bg-contain bg-no-repeat',
                    data.achievements[achievement] ? '' : 'filter grayscale'
                  )}
                  style={{
                    backgroundImage: `url(/badges/${achievement}.png)`,
                    width: '100%',
                    height: '100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
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
                <span className="font-semibold">
                  {AchievementsMetadata[achievement].title.toUpperCase()}
                </span>
                <span className="text-sm">{AchievementsMetadata[achievement].description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
