import clsx from 'clsx';
import React from 'react';
import { useAppState } from '../hooks/useAppState';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  title: string;
  color?: string;
  backgroundColor?: string;
}

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
        'px-6 py-4 rounded-lg font-semibold transition-all ease-in-out duration-200 flex justify-center items-center border-4 border-black/60 active:scale-95 active:opacity-85',
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
      <span>{title}</span>
    </button>
  );
};
