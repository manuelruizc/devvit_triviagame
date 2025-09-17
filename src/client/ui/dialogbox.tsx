import React, { useState } from 'react';
import { PRIMARY_COLOR } from '../helpers/colors';

interface DialogBoxProps {
  message?: string;
  onOk?: () => void;
  isVisible?: boolean;
}

const DialogBox: React.FC<DialogBoxProps> = ({
  message = "Hi there, Player! Welcome! You see, I seem seen you have forgotten something really important. It's portant It's right tip the just can't remember it! I'm goings, and based on that based trou guess angued on that info you'll have what I'm trying to reme to remember. Are you ready? Let's go!",
  onOk,
  isVisible = true,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="bg-gray-100 rounded-3xl border-4 border-black/60 p-4 max-w-md w-full shadow-2xl relative"
      style={{
        background: 'linear-gradient(135deg, #F5BDD8 0%, #E8A5C8 100%)',
      }}
    >
      <div className="text-black text-sm leading-relaxed mb-0.5 font-medium">{message}</div>
      {/* <div className="flex justify-end">
        <button
          onClick={onOk}
          className="border-4 border-black/60 rounded-full px-8 py-2 text-black font-semibold hover:bg-gray-50 hover:shadow-lg transition-all duration-200 active:scale-95"
          style={{ backgroundColor: PRIMARY_COLOR }}
        >
          OK
        </button>
      </div> */}
    </div>
  );
};

export default DialogBox;
