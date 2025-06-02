
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, Target, TrendingUp, Flame } from "lucide-react";
import { GameState } from "./SlotGame";

interface GameStatsProps {
  gameState: GameState;
}

const GameStats = ({ gameState }: GameStatsProps) => {
  const winRate = gameState.totalSpins > 0 ? (gameState.winStreak / gameState.totalSpins) * 100 : 0;
  
  return (
    <div className="space-y-4">
      <Card className="p-4 bg-black/30 border-green-500/30">
        <h3 className="text-lg font-bold text-green-400 mb-3">
          <Coins className="inline mr-2 h-5 w-5" />
          Wallet
        </h3>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-white">{gameState.coins}</div>
          <div className="text-sm text-green-300">coins available</div>
          <Progress 
            value={Math.min((gameState.coins / 5000) * 100, 100)} 
            className="h-2"
          />
          <div className="text-xs text-white/60">
            {gameState.coins >= 5000 ? "High Roller Status!" : `${5000 - gameState.coins} to High Roller`}
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-black/30 border-orange-500/30">
        <h3 className="text-lg font-bold text-orange-400 mb-3">
          <Flame className="inline mr-2 h-5 w-5" />
          Current Streak
        </h3>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-white">{gameState.winStreak}</div>
          <div className="text-sm text-orange-300">consecutive wins</div>
          <div className="text-xs text-white/60">
            Multiplier: x{Math.floor(gameState.winStreak / 3) + 1}
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-black/30 border-purple-500/30">
        <h3 className="text-lg font-bold text-purple-400 mb-3">
          <Target className="inline mr-2 h-5 w-5" />
          Statistics
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Total Spins:</span>
            <span className="text-white font-semibold">{gameState.totalSpins}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Win Rate:</span>
            <span className="text-white font-semibold">{winRate.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Best Win:</span>
            <span className="text-white font-semibold">{Math.max(gameState.lastWinAmount, 0)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameStats;
