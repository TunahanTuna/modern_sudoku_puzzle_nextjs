export interface GameScore {
  difficulty: "easy" | "medium" | "hard";
  time: number; // in seconds
  date: string;
}

export interface HighScores {
  easy: GameScore[];
  medium: GameScore[];
  hard: GameScore[];
}