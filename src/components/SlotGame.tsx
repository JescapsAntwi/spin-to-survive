
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SlotMachine from "./SlotMachine";
import GameStats from "./GameStats";
import DoubleOrNothing from "./DoubleOrNothing";
import DailyBonus from "./DailyBonus";
import { Coins, Trophy, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface GameState {
  coins: number;
  totalSpins: number;
  winStreak: number;
  lastWinAmount: number;
  dailyBonusClaimed: boolean;
  achievements: string[];
}

const SlotGame = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    coins: 1000,
    totalSpins: 0,
    winStreak: 0,
    lastWinAmount: 0,
    dailyBonusClaimed: false,
    achievements: []
  });
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [showDoubleOrNothing, setShowDoubleOrNothing] = useState(false);
  const [showDailyBonus, setShowDailyBonus] = useState(false);
  const [currentWin, setCurrentWin] = useState(0);

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("spinSurviveGameState");
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setGameState(parsed);
    }
    
    // Check if daily bonus is available
    const lastBonusDate = localStorage.getItem("lastDailyBonus");
    const today = new Date().toDateString();
    if (lastBonusDate !== today) {
      setGameState(prev => ({ ...prev, dailyBonusClaimed: false }));
    }
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("spinSurviveGameState", JSON.stringify(gameState));
  }, [gameState]);

  const handleSpin = (result: { symbols: string[]; winAmount: number; multiplier: number }) => {
    const { winAmount, multiplier } = result;
    const streakMultiplier = Math.floor(gameState.winStreak / 3) + 1;
    const finalWinAmount = winAmount * multiplier * streakMultiplier;
    
    setGameState(prev => ({
      ...prev,
      coins: prev.coins - 50 + finalWinAmount, // 50 coins per spin
      totalSpins: prev.totalSpins + 1,
      winStreak: finalWinAmount > 0 ? prev.winStreak + 1 : 0,
      lastWinAmount: finalWinAmount
    }));

    if (finalWinAmount > 0) {
      setCurrentWin(finalWinAmount);
      if (finalWinAmount >= 100) {
        setShowDoubleOrNothing(true);
      }
      
      // Achievement notifications
      if (finalWinAmount >= 500 && !gameState.achievements.includes("Big Winner")) {
        toast({
          title: "🏆 Achievement Unlocked!",
          description: "Big Winner - Won 500+ coins in a single spin!",
        });
        setGameState(prev => ({
          ...prev,
          achievements: [...prev.achievements, "Big Winner"]
        }));
      }
    }

    console.log("Spin result:", { winAmount: finalWinAmount, streakMultiplier, totalCoins: gameState.coins - 50 + finalWinAmount });
  };

  const handleDoubleOrNothing = (won: boolean, amount: number) => {
    if (won) {
      setGameState(prev => ({ ...prev, coins: prev.coins + amount }));
      toast({
        title: "🎉 Double or Nothing Won!",
        description: `You won ${amount} additional coins!`,
      });
    } else {
      toast({
        title: "💔 Double or Nothing Lost",
        description: "Better luck next time!",
        variant: "destructive"
      });
    }
    setShowDoubleOrNothing(false);
    setCurrentWin(0);
  };

  const handleDailyBonus = (bonusAmount: number) => {
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + bonusAmount,
      dailyBonusClaimed: true
    }));
    localStorage.setItem("lastDailyBonus", new Date().toDateString());
    setShowDailyBonus(false);
    
    toast({
      title: "🎁 Daily Bonus Claimed!",
      description: `You received ${bonusAmount} coins!`,
    });
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
          🎰 SPIN & SURVIVE
        </h1>
        <p className="text-xl text-white/80">Turn-Based Logic Slot Game</p>
      </div>

      {/* Main Game Area */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Stats */}
        <div className="space-y-4">
          <GameStats gameState={gameState} />
          
          {/* Daily Bonus Button */}
          {!gameState.dailyBonusClaimed && (
            <Button 
              onClick={() => setShowDailyBonus(true)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3"
            >
              <Zap className="mr-2 h-5 w-5" />
              Claim Daily Bonus
            </Button>
          )}
        </div>

        {/* Center Panel - Slot Machine */}
        <div className="flex flex-col items-center space-y-4">
          <SlotMachine 
            onSpin={handleSpin}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
            coins={gameState.coins}
            winStreak={gameState.winStreak}
          />
        </div>

        {/* Right Panel - Recent Activity */}
        <div className="space-y-4">
          <Card className="p-4 bg-black/30 border-yellow-500/30">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">
              <Trophy className="inline mr-2 h-5 w-5" />
              Achievements
            </h3>
            <div className="space-y-2">
              {gameState.achievements.length > 0 ? (
                gameState.achievements.map((achievement, index) => (
                  <div key={index} className="text-sm text-white/80 bg-yellow-500/20 p-2 rounded">
                    🏆 {achievement}
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/60">No achievements yet</p>
              )}
            </div>
          </Card>

          <Card className="p-4 bg-black/30 border-blue-500/30">
            <h3 className="text-lg font-bold text-blue-400 mb-3">
              <Coins className="inline mr-2 h-5 w-5" />
              Last Spin
            </h3>
            {gameState.lastWinAmount > 0 ? (
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">+{gameState.lastWinAmount}</p>
                <p className="text-sm text-white/60">coins won</p>
              </div>
            ) : (
              <p className="text-white/60">No recent wins</p>
            )}
          </Card>
        </div>
      </div>

      {/* Modals */}
      {showDoubleOrNothing && (
        <DoubleOrNothing 
          winAmount={currentWin}
          onResult={handleDoubleOrNothing}
          onClose={() => setShowDoubleOrNothing(false)}
        />
      )}

      {showDailyBonus && (
        <DailyBonus 
          onClaim={handleDailyBonus}
          onClose={() => setShowDailyBonus(false)}
        />
      )}
    </div>
  );
};

export default SlotGame;
