import { useEffect, useState } from "react";

export default function Home() {
  const [highScore, setHighScore] = useState(0);
  const [bestTime, setBestTime] = useState(0);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("sudokuHighScore");
    const savedBestTime = localStorage.getItem("sudokuBestTime");
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
    if (savedBestTime) setBestTime(parseInt(savedBestTime));
  }, []);

  return (
    <div className="container">
      <div className="stats-panel">
        <h3>İstatistikler</h3>
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
  );
}
