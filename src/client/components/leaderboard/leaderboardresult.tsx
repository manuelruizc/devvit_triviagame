import React from 'react';

const LeaderboardResult = ({ data }: { data: any[] }) => {
  return <div className="w-full h-full bg-purple-400">{JSON.stringify(data)}</div>;
};

export default LeaderboardResult;
