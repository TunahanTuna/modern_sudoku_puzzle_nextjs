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
  // Temel doğrulama kontrollerini ekleyelim
  if (!board || !Array.isArray(board) || board.length !== 9) return false;

  // Boş hücre bul
  let emptyCell = findEmptyCell(board);
  if (!emptyCell) return true; // Tüm hücreler dolu ise çözüm tamamlandı

  const [row, col] = emptyCell;

  // 1'den 9'a kadar sayıları rastgele sırayla dene
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const num of numbers) {
    const numStr = num.toString();

    // Eğer sayı geçerliyse yerleştir ve devam et
    if (isValidMove(board, row, col, numStr)) {
      board[row][col] = numStr;

      // Recursive olarak devam et
      if (fillBoard(board)) {
        return true;
      }

      // Eğer çözüm bulunamadıysa geri al
      board[row][col] = "";
    }
  }

  return false;
};

// Yardımcı fonksiyonlar
const findEmptyCell = (board: string[][]): [number, number] | null => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === "") {
        return [row, col];
      }
    }
  }
  return null;
};

const shuffle = (array: number[]): number[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generatePuzzle = (
  difficulty: "easy" | "medium" | "hard"
): string[][] => {
  // Boş board oluştur
  const board = Array(9)
    .fill(null)
    .map(() => Array(9).fill(""));

  // Tamamen çözülmüş board oluştur
  fillBoard(board);

  // Zorluk seviyesine göre hücre sil
  const cellsToRemove =
    {
      easy: 35, // Kolay seviye için daha az hücre sil
      medium: 45,
      hard: 55,
    }[difficulty] || 35;

  // Rastgele hücreleri sil
  let count = 0;
  while (count < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (board[row][col] !== "") {
      board[row][col] = "";
      count++;
    }
  }

  return board;
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
