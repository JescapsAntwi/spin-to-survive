
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins, Play } from "lucide-react";

interface SlotMachineProps {
  onSpin: (result: { symbols: string[]; winAmount: number; multiplier: number }) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
  coins: number;
  winStreak: number;
}

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "🔔", "💎", "⭐", "🍀"];
const SPIN_COST = 50;

const SlotMachine = ({ onSpin, isSpinning, setIsSpinning, coins, winStreak }: SlotMachineProps) => {
  const [reels, setReels] = useState(["🍒", "🍒", "🍒"]);
  const [animatingReels, setAnimatingReels] = useState([false, false, false]);

  const getRandomSymbol = () => {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  };

  const calculateWin = (symbols: string[]) => {
    console.log("Calculating win for symbols:", symbols);

    // Check for three of a kind
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
      const symbolValues: { [key: string]: number } = {
        "🍒": 100,
        "🍋": 150,
        "🍊": 200,
        "🍇": 250,
        "🔔": 300,
        "💎": 500,
        "⭐": 750,
        "🍀": 1000
      };
      return symbolValues[symbols[0]] || 100;
    }

    // Check for two of a kind
    if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
      return 25;
    }

    // Check for special symbol presence
    if (symbols.includes("💎")) return 10;
    if (symbols.includes("⭐")) return 15;
    if (symbols.includes("🍀")) return 20;

    return 0;
  };

  const handleSpin = async () => {
    if (coins < SPIN_COST || isSpinning) return;

    setIsSpinning(true);
    console.log("Starting spin with", coins, "coins");

    // Animate each reel with staggered timing
    const newReels = [...reels];

    for (let i = 0; i < 3; i++) {
      setAnimatingReels(prev => {
        const updated = [...prev];
        updated[i] = true;
        return updated;
      });

      // Spin animation duration
      await new Promise(resolve => setTimeout(resolve, 500 + i * 200));

      newReels[i] = getRandomSymbol();
      setReels([...newReels]);

      setAnimatingReels(prev => {
        const updated = [...prev];
        updated[i] = false;
        return updated;
      });
    }

    // Calculate results
    const winAmount = calculateWin(newReels);
    const streakMultiplier = Math.floor(winStreak / 3) + 1;

    console.log("Spin complete:", { symbols: newReels, winAmount, streakMultiplier });

    onSpin({
      symbols: newReels,
      winAmount,
      multiplier: streakMultiplier
    });

    setIsSpinning(false);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500/50 shadow-2xl">
      <div className="text-center space-y-6">
        {/* Slot Display */}
        <div className="bg-black/50 p-6 rounded-lg border-2 border-yellow-400/30">
          <div className="flex justify-center space-x-4 mb-4">
            {reels.map((symbol, index) => (
              <div
                key={index}
                className={`
                  w-20 h-20 bg-white rounded-lg flex items-center justify-center text-4xl
                  border-4 border-yellow-400 shadow-lg
                  ${animatingReels[index] ? 'animate-spin' : ''}
                  transition-all duration-200
                `}
              >
                {animatingReels[index] ? "🎰" : symbol}
              </div>
            ))}
          </div>

          {/* Win Lines Indicator */}
          <div className="flex justify-center space-x-2">
            <div className="h-1 w-16 bg-yellow-400 rounded opacity-60"></div>
            <div className="h-1 w-16 bg-yellow-400 rounded opacity-60"></div>
            <div className="h-1 w-16 bg-yellow-400 rounded opacity-60"></div>
          </div>
        </div>

        {/* Game Info */}
        <div className="grid grid-cols-2 gap-4 text-white">
          <div className="bg-blue-900/30 p-3 rounded-lg">
            <p className="text-sm text-blue-300">Coins</p>
            <p className="text-xl font-bold">{coins}</p>
          </div>
          <div className="bg-purple-900/30 p-3 rounded-lg">
            <p className="text-sm text-purple-300">Win Streak</p>
            <p className="text-xl font-bold">{winStreak}</p>
          </div>
        </div>

        {/* Spin Button */}
        <Button
          onClick={handleSpin}
          disabled={coins < SPIN_COST || isSpinning}
          className={`
            w-full py-6 text-xl font-bold
            ${coins >= SPIN_COST && !isSpinning
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
            transition-all duration-200 transform hover:scale-105
          `}
        >
          {isSpinning ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
              <span>SPINNING...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Play className="h-6 w-6" />
              <span>SPIN ({SPIN_COST} <Coins className="inline h-5 w-5" />)</span>
            </div>
          )}
        </Button>

        {/* Payout Info */}
        <div className="text-xs text-white/60 space-y-1">
          <p>🍀 Three Lucky = 1000 | ⭐ Three Stars = 750 | 💎 Three Gems = 500</p>
          <p>🔔 Three Bells = 300 | 🍇 Three Grapes = 250 | 🍊 Three Oranges = 200</p>
          <p>Two of a kind = 25 | Special symbols = 10-20</p>
        </div>
      </div>
    </Card>
  );
};

export default SlotMachine;
