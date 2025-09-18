import clsx from 'clsx';
import React from 'react';
import { useAppState } from '../hooks/useAppState';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  title: string;
  color?: string;
  backgroundColor?: string;
}

export const BUTTON_CLASS = clsx(
  'w-10/12 mb-2 text-sm relative',
  'sm:w-10/12',
  'md:w-10/12 md:mb-6',
  'lg:w-7/12 lg:mb-8 lg:text-lg',
  'xl:w-6/12',
  '2xl:w-6/12'
);

export const BUTTON_CLASS_NO_TEXT = clsx(
  'w-10/12 mb-2 relative',
  'sm:w-10/12',
  'md:w-10/12 md:mb-6',
  'lg:w-7/12 lg:mb-8',
  'xl:w-6/12',
  '2xl:w-6/12'
);
export const BUTTON_CLASS_ONLY_WIDTH = clsx(
  'w-10/12 relative',
  'sm:w-10/12',
  'md:w-10/12',
  'lg:w-7/12',
  'xl:w-6/12',
  '2xl:w-6/12'
);

export const Button: React.FC<ButtonProps> = ({
  children,
  color,
  backgroundColor,
  title,
  className,
  ...props
}) => {
  const { playButtonSound } = useAppState();
  return (
    <button
      className={clsx(
        'px-6 py-2.5 rounded-lg font-semibold transition-all ease-in-out duration-200 flex justify-center items-center border-4 border-black/60 active:scale-95 active:opacity-85 relative z-0 overflow-hidden',
        className,
        props.disabled && 'opacity-85 active:opacity-85 active:scale-100'
      )}
      {...props}
      onClick={(e) => {
        playButtonSound();
        if (props.onClick) props.onClick(e);
      }}
      style={{ ...props.style, color, backgroundColor }}
    >
      {children}
      <span className="z-10">{title}</span>
    </button>
  );
};
