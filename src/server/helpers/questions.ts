import { redis } from '@devvit/web/server';
import { BasicAPI } from '../../shared/types/basic';

export async function saveQuestions(questions: any[]) {
  const hashKey = BasicAPI.QUESTION_HASHES.ALL_QUESTIONS;
  //   await redis.hDel(hashKey, ['questions']);
  //   return;
  // Check if the hash exists
  const exists = await redis.exists(hashKey);

  if (!exists) {
    // Initialize the hash with an empty array if it doesn't exist
    await redis.hSet(hashKey, { questions: JSON.stringify([]) });
  }

  // Get current questions
  const data = await redis.hGet(hashKey, 'questions');
  const currentQuestions: any[] = data ? JSON.parse(data) : [];

  // Merge new questions
  const updatedQuestions = [...currentQuestions, ...questions];

  // Save back to Redis
  await redis.hSet(hashKey, { questions: JSON.stringify(updatedQuestions) });
  const _questions = await redis.hGet(BasicAPI.QUESTION_HASHES.ALL_QUESTIONS, 'questions');
  console.log(`Saved ${questions.length} new questions. Total: ${updatedQuestions.length}`);
  return _questions === undefined ? [] : JSON.parse(_questions);
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i]!, result[j]!] = [result[j]!, result[i]!]; // add ! here
  }
  return result;
}
