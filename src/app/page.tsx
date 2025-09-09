"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { useTranslation } from "../i18n/translations";
import {
  generatePuzzle,
  isValidMove,
  isBoardSolved,
  getHint,
  solveBoard,
} from "../utils/sudoku";
import GameMenu from "../components/GameMenu";
import ScoreBoard from "../components/ScoreBoard";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { HighScores, GameScore } from "../types/score";
import confetti from "canvas-confetti";

export default function Home() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [showMenu, setShowMenu] = useState(true);
  const [board, setBoard] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [initialBoard, setInitialBoard] = useState<boolean[][]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );
  const [highScores, setHighScores] = useState<HighScores>({
    easy: [],
    medium: [],
    hard: [],
  });
  const [remainingHints, setRemainingHints] = useState(3);
  const [errorCells, setErrorCells] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const MAX_MISTAKES = 5;

  const handleSuccessfulMove = useCallback(() => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    const cell = document.querySelector(`[data-cell="${row}-${col}"]`);
    if (!cell) return;
    cell.classList.add("success-animation");
    setTimeout(() => cell.classList.remove("success-animation"), 500);
  }, [selectedCell]);

  const handleGameCompletion = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const calculateScore = (isCorrect: boolean): number => {
    if (isCorrect) {
      const basePoints = 10;
      const comboMultiplier = Math.min(5, Math.floor(combo / 3)); // Her 3 doğru hareket için çarpan artışı (max 5x)
      return basePoints * (comboMultiplier + 1);
    }
    return -5;
  };

  const handleNumberInput = useCallback(
    (number: number) => {
      if (
        !selectedCell ||
        !board ||
        !initialBoard ||
        !Array.isArray(board) ||
        !Array.isArray(initialBoard)
      )
        return;
      const [row, col] = selectedCell;
      if (row < 0 || col < 0 || row >= board.length || col >= board[0].length)
        return;
      if (!board[row] || !initialBoard[row] || initialBoard[row][col]) return;

      // Silme işlemi için - eğer aynı numaraya tekrar tıklanırsa sil
      if (board[row][col] === number.toString()) {
        const newBoard = board.map((r, i) =>
          i === row ? r.map((cell, j) => (j === col ? "" : cell)) : r
        );
        setBoard(newBoard);
        setErrorCells((prev) => {
          const newErrors = new Set(prev);
          newErrors.delete(`${row}-${col}`);
          return newErrors;
        });
        return;
      }

      // Geçerli hamle kontrolü
      if (isValidMove(board, row, col, number.toString())) {
        const newBoard = board.map((r, i) =>
          i === row
            ? r.map((cell, j) => (j === col ? number.toString() : cell))
            : r
        );
        setBoard(newBoard);
        setErrorCells((prev) => {
          const newErrors = new Set(prev);
          newErrors.delete(`${row}-${col}`);
          return newErrors;
        });

        // Combo ve skor güncellemesi
        setCombo((prev) => prev + 1);
        const earnedPoints = calculateScore(true);
        setScore((prev) => prev + earnedPoints);

        handleSuccessfulMove();
        if (isBoardSolved(newBoard)) {
          const completionBonus = 500; // Oyun tamamlama bonusu
          const timeBonus = Math.max(0, 1000 - currentTime * 2); // Süreye bağlı bonus
          const finalScore = score + completionBonus + timeBonus;

          handleGameCompletion();
          const newScore: GameScore = {
            difficulty,
            time: currentTime,
            score: finalScore,
            date: new Date().toISOString(),
          };
          const updatedScores = {
            ...highScores,
            [difficulty]: [...highScores[difficulty], newScore]
              .sort((a, b) => a.time - b.time)
              .slice(0, 5),
          };
          setHighScores(updatedScores);
          localStorage.setItem(
            "sudokuHighScores",
            JSON.stringify(updatedScores)
          );
          setTimeout(() => setShowMenu(true), 2000);
        }
      } else {
        setCombo(0); // Combo sıfırlama
        setMistakes((prev) => {
          const newMistakes = prev + 1;
          if (newMistakes >= MAX_MISTAKES) {
            // Oyun sonu - çok fazla hata
            setTimeout(() => setShowMenu(true), 2000);
          }
          return newMistakes;
        });

        setScore((prev) => Math.max(0, prev + calculateScore(false)));
        // Hatalı hamle - hücreyi hatalı olarak işaretle
        const newBoard = board.map((r, i) =>
          i === row
            ? r.map((cell, j) => (j === col ? number.toString() : cell))
            : r
        );
        setBoard(newBoard);
        setErrorCells((prev) => {
          const newErrors = new Set(prev);
          newErrors.add(`${row}-${col}`);
          return newErrors;
        });
      }
    },
    [
      selectedCell,
      board,
      initialBoard,
      handleSuccessfulMove,
      handleGameCompletion,
      score,
      currentTime,
      difficulty,
      highScores,
      combo,
    ]
  );

  useEffect(() => {
    // Load high scores from local storage
    const savedScores = localStorage.getItem("sudokuHighScores");
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStartTime && !showMenu) {
      timer = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStartTime, showMenu]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const num = parseInt(event.key);
      if (num >= 1 && num <= 9) {
        handleNumberInput(num);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [handleNumberInput]);

  const startNewGame = (newDifficulty: "easy" | "medium" | "hard") => {
    const newBoard = generatePuzzle(newDifficulty);
    setBoard(newBoard);
    setInitialBoard(newBoard.map((row) => row.map((cell) => cell !== "")));
    setSelectedCell(null);
    setShowMenu(false);
    setDifficulty(newDifficulty);
    setGameStartTime(Date.now());
    setCurrentTime(0);
    setRemainingHints(3); // Reset hints when starting new game
    setCombo(0);
    setMistakes(0);
    setScore(0); // Reset score when starting new game
  };

  const handleHint = useCallback(() => {
    if (remainingHints <= 0) {
      // You could add a toast/alert here to inform the user
      return;
    }

    const hint = getHint(board);
    if (hint) {
      const [row, col, value] = hint;
      const newBoard = board.map((r, i) =>
        i === row ? r.map((cell, j) => (j === col ? value : cell)) : r
      );
      setBoard(newBoard);
      setSelectedCell([row, col]);
      setRemainingHints((prev) => prev - 1);
      handleSuccessfulMove();
      if (isBoardSolved(newBoard)) {
        handleGameCompletion();
        setTimeout(() => setShowMenu(true), 2000);
      }
    }
  }, [board, remainingHints, handleSuccessfulMove, handleGameCompletion]);

  const handleShowSolution = useCallback(() => {
    const solution = solveBoard(board);
    if (solution) {
      setBoard(solution);
      // Oyunu tamamlanmış olarak işaretle
      if (isBoardSolved(solution)) {
        handleGameCompletion();
        setTimeout(() => setShowMenu(true), 2000);
      }
    }
  }, [board, handleGameCompletion]);

  return (
    <main className="min-h-screen p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      {showMenu ? (
        <GameMenu onStartGame={startNewGame} />
      ) : (
        <>
          <div className="fixed top-4 left-4 mb-4 text-xl font-semibold space-y-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <div className="flex flex-col space-y-2">
              <span>
                {t("score.score")}: {score}
              </span>
              <span>
                {t("game.combo")}: x{Math.floor(combo / 3) + 1}
              </span>
              <span className="text-red-500">
                {t("score.mistakes")}: {mistakes}/{MAX_MISTAKES}
              </span>
              <span>
                {t("score.time")}: {Math.floor(currentTime / 60)}:
                {(currentTime % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 max-w-md md:max-w-2xl w-full mx-auto transition-all duration-300 hover:shadow-indigo-200/50 dark:hover:shadow-indigo-900/50 animate-scaleIn">
            <div className="grid grid-cols-9 gap-1 md:gap-1.5 bg-gray-100 dark:bg-gray-700 p-3 md:p-4 rounded-2xl transition-all duration-300">
              {board.map((row, i) =>
                row.map((cell, j) => (
                  <button
                    key={`${i}-${j}`}
                    data-cell={`${i}-${j}`}
                    className={`
                      aspect-square flex items-center justify-center
                      text-base md:text-xl font-medium relative
                      ${
                        initialBoard[i][j]
                          ? "font-bold text-gray-800 dark:text-gray-200"
                          : errorCells.has(`${i}-${j}`)
                          ? "text-red-600 dark:text-red-400"
                          : "text-indigo-600 dark:text-indigo-400"
                      }
                      ${selectedCell?.[0] === i && selectedCell?.[1] === j
                          ? "bg-indigo-100 dark:bg-indigo-700/70 ring-2 ring-indigo-500 shadow-lg scale-105 animate-pulse"
                          : "bg-white/80 dark:bg-gray-800/80"}
                      ${(i + 1) % 3 === 0 && i !== 8
                          ? "border-b-2 border-indigo-500 dark:border-indigo-400"
                          : ""}
                      ${(j + 1) % 3 === 0 && j !== 8
                          ? "border-r-2 border-indigo-500 dark:border-indigo-400"
                          : ""}
                      hover:bg-indigo-50 dark:hover:bg-indigo-900/30
                      hover:scale-105
                      active:scale-95
                      transition-all duration-200 ease-in-out
                      rounded-lg shadow-sm
                    `}
                    onClick={() =>
                      !initialBoard[i][j] && setSelectedCell([i, j])
                    }
                  >
                    {cell}
                  </button>
                ))
              )}
            </div>

            <div className="mt-6 md:mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <button
                onClick={() => setShowMenu(true)}
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-indigo-200/50 dark:hover:shadow-indigo-900/50"
              >
                {t("game.newGame")}
              </button>
              <button
                onClick={handleShowSolution}
                className="w-full md:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transform transition-all duration-200 shadow-lg flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105 active:scale-95 hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50"
              >
                {t("game.showSolution")}
              </button>
              <button
                onClick={handleHint}
                disabled={remainingHints <= 0}
                className={`w-full md:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transform transition-all duration-200 shadow-lg flex items-center justify-center gap-2
                  ${
                    remainingHints > 0
                      ? "hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105 active:scale-95 hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50"
                      : "opacity-50 cursor-not-allowed"
                  }`}
              >
                {t("game.hint")} ({remainingHints})
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
