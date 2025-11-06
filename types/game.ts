export interface AnswerOption {
  text: string;
  value: string;
  emoji: string;
  traits: string[];
}

export interface Question {
  id: number;
  question: string;
  type: 'single';
  options: AnswerOption[];
}

export interface GameRecommendation {
  name: string;
  description: string;
  genre: string;
  timeRequired: string;
  players: string;
  rating: string;
  matchReason: string;
  store_url: string;
  similarGames: string;
}

export interface Personality {
  primaryTraits: string[];
  allTraits: string[];
  playstyle: string;
}

export interface QuizAnswers {
  [key: number]: AnswerOption;
}

export interface QuizResults {
  recommendations: GameRecommendation[];
  personality: Personality;
}
