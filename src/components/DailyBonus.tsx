
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Star, Coins, X } from "lucide-react";

interface DailyBonusProps {
  onClaim: (amount: number) => void;
  onClose: () => void;
}

const DailyBonus = ({ onClaim, onClose }: DailyBonusProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleClaim = () => {
    setIsOpening(true);
    
    // Generate random bonus between 100-500 coins
    const randomBonus = Math.floor(Math.random() * 401) + 100;
    setBonusAmount(randomBonus);
    
    setTimeout(() => {
      setIsRevealed(true);
      setTimeout(() => {
        onClaim(randomBonus);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="p-6 bg-gradient-to-br from-blue-900 to-purple-900 border-2 border-yellow-500 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-400">Daily Bonus</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="text-center space-y-6">
          {!isRevealed ? (
            <>
              <div className="space-y-4">
                <div className={`text-8xl ${isOpening ? 'animate-bounce' : ''}`}>
                  🎁
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Your Daily Gift Awaits!</h3>
                  <p className="text-white/80">Claim your free coins for today</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-lg border border-yellow-500/30">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">Daily Bonus Features</span>
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
                <ul className="text-sm text-white/80 space-y-1">
                  <li>• 100-500 free coins</li>
                  <li>• Available once per day</li>
                  <li>• No cost, pure bonus!</li>
                </ul>
              </div>

              {!isOpening && (
                <Button
                  onClick={handleClaim}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 text-lg"
                >
                  <Gift className="mr-2 h-6 w-6" />
                  Claim Daily Bonus
                </Button>
              )}

              {isOpening && !isRevealed && (
                <div className="space-y-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
                  <p className="text-white/80 animate-pulse">Opening your gift...</p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-8xl animate-pulse">🎉</div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-green-400">Congratulations!</h3>
                <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                  <div className="flex items-center justify-center space-x-2">
                    <Coins className="h-8 w-8 text-yellow-400" />
                    <span className="text-3xl font-bold text-white">{bonusAmount}</span>
                    <span className="text-xl text-white/80">coins</span>
                  </div>
                </div>
                <p className="text-white/80">Your bonus has been added to your wallet!</p>
                <p className="text-sm text-white/60">Come back tomorrow for another bonus</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DailyBonus;
