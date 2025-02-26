export interface GameScore {
  difficulty: "easy" | "medium" | "hard";
  time: number;
  score: number;
  date: string;
}

export interface HighScores {
  easy: GameScore[];
  medium: GameScore[];
  hard: GameScore[];
}
