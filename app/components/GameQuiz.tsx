'use client';
import { useState } from 'react';
import { ChevronLeft, Gamepad2 } from 'lucide-react';
import { Question, AnswerOption, QuizAnswers, Personality } from '../../types/game';

interface GameQuizProps {
  onComplete: (data: { answers: QuizAnswers; personality: Personality }) => void;
}

const questions: Question[] = [
  {
    id: 1,
    question: "When you game, what's your main goal?",
    type: 'single',
    options: [
      {
        text: 'To relax and unwind after a long day',
        value: 'relaxation',
        emoji: '😌',
        traits: ['casual', 'story', 'creative'],
      },
      {
        text: "To compete and prove I'm the best",
        value: 'competition',
        emoji: '🏆',
        traits: ['competitive', 'multiplayer', 'challenging'],
      },
      {
        text: 'To get lost in an amazing story',
        value: 'story',
        emoji: '📖',
        traits: ['story', 'immersive', 'narrative'],
      },
      {
        text: 'To challenge my brain with puzzles',
        value: 'strategy',
        emoji: '🧠',
        traits: ['strategy', 'puzzle', 'thinking'],
      },
    ],
  },
  {
    id: 2,
    question: "What's your ideal gaming session length?",
    type: 'single',
    options: [
      {
        text: 'Quick 15-30 minute bursts',
        value: 'short',
        emoji: '⚡',
        traits: ['casual', 'quick', 'mobile'],
      },
      {
        text: '1-2 hours of focused gameplay',
        value: 'medium',
        emoji: '⏱️',
        traits: ['moderate', 'engaging'],
      },
      {
        text: '3+ hour immersive marathons',
        value: 'long',
        emoji: '🎮',
        traits: ['immersive', 'deep', 'complex'],
      },
      {
        text: 'It varies - whatever I have time for',
        value: 'flexible',
        emoji: '🔄',
        traits: ['flexible', 'varied'],
      },
    ],
  },
  {
    id: 3,
    question: 'Which of these activities sounds most fun?',
    type: 'single',
    options: [
      {
        text: 'Building and creating something amazing',
        value: 'creative',
        emoji: '🏗️',
        traits: ['creative', 'building', 'sandbox'],
      },
      {
        text: 'Outsmarting opponents in tactical combat',
        value: 'tactical',
        emoji: '🎯',
        traits: ['strategy', 'tactical', 'competitive'],
      },
      {
        text: 'Exploring mysterious, beautiful worlds',
        value: 'exploration',
        emoji: '🗺️',
        traits: ['adventure', 'exploration', 'discovery'],
      },
      {
        text: 'Working together with friends on a mission',
        value: 'cooperative',
        emoji: '🤝',
        traits: ['coop', 'multiplayer', 'social'],
      },
    ],
  },
  {
    id: 4,
    question: "What's your tolerance for difficulty?",
    type: 'single',
    options: [
      {
        text: 'I prefer chill, low-stress experiences',
        value: 'easy',
        emoji: '🌊',
        traits: ['casual', 'relaxing', 'accessible'],
      },
      {
        text: 'A fair challenge that makes me think',
        value: 'balanced',
        emoji: '⚖️',
        traits: ['balanced', 'engaging', 'moderate'],
      },
      {
        text: 'I enjoy overcoming tough obstacles',
        value: 'challenging',
        emoji: '💪',
        traits: ['challenging', 'difficult', 'rewarding'],
      },
      {
        text: 'Bring on the pain - I love hardcore games!',
        value: 'hardcore',
        emoji: '💀',
        traits: ['hardcore', 'competitive', 'masocore'],
      },
    ],
  },
  {
    id: 5,
    question: "What's your preferred gaming style?",
    type: 'single',
    options: [
      {
        text: 'Solo adventures at my own pace',
        value: 'solo',
        emoji: '🎧',
        traits: ['singleplayer', 'story', 'immersive'],
      },
      {
        text: 'Cooperative play with friends',
        value: 'coop',
        emoji: '👥',
        traits: ['coop', 'multiplayer', 'social'],
      },
      {
        text: 'Competitive matches against others',
        value: 'pvp',
        emoji: '⚔️',
        traits: ['competitive', 'pvp', 'multiplayer'],
      },
      {
        text: 'A mix of everything depending on mood',
        value: 'mixed',
        emoji: '🎭',
        traits: ['varied', 'flexible'],
      },
    ],
  },
  {
    id: 6,
    question: 'Which game worlds appeal to you most?',
    type: 'single',
    options: [
      {
        text: 'Realistic modern or historical settings',
        value: 'realistic',
        emoji: '🏙️',
        traits: ['realistic', 'historical', 'modern'],
      },
      {
        text: 'Fantasy realms with magic and monsters',
        value: 'fantasy',
        emoji: '🐉',
        traits: ['fantasy', 'rpg', 'adventure'],
      },
      {
        text: 'Sci-fi futures in space or cyberpunk cities',
        value: 'scifi',
        emoji: '🚀',
        traits: ['scifi', 'futuristic', 'space'],
      },
      {
        text: 'Whimsical, colorful, and creative worlds',
        value: 'stylized',
        emoji: '🌈',
        traits: ['stylized', 'creative', 'colorful'],
      },
    ],
  },
  {
    id: 7,
    question: 'What role do you enjoy playing?',
    type: 'single',
    options: [
      {
        text: 'The hero saving the world',
        value: 'hero',
        emoji: '🦸',
        traits: ['story', 'adventure', 'narrative'],
      },
      {
        text: 'The strategist planning every move',
        value: 'strategist',
        emoji: '♟️',
        traits: ['strategy', 'tactical', 'thinking'],
      },
      {
        text: 'The explorer discovering secrets',
        value: 'explorer',
        emoji: '🔍',
        traits: ['exploration', 'adventure', 'discovery'],
      },
      {
        text: 'The creator building and designing',
        value: 'creator',
        emoji: '🛠️',
        traits: ['creative', 'building', 'sandbox'],
      },
    ],
  },
  {
    id: 8,
    question: 'How important is story vs gameplay to you?',
    type: 'single',
    options: [
      {
        text: 'Story is everything - I play for the narrative',
        value: 'story',
        emoji: '📚',
        traits: ['story', 'narrative', 'cinematic'],
      },
      {
        text: 'Gameplay first - story is secondary',
        value: 'gameplay',
        emoji: '🎯',
        traits: ['mechanics', 'gameplay', 'action'],
      },
      {
        text: 'I need a perfect balance of both',
        value: 'balanced',
        emoji: '⚖️',
        traits: ['balanced', 'engaging'],
      },
      {
        text: 'I prefer games with minimal story',
        value: 'minimal',
        emoji: '🎮',
        traits: ['arcade', 'minimal', 'gameplay'],
      },
    ],
  },
];

export default function GameQuiz({ onComplete }: GameQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [progress, setProgress] = useState<number>(0);

  const handleAnswer = (answer: AnswerOption): void => {
    const newAnswers: QuizAnswers = {
      ...answers,
      [questions[currentQuestion].id]: answer,
    };

    setAnswers(newAnswers);

    // Calculate progress
    const newProgress = ((currentQuestion + 1) / questions.length) * 100;
    setProgress(newProgress);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete - analyze personality
      const personality = analyzePersonality(newAnswers);
      onComplete({ answers: newAnswers, personality });
    }
  };

  const analyzePersonality = (answers: QuizAnswers): Personality => {
    const traitCount: { [key: string]: number } = {};

    Object.values(answers).forEach((answer: AnswerOption) => {
      answer.traits.forEach((trait: string) => {
        traitCount[trait] = (traitCount[trait] || 0) + 1;
      });
    });

    // Get top 5 traits
    const topTraits = Object.entries(traitCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([trait]) => trait);

    return {
      primaryTraits: topTraits.slice(0, 3),
      allTraits: topTraits,
      playstyle: determinePlaystyle(topTraits),
    };
  };

  const determinePlaystyle = (traits: string[]): string => {
    if (traits.includes('competitive') && traits.includes('multiplayer')) {
      return 'Competitive Multiplayer';
    } else if (traits.includes('story') && traits.includes('immersive')) {
      return 'Story Explorer';
    } else if (traits.includes('creative') && traits.includes('building')) {
      return 'Creative Builder';
    } else if (traits.includes('strategy') && traits.includes('tactical')) {
      return 'Strategic Thinker';
    } else if (traits.includes('casual') && traits.includes('relaxing')) {
      return 'Casual Relaxer';
    } else {
      return 'Balanced Gamer';
    }
  };

  const goBack = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const newProgress = (currentQuestion / questions.length) * 100;
      setProgress(newProgress);
    }
  };

  const currentQ: Question = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full mb-4">
            <Gamepad2 size={16} />
            <span className="text-sm font-semibold text-blue-300">Game Personality Test</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">{currentQ.question}</h2>
        </div>

        {/* Options */}
        <div className="grid gap-3">
          {currentQ.options.map((option: AnswerOption, index: number) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option)}
              className="w-full p-4 text-left bg-slate-700/30 hover:bg-slate-600/50 border border-slate-600/50 hover:border-blue-500/30 rounded-xl transition-all duration-200 hover:scale-105 group"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl group-hover:scale-110 transition-transform">{option.emoji}</span>
                <span className="text-white font-medium group-hover:text-blue-100">{option.text}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={goBack}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-all border border-slate-600/50"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          <div className="text-slate-400 text-sm flex items-center">Choose an option to continue</div>
        </div>
      </div>
    </div>
  );
}
