import { useEffect, useState } from 'react';

interface ArchedTextProps {
  text: string;
  radius?: number;
  fontSize?: number;
  color?: string;
  animationDuration?: number;
  className?: string;
}

const ArchedText: React.FC<ArchedTextProps> = ({
  text,
  radius = 150,
  fontSize = 24,
  color = '#333',
  animationDuration = 100,
  className = '',
}) => {
  const [visibleLetters, setVisibleLetters] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLetters((prev) => {
        if (prev < text.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, animationDuration);

    return () => clearInterval(timer);
  }, [text.length, animationDuration]);

  const letters = text.split('').map((letter, index) => {
    // Calculate angle for each letter (reduced arc for less pronounced curve)
    const totalAngle = Math.PI * 0.6; // Increased to 108 degrees for more spacing
    const angleStep = totalAngle / (text.length - 1);
    const angle = angleStep * index - totalAngle / 2; // Center the arc

    // Calculate position
    const x = Math.sin(angle) * radius;
    const y = -Math.cos(angle) * radius + radius; // Flip and offset

    // Calculate rotation for letter orientation
    const rotation = (angle * 180) / Math.PI;

    return {
      letter: letter === ' ' ? '\u00A0' : letter, // Non-breaking space for spaces
      x,
      y,
      rotation,
      visible: index < visibleLetters,
    };
  });

  const svgWidth = radius * 2 + fontSize;
  const svgHeight = radius * 0.8 + fontSize;

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="overflow-visible"
      >
        {letters.map((letterData, index) => (
          <text
            key={index}
            x={letterData.x + svgWidth / 2}
            y={letterData.y + fontSize}
            fontSize={fontSize}
            fill={color}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${letterData.rotation}, ${letterData.x + svgWidth / 2}, ${letterData.y + fontSize})`}
            style={{
              opacity: letterData.visible ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: '500',
            }}
          >
            {letterData.letter}
          </text>
        ))}
      </svg>
    </div>
  );
};
