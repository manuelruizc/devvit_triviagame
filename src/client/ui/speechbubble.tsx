import clsx from 'clsx';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

export default function SpeechBubble({
  text = '',
  className,
  speed = 96,
  noAnimation = false,
  noTail = false,
  onFinish,
}: {
  className?: string;
  text?: string;
  speed?: number;
  noAnimation?: boolean;
  noTail?: boolean;
  onFinish?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState(noAnimation ? text : '');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = useMemo(() => text.split(' '), [text]);
  const finished = useRef<boolean>(false);

  useEffect(() => {
    if (noAnimation) return;
    if (currentWordIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedText(words.slice(0, currentWordIndex + 1).join(' '));
        setCurrentWordIndex(currentWordIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentWordIndex, words, speed, noAnimation]);

  useEffect(() => {
    if (noAnimation && text.length !== displayedText.length) {
      setDisplayedText(text);
      return;
    }
    if (text.length === displayedText.length && onFinish) {
      onFinish();
      finished.current = true;
    }
    if (finished.current && text.length !== displayedText.length) {
      finished.current = false;
      setTimeout(() => {
        setDisplayedText('');
        setCurrentWordIndex(0);
      }, 700);
    }
  }, [text, displayedText, noAnimation]);

  return (
    <div
      className={clsx(
        'py-6 px-6 rounded-2xl lg:rounded-xl border-4 border-black/60 flex justify-center items-center bg-white relative transition-all ease-in-out duration-200',
        className ? className : 'w-full'
      )}
    >
      <span
        className={clsx(
          'text-sm text-center leading-snug',
          'sm:text-base',
          'md:text-lg',
          'xl:text-lg'
        )}
      >
        {displayedText}
      </span>
      {!noTail ? (
        <div
          className={clsx(
            'absolute bottom-0 left-0 w-full flex justify-center items-center pointer-events-none translate-y-[59%]'
          )}
        >
          <div
            className={clsx(
              '-rotate-45 bg-white w-8 h-8 border-black/60 border-l-4 border-b-4 rounded-bl-lg'
            )}
          ></div>
        </div>
      ) : null}
    </div>
  );
}
