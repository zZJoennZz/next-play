'use client';
import { useState } from 'react';
import GameQuiz from './components/GameQuiz';
import Results from './components/Results';
import Loading from './components/Loading';
import { QuizAnswers, Personality, QuizResults } from '../types/game';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'quiz' | 'results'>('quiz');
  const [results, setResults] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleQuizComplete = async (answers: { answers: QuizAnswers; personality: Personality }): Promise<void> => {
    setLoading(true);
    try {
      const recommendations = await generateRecommendations(answers);
      setResults(recommendations);
      setCurrentStep('results');
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async (data: { answers: QuizAnswers; personality: Personality }): Promise<QuizResults> => {
    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to generate recommendations');
    }

    return response.json();
  };

  const restartQuiz = (): void => {
    setCurrentStep('quiz');
    setResults(null);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {currentStep === 'quiz' && <GameQuiz onComplete={handleQuizComplete} />}
        {currentStep === 'results' && results && <Results results={results} onRestart={restartQuiz} />}
      </div>
    </div>
  );
}
