import React, { useState, useCallback } from 'react';

interface KeyboardProps {
  onKeyPress?: (key: string) => void;
  onKeyRelease?: () => void;
  disabled?: boolean;
  className?: string;
}

// Define keyboard layout
const keyboardLayout = [
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
  ['SPACE'],
];
const MobileKeyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  onKeyRelease,
  disabled = false,
  className = '',
}) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (disabled || pressedKey) return;

      setPressedKey(key);
      const keyValue = key === 'SPACE' ? ' ' : key;
      onKeyPress?.(keyValue);
    },
    [disabled, pressedKey, onKeyPress]
  );

  const handleKeyRelease = useCallback(() => {
    if (!pressedKey) return;

    setPressedKey(null);
    onKeyRelease?.();
  }, [pressedKey, onKeyRelease]);

  const getKeyClasses = (key: string) => {
    const baseClasses =
      'flex items-center justify-center rounded-lg font-semibold select-none transition-all duration-150';
    const isPressed = pressedKey === key;
    const isDisabled = disabled || (pressedKey && pressedKey !== key);

    let sizeClasses = 'py-[4px] min-w-[32px] px-3 text-sm';
    if (key === 'SPACE') {
      sizeClasses = 'py-[4px] w-8/12 text-sm';
    }

    if (isDisabled) {
      return `${baseClasses} ${sizeClasses} bg-gray-200 text-gray-400 border border-gray-300`;
    }

    if (isPressed) {
      return `${baseClasses} ${sizeClasses} bg-blue-600 text-white shadow-lg border border-gray-300`;
    }

    return `${baseClasses} ${sizeClasses} bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer shadow-sm border border-gray-300`;
  };

  return (
    <div className={`bg-white w-full p-2 rounded-xl shadow-lg ${className} lg:hidden`}>
      <div className="space-y-[2px]">
        {keyboardLayout.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex justify-center gap-1 mb-[3px] ${rowIndex === 4 ? 'px-2' : ''}`}
          >
            {row.map((key) => (
              <button
                key={key}
                className={getKeyClasses(key)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleKeyPress(key);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleKeyRelease();
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleKeyPress(key);
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  handleKeyRelease();
                }}
                onMouseLeave={() => {
                  if (pressedKey === key) {
                    handleKeyRelease();
                  }
                }}
                disabled={disabled || Boolean(pressedKey && pressedKey !== key)}
              >
                {key === 'BACKSPACE' ? 'DEL' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileKeyboard;
