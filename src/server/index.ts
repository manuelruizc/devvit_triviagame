import express from 'express';
import { InitResponse, AddToLeaderBoardResponse } from '../shared/types/api';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';
import leaderboardRoute from './routes/leaderboard';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/api/placeholder',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const [, username] = await Promise.all([redis.get('count'), reddit.getCurrentUsername()]);

      res.json({
        type: 'init',
        // postId: postId,
        // count: count ? parseInt(count) : 0,
        username: username ?? 'anonymous',
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

router.post<
  { postId: string },
  AddToLeaderBoardResponse | { status: string; message: string },
  { username: string; score: number }
>('/api/add_to_leaderboard', async (_req, res): Promise<void> => {
  const { postId } = context;
  try {
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }
    const { username, score } = _req.body;
    await redis.zAdd('leaderboard', { member: username, score: score * -1 });
    const storedScore = await redis.zScore('leaderboard', username);
    if (!storedScore) {
      // Score wasn't added properly
      res.json({
        username,
        type: 'add_to_leaderboard',
        rank: 69,
        leaderboard: [69],
        score,
      });
      return;
    }
    // Get the user's rank (0-based)
    const rank = await redis.zRank('leaderboard', username);

    // Get top 100 scores - remove the { by: 'score' } option
    const leaderboardData = await redis.zRange('leaderboard', 0, 99);

    // Convert back to positive scores and format
    const leaderboard = leaderboardData.map((item) => ({
      username: item.member,
      score: -item.score, // Convert back to positive
      rank: leaderboardData.indexOf(item) + 1, // Calculate rank
    }));

    // If you want to include the current user's rank in response:
    const userRank = rank ? rank + 1 : 69; // Convert to 1-based
    res.json({
      username,
      type: 'add_to_leaderboard',
      rank: userRank,
      leaderboard,
      score: storedScore * -1,
    });
  } catch (error) {
    let errorMessage = 'Unknown error during leadboard registering';
    if (error instanceof Error) {
      errorMessage = `Initialization failed: ${error.message}`;
    }
    res.status(400).json({ status: 'error', message: errorMessage });
  }
});

router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    try {
      if (!postId) {
        console.error('API Init Error: postId not found in devvit context');
        res.status(400).json({
          status: 'error',
          message: 'postId is required but missing from context',
        });
        return;
      }
      const username = await reddit.getCurrentUsername();
      res.json({ username: username || 'anonymous', type: 'init' });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// Use router middleware
app.use(router);
app.use(leaderboardRoute);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
