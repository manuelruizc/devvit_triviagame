import React, { useState, useEffect } from 'react';
import { ACCENT_COLOR4 } from '../helpers/colors';
import { useAppState } from '../hooks/useAppState';

interface Achievement {
  title: string;
  description: string;
  src?: string;
}

interface AchievementToastProps {
  achievement: Achievement;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  isVisible,
  onClose,
  duration = 2800,
}) => {
  const { playSound, stopAllSounds } = useAppState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      playSound('achievement');
      // Reset animation state when achievement changes
      setIsExpanded(false);
      setShouldShow(true);

      // Start expansion animation after a brief delay
      const expandTimer = setTimeout(() => {
        setIsExpanded(true);
      }, 200);

      // Auto-close after duration
      const closeTimer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(expandTimer);
        clearTimeout(closeTimer);
        stopAllSounds();
      };
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsExpanded(false);
    setTimeout(() => {
      setShouldShow(false);
      onClose();
    }, 600);
  };

  if (!shouldShow) return null;

  return (
    <div
      className={`
          relative overflow-hidden pointer-events-none
          shadow-2xl transition-all duration-500 ease-out cursor-pointer rounded-full
          flex justify-between items-center
          ${
            isExpanded
              ? 'w-72 sm:w-80 md:w-96 lg:w-96 xl:w-96 2xl:w-96 h-16 sm:h-18 md:h-20 rounded-full'
              : 'w-12 sm:w-14 md:w-16 lg:w-16 xl:w-16 2xl:w-16 h-12 sm:h-14 md:h-16 lg:h-16 xl:h-16 2xl:h-16 rounded-full opacity-0'
          }
        `}
      style={{ backgroundColor: ACCENT_COLOR4 }}
      onClick={handleClose}
    >
      {/* Shine effect */}
      {/* <div
        className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
          transform -skew-x-12 transition-transform duration-1000
          ${isExpanded ? 'translate-x-full' : '-translate-x-full'}
        `}
      /> */}

      {/* Icon container - circle that stays on the left */}
      <div
        className={`
          absolute left-0 top-0
          h-12/12 aspect-square
          rounded-full
          flex items-center justify-center
          transition-all duration-500 ease-out translate-x-0.5 overflow-hidden
          ${isExpanded ? 'scale-100' : 'scale-110'}
        `}
      >
        {/* Placeholder for icon - currently a bordered div */}
        <img
          src={achievement.src}
          className="h-full w-full aspect-square  rounded-full object-contain object-center"
        />
      </div>

      {/* Content container */}
      <div
        className={`
          absolute left-0 top-0 w-full h-full flex justify-center items-center
          transition-all duration-500 ease-out
          ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
        `}
      >
        <h3 className="text-white font-bold text-sm sm:text-base md:text-lg truncate">
          {achievement.title}
        </h3>
        <p className="text-white/80 text-xs sm:text-sm md:text-sm truncate">
          {achievement.description}
        </p>
      </div>
    </div>
  );
};

export default AchievementToast;
