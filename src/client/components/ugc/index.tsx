import React, { useCallback, useState } from 'react';
import ScreenTitle from '../../ui/screentitle';
import GoBackButton from '../../ui/GoBackButton';
import clsx from 'clsx';
import { POST_REQUEST } from '../../helpers/https';
import { useAppState } from '../../hooks/useAppState';
import { navigateTo } from '@devvit/web/client';
import {
  ACCENT_COLOR,
  ACCENT_COLOR2,
  ACCENT_COLOR3,
  ERROR_COLOR,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  SUCCESS_COLOR,
} from '../../helpers/colors';
import CreatingPost from './creatingpost';

// Type definitions
export enum QuestionLevels {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export namespace BasicAPI {
  export namespace USER_HASH_NAMES {
    export const USER_INFO = 'user_info';
    export const USER_ACHIEVEMENTS = 'user_achievements';
  }

  export namespace QUESTION_HASHES {
    export const ALL_QUESTIONS = 'all_questions_hash';
  }

  export namespace BASIC_API_ENDPOINTS {
    export const INIT = '/api/init/basic_data';
    export const RESET_DATA = '/api/init/reset_data';
    export const USERS_DATA = '/api/users/data';
    export const SAVE_QUESTIONS = '/api/questions/save_questions';
    export const CREATE_POST = '/api/daily_challenge/create_post';
    export const GET_DAILY_CHALLENGE = '/api/daily_challenge/user_answered_already';
    export const GET_QUESTIONS = '/api/questions/get_questions';
    export const SAVE_POST_CHALLENGE = '/api/questions/save_post_challenge';
  }
  export enum BasicAPIResponseType {
    INIT = 'init_basic_data',
  }
  export type QuestionCategory =
    | 'entertainment'
    | 'sports'
    | 'reddit'
    | 'general'
    | 'history'
    | 'geography';

  export type CategoryMetrics = {
    [C in QuestionCategory as `${C}Count`]: number;
  } & {
    [C in QuestionCategory as `${C}Correct`]: number;
  };

  export type AchievementType =
    | 'firstquestion'
    | 'hotstreak'
    | 'firestreak'
    | 'bigbrains'
    | 'lightingfast'
    | 'justintime'
    | 'perfectionist'
    | 'ontheboard'
    | 'climber'
    | 'topten'
    | 'numberone'
    | 'none';

  export interface UserMetrics extends CategoryMetrics {
    totalQuestionsAnswered: number;
    correctAnswers: number;
    longestStreak: number;
    currentStreak: number;
    totalPoints: number;
    totalTime: number;
    fastestDCSession: number;
    totalSessions: number;
    highestScoreSession: number;
    hintsUsed: number;
    coins: number;
  }

  export interface ResetData {
    status: 'ok' | 'error';
  }

  export interface GetUserBasicData {
    type: BasicAPIResponseType.INIT;
    member?: string;
    allTimeDCRank: number;
    allTimeFPRank: number;
    dCRank: number;
    metrics: UserMetrics;
    achievements: Partial<Record<AchievementType, boolean>>;
    status: 'ok' | 'error';
  }
}

export interface Question {
  level: QuestionLevels;
  question: string;
  unlockedClue: string;
  answers: string[];
  correctAnswer: string;
  category: BasicAPI.QuestionCategory;
  type: 'guess' | 'trivia';
}

export interface DailyTrivia {
  questions: Question[];
  mainQuestion: string;
  mainAnswer: string;
  answerLength: number;
  category: BasicAPI.QuestionCategory;
}

// Internal quiz building interface
interface QuizQuestion {
  id: number;
  question: string;
  unlockedClue: string;
  answers: string[];
  correctAnswer: number;
  isMainGuess: boolean;
  level: QuestionLevels;
  category: BasicAPI.QuestionCategory;
}

// Main guess interface
interface MainGuess {
  question: string;
  answer: string;
}

const QuizBuilder: React.FC = () => {
  const { data } = useAppState();
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [quizTitle, setQuizTitle] = useState<string>('Forgetful Kitty Trivia');
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      question: '',
      unlockedClue: '',
      answers: ['', '', '', ''],
      correctAnswer: 0,
      isMainGuess: false,
      level: QuestionLevels.EASY,
      category: 'general',
    },
  ]);
  const [mainGuess, setMainGuess] = useState<MainGuess>({
    question: '',
    answer: '',
  });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentQuestion = currentTab;
  const totalTabs = questions.length + 2; // questions + main guess + title
  const isOnMainGuessTab = currentTab === questions.length;
  const isOnTitleTab = currentTab === questions.length + 1;

  const addQuestion = (): void => {
    if (questions.length < 5) {
      const newId = Math.max(...questions.map((q) => q.id)) + 1;
      setQuestions([
        ...questions,
        {
          id: newId,
          question: '',
          unlockedClue: '',
          answers: ['', '', '', ''],
          correctAnswer: 0,
          isMainGuess: false,
          level: QuestionLevels.EASY,
          category: 'general',
        },
      ]);
      setCurrentTab(questions.length); // Navigate to the new question
    }
  };

  const removeQuestion = (): void => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== currentQuestion);
      setQuestions(newQuestions);
      if (currentQuestion >= newQuestions.length) {
        setCurrentTab(Math.max(0, newQuestions.length - 1));
      }
    }
  };

  const updateQuestion = (field: keyof QuizQuestion, value: any): void => {
    const updated = [...questions];
    const currentQ = updated[currentQuestion];
    if (currentQ) {
      updated[currentQuestion] = { ...currentQ, [field]: value };
      setQuestions(updated);
    }
  };

  const updateAnswer = (answerIndex: number, value: string): void => {
    const updated = [...questions];
    const currentQ = updated[currentQuestion];
    if (currentQ && currentQ.answers) {
      const newAnswers = [...currentQ.answers];
      newAnswers[answerIndex] = value;
      updated[currentQuestion] = { ...currentQ, answers: newAnswers };
      setQuestions(updated);
    }
  };

  const updateMainGuess = (field: keyof MainGuess, value: string): void => {
    setMainGuess((prev) => ({ ...prev, [field]: value }));
  };

  const validateQuiz = (): boolean => {
    const errors: { [key: string]: boolean } = {};
    let isValid = true;

    // Validate main guess
    if (mainGuess.question.trim().length < 3) {
      errors['main-question'] = true;
      isValid = false;
    }
    if (mainGuess.answer.trim().length < 1) {
      errors['main-answer'] = true;
      isValid = false;
    }

    // Validate each regular question
    questions.forEach((question, qIndex) => {
      // Question text validation (minimum 3 characters)
      if (question.question.trim().length < 3) {
        errors[`question-${qIndex}`] = true;
        isValid = false;
      }

      // Answer validation (minimum 1 character each)
      question.answers.forEach((answer, aIndex) => {
        if (answer.trim().length < 1) {
          errors[`answer-${qIndex}-${aIndex}`] = true;
          isValid = false;
        }
      });
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleContinue = (): void => {
    if (!validateQuiz()) {
      alert(
        'Please fill in all required fields correctly:\n- Questions need at least 3 characters\n- All answers need at least 1 character\n- Main guess question and answer are required'
      );
      return;
    }

    const dailyTrivia: DailyTrivia = {
      questions: questions.map((q) => ({
        level: q.level,
        question: q.question,
        unlockedClue: q.unlockedClue,
        answers: q.answers,
        correctAnswer: q.answers[0] || '',
        category: q.category,
        type: 'trivia',
      })),
      mainQuestion: mainGuess.question,
      mainAnswer: mainGuess.answer,
      answerLength: mainGuess.answer.length,
      category: 'general',
    };
    createPost(quizTitle, dailyTrivia);
  };

  const createPost = useCallback(async (title: string, dailyTrivia: DailyTrivia) => {
    try {
      setIsLoading(true);
      const res: any = await POST_REQUEST(BasicAPI.BASIC_API_ENDPOINTS.CREATE_POST, {
        dailyChallenge: dailyTrivia,
        title,
        member: data!.member,
      });
      if (res.error) {
        setIsLoading(false);
        return;
      }
      setTimeout(() => {
        navigateTo(res.post.url as string);
      }, 4000);
    } catch (e) {
      setIsLoading(false);
    }
  }, []);

  const current = currentTab < questions.length ? questions[currentQuestion] : null;

  const hasTabErrors = (questionIndex: number): boolean => {
    const questionKey = `question-${questionIndex}`;
    const answerKeys = [0, 1, 2, 3].map((i) => `answer-${questionIndex}-${i}`);
    return !!validationErrors[questionKey] || answerKeys.some((key) => !!validationErrors[key]);
  };

  const hasMainGuessErrors = (): boolean => {
    return !!validationErrors['main-question'] || !!validationErrors['main-answer'];
  };

  // Simplified paw print
  const PawPrint = ({
    className = '',
    style,
  }: {
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <div className={`absolute opacity-15 ${className}`} style={style}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <ellipse cx="8" cy="6" rx="2" ry="3" fill="currentColor" />
        <ellipse cx="16" cy="6" rx="2" ry="3" fill="currentColor" />
        <ellipse cx="6" cy="12" rx="2" ry="2.5" fill="currentColor" />
        <ellipse cx="18" cy="12" rx="2" ry="2.5" fill="currentColor" />
        <ellipse cx="12" cy="16" rx="3" ry="2.5" fill="currentColor" />
      </svg>
    </div>
  );

  return (
    <div className="w-full h-full flex justify-center items-start">
      <div className="w-full flex flex-1 justify-center items-start max-w-[1550px]">
        <div
          className="h-screen relative overflow-hidden flex flex-col w-full flex-1"
          style={{ backgroundColor: PRIMARY_COLOR }}
        >
          {isLoading ? <CreatingPost /> : null}
          {/* Background paw prints */}
          <div className="fixed inset-0 text-sky-600">
            {[...Array(15)].map((_, i) => (
              <PawPrint
                key={i}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex-1 flex flex-col p-3">
            <div className="text-center mb-3">
              <GoBackButton />
              <ScreenTitle title="Forgetful Kitten Quiz Builder" className="w-auto" />
            </div>
            <div className="flex justify-center items-center mb-3 gap-2">
              <button
                onClick={() => setCurrentTab(Math.max(0, currentTab - 1))}
                disabled={currentTab === 0}
                className="w-8 h-8 bg-gray-700  rounded-full border-4 border-black/60 disabled:opacity-60  text-sm"
                style={{ backgroundColor: SECONDARY_COLOR }}
              >
                ←
              </button>

              <div className="flex gap-1">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTab(index)}
                    className={`w-8 h-8 rounded-full border-4  text-xs ${
                      currentTab === index
                        ? 'border-black/60'
                        : hasTabErrors(index)
                          ? 'text-white'
                          : 'border-black/60 opacity-60'
                    }`}
                    style={{
                      backgroundColor: `${
                        currentTab === index
                          ? SECONDARY_COLOR
                          : hasTabErrors(index)
                            ? ERROR_COLOR
                            : SECONDARY_COLOR
                      }`,
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentTab(questions.length)}
                  className={`px-2 h-8 rounded-full border-4  text-xs ${
                    hasMainGuessErrors()
                      ? 'border-red-500 text-white'
                      : isOnMainGuessTab
                        ? 'border-black/60'
                        : 'border-black/60 opacity-60'
                  }`}
                  style={{
                    backgroundColor: `${
                      hasMainGuessErrors()
                        ? ERROR_COLOR
                        : isOnMainGuessTab
                          ? SECONDARY_COLOR
                          : SECONDARY_COLOR
                    }`,
                  }}
                >
                  ⭐
                </button>
                <button
                  onClick={() => setCurrentTab(questions.length + 1)}
                  className={`px-2 h-8 rounded-full border-4 border-black/60  text-xs ${
                    isOnTitleTab ? '' : 'opacity-60'
                  }`}
                  style={{ backgroundColor: isOnTitleTab ? SECONDARY_COLOR : SECONDARY_COLOR }}
                >
                  T
                </button>
              </div>

              <button
                onClick={() => setCurrentTab(Math.min(totalTabs - 1, currentTab + 1))}
                disabled={currentTab >= totalTabs - 1}
                className="w-8 h-8  rounded-full border-4 border-black/60 disabled:opacity-60  text-sm"
                style={{ backgroundColor: SECONDARY_COLOR }}
              >
                →
              </button>
            </div>

            <div className="bg-white rounded-2xl border-3 border-black/60 py-2 px-2 shadow-xl flex-1 flex flex-col max-h-full lg:h-full lg:flex-none lg:max-h-8/12 lg:translate-y-2/12">
              {isOnTitleTab ? (
                <div className="flex-1 flex flex-col">
                  <div
                    className="border-4 border-black/60 rounded-lg px-3 py-2 mb-3 text-center"
                    style={{ backgroundColor: ACCENT_COLOR3 }}
                  >
                    <span className="font-black text-sm">QUIZ TITLE</span>
                  </div>
                  <textarea
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    maxLength={100}
                    className="w-full bg-gray-100 border-4 border-black/60 rounded-xl p-2 resize-none text-center  focus:outline-none flex-1"
                    placeholder="Enter quiz title..."
                  />
                  <div className="text-right text-xs mt-1 ">{quizTitle.length}/100</div>
                </div>
              ) : isOnMainGuessTab ? (
                <div className="flex-1 flex flex-col">
                  <div
                    className="border-4 border-black/60 rounded-lg p-3 py-2 mb-3 text-center flex items-center justify-center gap-1"
                    style={{ backgroundColor: ACCENT_COLOR3 }}
                  >
                    <span className="font-black text-sm">MAIN GUESS QUESTION</span>
                  </div>

                  <div className="mb-3">
                    <textarea
                      value={mainGuess.question}
                      onChange={(e) => updateMainGuess('question', e.target.value)}
                      maxLength={80}
                      className={`w-full bg-gray-100 border-4 rounded-xl p-2 resize-none   focus:outline-none h-24 ${
                        validationErrors['main-question'] ? 'border-red-500' : 'border-black/60'
                      }`}
                      placeholder="Enter main guess question... 0/80"
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="text"
                      value={mainGuess.answer}
                      onChange={(e) => updateMainGuess('answer', e.target.value)}
                      maxLength={30}
                      className={`w-full bg-green-100 border-4 rounded-xl p-2 py-4  text-gray-800 focus:outline-none ${
                        validationErrors['main-answer'] ? 'border-red-500' : 'border-black/60'
                      }`}
                      placeholder="Enter the correct answer... 0/30"
                    />
                  </div>

                  <p className="text-xs px-2">
                    This will be the main guessing question for the daily challenge.
                  </p>
                </div>
              ) : current ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <div
                      className="border-4 border-black/60 rounded-lg px-4 py-1 flex items-center gap-1"
                      style={{ backgroundColor: ACCENT_COLOR3 }}
                    >
                      <span className="font-black text-gray-800 text-sm">
                        Q{currentQuestion + 1}
                      </span>
                    </div>
                    <button
                      onClick={removeQuestion}
                      disabled={questions.length === 1}
                      className="px-4 h-8 text-white rounded-md border-4 border-black/60 disabled:opacity-50 text-xs"
                      style={{ backgroundColor: ERROR_COLOR }}
                    >
                      DELETE
                    </button>
                  </div>

                  <div className="mb-3">
                    <textarea
                      value={current.question}
                      onChange={(e) => updateQuestion('question', e.target.value)}
                      maxLength={120}
                      className={`w-full bg-gray-100 border-4 rounded-xl p-2 resize-none  text-gray-800 focus:outline-none h-20 ${
                        validationErrors[`question-${currentQuestion}`]
                          ? 'border-red-500'
                          : 'border-black/60'
                      }`}
                      placeholder="Enter question... (0/120)"
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-wrap justify-between items-center flex-1 box-border">
                      {current.answers.map((answer, index) => (
                        <div
                          key={index}
                          className={clsx(
                            'flex w-[48%] h-[46%] justify-center items-center box-border'
                          )}
                        >
                          <div
                            className={`w-full h-full flex flex-col justify-center items-start bg-orange p-1 box-border rounded-xl border-4 text-left text-sm ${
                              validationErrors[`answer-${currentQuestion}-${index}`]
                                ? 'border-red-500'
                                : index === 0
                                  ? 'border-black/60'
                                  : 'border-black/60 '
                            }`}
                            style={{
                              backgroundColor: validationErrors[
                                `answer-${currentQuestion}-${index}`
                              ]
                                ? ERROR_COLOR
                                : index === 0
                                  ? SUCCESS_COLOR
                                  : SECONDARY_COLOR,
                            }}
                          >
                            <textarea
                              value={answer}
                              onChange={(e) => updateAnswer(index, e.target.value)}
                              maxLength={30}
                              rows={1}
                              className="w-full bg-transparent flex-1  focus:outline-none placeholder-gray-500 resize-none p-2"
                              placeholder={
                                index === 0 ? 'Correct Answer' : `Wrong Answer ${index + 1}`
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="text-right text-xs ml-2 text-gray-600 ">
                              {answer.length}/30
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-2xl">🐱</span>
                </div>
              )}

              {/* Action Buttons - Always at bottom */}
              <div className="flex gap-2 mt-3">
                {!isOnTitleTab && !isOnMainGuessTab && (
                  <button
                    onClick={addQuestion}
                    disabled={questions.length >= 6}
                    className="flex-1 rounded-xl border-4 border-black/60 py-2 font-black text-xs disabled:opacity-50"
                    style={{ backgroundColor: ACCENT_COLOR }}
                  >
                    + ADD QUESTION
                  </button>
                )}
                <button
                  onClick={handleContinue}
                  className="flex-1 rounded-lg border-4 border-black/60 py-4 font-black text-xs"
                  style={{ backgroundColor: SECONDARY_COLOR }}
                >
                  CREATE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizBuilder;
