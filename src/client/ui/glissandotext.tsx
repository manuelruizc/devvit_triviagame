import React, { useState, useEffect } from 'react';

interface GlissandoWordProps {
  word?: string;
  duration?: number;
  delay?: number;
  className?: string;
  autoPlay?: boolean;
  repeat?: boolean;
  baseColor?: string;
  brightColor?: string;
  glowColor?: string;
  onComplete?: () => void;
}

const GlissandoWord: React.FC<GlissandoWordProps> = ({
  word = 'GLISSANDO',
  duration = 600,
  delay = 60,
  className = '',
  autoPlay = true,
  repeat = false,
  baseColor = 'text-white',
  brightColor = 'text-yellow-400',
  glowColor = '251, 191, 36', // RGB values for yellow-400
  onComplete = undefined,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const letters: string[] = word.split('');

  const playAnimation = (): void => {
    setIsPlaying(true);
    setActiveIndex(-1);

    letters.forEach((_, index) => {
      setTimeout(() => {
        setActiveIndex(index);
      }, index * delay);
    });

    // End the animation after all letters have played
    setTimeout(
      () => {
        setActiveIndex(letters.length); // Set to an index that doesn't exist
        setTimeout(() => {
          setIsPlaying(false);
          if (onComplete) {
            onComplete();
          }
          if (repeat) {
            setTimeout(() => playAnimation(), 500);
          }
        }, 200);
      },
      letters.length * delay + 200
    );
  };

  useEffect(() => {
    if (autoPlay) {
      playAnimation();
    }
  }, [word]);

  return (
    <span className={`inline-flex text-6xl font-bold tracking-wider ${className}`}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className={`
              inline-block transition-all duration-200 ease-out ${baseColor}
              ${index === activeIndex ? `${brightColor} scale-125 drop-shadow-lg` : ''}
            `}
          style={{
            textShadow:
              index === activeIndex
                ? `0 0 20px rgba(${glowColor}, 0.6), 0 0 40px rgba(${glowColor}, 0.3)`
                : 'none',
            transform: index === activeIndex ? 'translateY(-32px) scale(1.25)' : 'translateY(0px)',
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </span>
  );
};

export default GlissandoWord;
