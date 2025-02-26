"use client";

import { useState, useEffect, useCallback } from "react";
import {
  generatePuzzle,
  isValidMove,
  isBoardSolved,
  getHint,
} from "../utils/sudoku";
import GameMenu from "../components/GameMenu";
import ScoreBoard from "../components/ScoreBoard";
import { HighScores, GameScore } from "../types/score";
import confetti from "canvas-confetti";

export default function Home() {
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

      if (isValidMove(board, row, col, number.toString())) {
        const newBoard = board.map((r, i) =>
          i === row
            ? r.map((cell, j) => (j === col ? number.toString() : cell))
            : r
        );
        setBoard(newBoard);

        handleSuccessfulMove();
        if (isBoardSolved(newBoard)) {
          handleGameCompletion();
          const newScore: GameScore = {
            difficulty,
            time: currentTime,
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
      }
    },
    [
      selectedCell,
      board,
      initialBoard,
      handleSuccessfulMove,
      handleGameCompletion,
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
  };

  const handleHint = useCallback(() => {
    const hint = getHint(board);
    if (hint) {
      const [row, col, value] = hint;
      const newBoard = board.map((r, i) =>
        i === row ? r.map((cell, j) => (j === col ? value : cell)) : r
      );
      setBoard(newBoard);
      setSelectedCell([row, col]);
      handleSuccessfulMove();
      if (isBoardSolved(newBoard)) {
        handleGameCompletion();
        setTimeout(() => setShowMenu(true), 2000);
      }
    }
  }, [board, handleSuccessfulMove, handleGameCompletion]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 filter drop-shadow-lg transform hover:scale-105 transition-all duration-300">
        Modern Sudoku
      </h1>

      {showMenu ? (
        <GameMenu onStartGame={startNewGame} />
      ) : (
        <>
          <ScoreBoard
            currentTime={currentTime}
            difficulty={difficulty}
            highScores={highScores}
          />
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
                          : "text-indigo-600 dark:text-indigo-400"
                      }
                      ${
                        selectedCell?.[0] === i && selectedCell?.[1] === j
                          ? "bg-indigo-100 dark:bg-indigo-700/70 ring-2 ring-indigo-500 shadow-lg scale-105 animate-pulse"
                          : "bg-white/80 dark:bg-gray-800/80"
                      }
                      ${
                        (i + 1) % 3 === 0 && i !== 8
                          ? "border-b-2 border-gray-400/50"
                          : ""
                      }
                      ${
                        (j + 1) % 3 === 0 && j !== 8
                          ? "border-r-2 border-gray-400/50"
                          : ""
                      }
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
                Yeni Oyun
              </button>
              <button
                onClick={handleHint}
                className="w-full md:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50"
              >
                İpucu
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
