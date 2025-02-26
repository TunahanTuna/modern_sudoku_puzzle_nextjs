import { useEffect, useState } from "react";
// ...existing code...

export default function Game() {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [bestTime, setBestTime] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("sudokuHighScore");
    const savedBestTime = localStorage.getItem("sudokuBestTime");
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
    if (savedBestTime) setBestTime(parseInt(savedBestTime));
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameStarted) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameStarted]);

  const updateHighScores = () => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("sudokuHighScore", score.toString());
    }
    if (bestTime === 0 || timer < bestTime) {
      setBestTime(timer);
      localStorage.setItem("sudokuBestTime", timer.toString());
    }
  };

  const handleNumberSelect = (number: number) => {
    // ...existing code...
    setScore((prevScore) => prevScore + 10); // Örnek skor artışı
    if (!isGameStarted) setIsGameStarted(true);
  };

  const handleGameComplete = () => {
    setIsGameStarted(false);
    updateHighScores();
    // ...existing game completion code...
  };

  return (
    <div className="game-container">
      <div className="game-stats">
        <p>
          Süre: {Math.floor(timer / 60)}:
          {(timer % 60).toString().padStart(2, "0")}
        </p>
        <p>Skor: {score}</p>
      </div>
      {/* ...existing game content... */}
      <div className="stats-container">
        <div className="high-scores">
          <p>En Yüksek Skor: {highScore}</p>
          <p>
            En İyi Süre:{" "}
            {bestTime
              ? `${Math.floor(bestTime / 60)}:${(bestTime % 60)
                  .toString()
                  .padStart(2, "0")}`
              : "00:00"}
          </p>
        </div>
      </div>
    </div>
  );
}
