import React from 'react';
import { useAppState } from '../../../hooks/useAppState';

const SuccessFinish = () => {
  const { goBack } = useAppState();
  return (
    <div className="w-full h-full bg-green-300">
      <button onClick={goBack}>Go Back</button>
    </div>
  );
};

export default SuccessFinish;
