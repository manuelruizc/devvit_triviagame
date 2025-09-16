import React from 'react';

const Root = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        backgroundImage: 'url(/bg_wide.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
      }}
      className="w-full h-full"
    >
      {children}
    </div>
  );
};

export default Root;
