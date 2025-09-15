import React from 'react';

const Root = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full h-full bg-green-300">{children}</div>;
};

export default Root;
