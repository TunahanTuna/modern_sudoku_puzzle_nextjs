export interface GameScore {
  difficulty: string;
  time: number;
  score: number; // Add this line
  date: string;
}

export interface HighScores {
  easy: GameScore[];
  medium: GameScore[];
  hard: GameScore[];
}
