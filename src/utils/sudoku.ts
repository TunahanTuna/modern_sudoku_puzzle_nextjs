// Utility functions for Sudoku game logic

// Check if a number can be placed in a given position
export const isValidMove = (
  board: string[][],
  row: number,
  col: number,
  num: string
): boolean => {
  if (!board || !Array.isArray(board) || board.length !== 9) return false;

  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row]?.[x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x]?.[col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i]?.[boxCol + j] === num) return false;
    }
  }

  return true;
};

// Generate a solved Sudoku board
const generateSolvedBoard = (): string[][] => {
  const board: string[][] = Array(9)
    .fill(null)
    .map(() => Array(9).fill(""));

  // Create a shuffled array of numbers 1-9 for the first row
  const firstRow = Array.from({ length: 9 }, (_, i) => (i + 1).toString());
  for (let i = firstRow.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [firstRow[i], firstRow[j]] = [firstRow[j], firstRow[i]];
  }
  board[0] = firstRow;

  if (!fillBoard(board)) {
    // If filling fails, return a new empty board to prevent null
    return Array(9)
      .fill(null)
      .map(() => Array(9).fill(""));
  }
  return board;
};

// Recursively fill the board
const fillBoard = (board: string[][]): boolean => {
  if (!board || !Array.isArray(board)) return false;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row]?.[col] === "") {
        for (let num = 1; num <= 9; num++) {
          const numStr = num.toString();
          if (isValidMove(board, row, col, numStr)) {
            board[row][col] = numStr;
            if (fillBoard(board)) return true;
            board[row][col] = "";
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Create a puzzle by removing numbers from a solved board
export const generatePuzzle = (
  difficulty: "easy" | "medium" | "hard"
): string[][] => {
  const solvedBoard = generateSolvedBoard();
  if (!solvedBoard)
    return Array(9)
      .fill(null)
      .map(() => Array(9).fill(""));

  const puzzle = solvedBoard.map((row) => [...row]);

  // Define number of cells to remove based on difficulty
  const cellsToRemove =
    {
      easy: 30, // Reduced from 40 to make it more playable
      medium: 40, // Reduced from 50 to make it more balanced
      hard: 50, // Reduced from 60 to ensure solvability
    }[difficulty] || 30; // Default to easy if difficulty is somehow invalid

  // Create a list of all positions
  let positions = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push([i, j]);
    }
  }

  // Shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Remove numbers from positions
  for (let i = 0; i < cellsToRemove; i++) {
    if (positions[i]) {
      const [row, col] = positions[i];
      puzzle[row][col] = "";
    }
  }

  return puzzle;
};

// Check if the board is solved
export const isBoardSolved = (board: string[][]): boolean => {
  if (!board || !Array.isArray(board) || board.length !== 9) return false;

  // Check if all cells are filled
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!board[i][j]) return false;
    }
  }

  // Check if all rows, columns and boxes are valid
  for (let i = 0; i < 9; i++) {
    for (let num = 1; num <= 9; num++) {
      const numStr = num.toString();
      // Check row
      if (!board[i].includes(numStr)) return false;
      // Check column
      if (!board.map((row) => row[i]).includes(numStr)) return false;
      // Check 3x3 box
      const boxRow = Math.floor(i / 3) * 3;
      const boxCol = Math.floor(i % 3) * 3;
      let found = false;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (board[boxRow + r][boxCol + c] === numStr) {
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (!found) return false;
    }
  }

  return true;
};

// Get a hint for the current board state
export const getHint = (board: string[][]): [number, number, string] | null => {
  if (!board || !Array.isArray(board) || board.length !== 9) return null;

  // Create a copy of the current board
  const boardCopy = board.map((row) => [...row]);

  // Try to solve the current board state
  if (!fillBoard(boardCopy)) return null;

  // Find all empty cells
  const emptyCells: [number, number][] = [];
  for (let row = 0; row < 9; row++) {
    if (!board[row]) continue;
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === "") {
        emptyCells.push([row, col]);
      }
    }
  }

  // If there are no empty cells, return null
  if (emptyCells.length === 0) return null;

  // Select a random empty cell
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const [row, col] = emptyCells[randomIndex];

  // Verify the hint is valid
  if (isValidMove(board, row, col, boardCopy[row][col])) {
    return [row, col, boardCopy[row][col]];
  }

  return null;
};
