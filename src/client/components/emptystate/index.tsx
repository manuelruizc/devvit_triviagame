import React from 'react';
import { Button } from '../../ui/Button';
import { useAppState } from '../../hooks/useAppState';

const EmptyState = () => {
  const { goBack } = useAppState();
  return (
    <div className={'w-full flex-1 flex justify-center flex-col items-center'}>
      <div className={'w-10/12 flex-1 flex justify-center flex-col items-center max-w-[1250px]'}>
        <div
          className={'w-full aspect-square lg:w-8/12'}
          style={{
            backgroundImage: 'url(/cat/cat-empty-state.png',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
          }}
        />
      </div>
    </div>
  );
};

export default EmptyState;
