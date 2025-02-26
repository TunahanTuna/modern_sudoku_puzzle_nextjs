import React from "react";
import { GameScore, HighScores } from "../types/score";

interface ScoreBoardProps {
  currentTime: number;
  difficulty: "easy" | "medium" | "hard";
  highScores: HighScores;
}

export default function ScoreBoard({ currentTime, difficulty, highScores }: ScoreBoardProps) {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const difficultyScores = highScores[difficulty];
  const bestScore = difficultyScores.length > 0
    ? Math.min(...difficultyScores.map(score => score.time))
    : null;

  return (
    <div className="fixed top-4 right-4 bg-white/90 dark:bg-gray-800/90 rounded-2xl p-4 shadow-lg border border-white/20 dark:border-gray-700/30">
      <div className="space-y-2">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">Süre</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {formatTime(currentTime)}
          </p>
        </div>
        {bestScore !== null && (
          <div className="text-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 text-sm">En İyi Süre</p>
            <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
              {formatTime(bestScore)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}