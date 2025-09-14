export type InitResponse = {
  type: 'init' | 'add_to_leaderboard';
  // postId: string;
  // count: number;
  username: string;
};

export type IncrementResponse = {
  type: 'increment';
  postId: string;
  count: number;
};

export type AddToLeaderBoardResponse = {
  type: 'add_to_leaderboard';
  username?: string;
  score: number;
  rank: number;
  leaderboard: any[];
};

export type DecrementResponse = {
  type: 'decrement';
  postId: string;
  count: number;
};
