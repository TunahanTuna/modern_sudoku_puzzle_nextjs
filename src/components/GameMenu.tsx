import React from "react";

interface GameMenuProps {
  onStartGame: (difficulty: "easy" | "medium" | "hard") => void;
}

export default function GameMenu({ onStartGame }: GameMenuProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 space-y-6 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 animate-scaleIn">
        <div className="w-full animate-slideDown">
          <h2 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 animate-gradient">
            Yeni Oyun
          </h2>
          <div className="space-y-6">
            <p className="text-center text-gray-700 dark:text-gray-200 mb-6 text-xl font-medium">
              Zorluk seviyesi seçin
            </p>
            <div className="grid grid-cols-1 gap-5">
              <button
                onClick={() => onStartGame("easy")}
                className="group w-full py-5 px-6 bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 hover:from-green-500 hover:via-green-600 hover:to-emerald-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
              >
                <span className="relative z-10 text-lg">Kolay</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={() => onStartGame("medium")}
                className="group w-full py-5 px-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
              >
                <span className="relative z-10 text-lg">Orta</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={() => onStartGame("hard")}
                className="group w-full py-5 px-6 bg-gradient-to-r from-red-400 via-red-500 to-rose-500 hover:from-red-500 hover:via-red-600 hover:to-rose-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
              >
                <span className="relative z-10 text-lg">Zor</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
