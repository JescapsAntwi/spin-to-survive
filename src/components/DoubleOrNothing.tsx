
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, Spade, Diamond, Club } from "lucide-react";

interface DoubleOrNothingProps {
  winAmount: number;
  onResult: (won: boolean, amount: number) => void;
  onClose: () => void;
}

const DoubleOrNothing = ({ winAmount, onResult, onClose }: DoubleOrNothingProps) => {
  const [selectedColor, setSelectedColor] = useState<"red" | "black" | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [cardColor, setCardColor] = useState<"red" | "black">("red");
  const [cardSuit, setCardSuit] = useState<"hearts" | "spades" | "diamonds" | "clubs">("hearts");

  const suits = [
    { name: "hearts", icon: Heart, color: "red" },
    { name: "diamonds", icon: Diamond, color: "red" },
    { name: "spades", icon: Spade, color: "black" },
    { name: "clubs", icon: Club, color: "black" }
  ];

  const handleGuess = (color: "red" | "black") => {
    if (isRevealed) return;
    
    setSelectedColor(color);
    
    // Generate random card
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    setCardSuit(randomSuit.name as any);
    setCardColor(randomSuit.color as any);
    setIsRevealed(true);

    // Determine if player won
    const won = color === randomSuit.color;
    
    setTimeout(() => {
      onResult(won, won ? winAmount : 0);
    }, 2000);
  };

  const getSuitIcon = () => {
    const suit = suits.find(s => s.name === cardSuit);
    if (!suit) return Heart;
    return suit.icon;
  };

  const getSuitColor = () => {
    return cardColor === "red" ? "text-red-500" : "text-black";
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="p-6 bg-gradient-to-br from-green-900 to-emerald-900 border-2 border-yellow-500 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-400">Double or Nothing</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="text-center space-y-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <p className="text-white/80 mb-2">Current Win Amount:</p>
            <p className="text-3xl font-bold text-green-400">{winAmount} coins</p>
            <p className="text-sm text-white/60 mt-2">Guess the card color to double your winnings!</p>
          </div>

          {/* Card Display */}
          <div className="flex justify-center">
            <div className={`
              w-32 h-44 bg-white rounded-lg border-2 border-gray-300 
              flex flex-col items-center justify-center shadow-lg
              ${isRevealed ? 'animate-pulse' : ''}
            `}>
              {isRevealed ? (
                <div className="text-center">
                  <div className={`text-6xl ${getSuitColor()}`}>
                    {(() => {
                      const SuitIcon = getSuitIcon();
                      return <SuitIcon className="h-16 w-16 mx-auto" />;
                    })()}
                  </div>
                  <div className="text-xs font-bold text-gray-700 mt-2">
                    {cardSuit.charAt(0).toUpperCase() + cardSuit.slice(1)}
                  </div>
                </div>
              ) : (
                <div className="text-6xl text-blue-600">🂠</div>
              )}
            </div>
          </div>

          {/* Color Selection */}
          {!isRevealed && (
            <div className="space-y-4">
              <p className="text-white font-semibold">Choose a color:</p>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => handleGuess("red")}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-bold"
                  disabled={selectedColor !== null}
                >
                  RED
                </Button>
                <Button
                  onClick={() => handleGuess("black")}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 text-lg font-bold"
                  disabled={selectedColor !== null}
                >
                  BLACK
                </Button>
              </div>
            </div>
          )}

          {/* Result Display */}
          {isRevealed && (
            <div className="space-y-4">
              <div className={`text-xl font-bold ${
                selectedColor === cardColor ? 'text-green-400' : 'text-red-400'
              }`}>
                {selectedColor === cardColor ? '🎉 YOU WIN!' : '💔 YOU LOSE!'}
              </div>
              <div className="text-white/80">
                You guessed: <span className={`font-bold ${selectedColor === 'red' ? 'text-red-400' : 'text-gray-400'}`}>
                  {selectedColor?.toUpperCase()}
                </span>
              </div>
              <div className="text-white/80">
                Card was: <span className={`font-bold ${cardColor === 'red' ? 'text-red-400' : 'text-gray-400'}`}>
                  {cardColor.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Skip Option */}
          {!isRevealed && (
            <Button
              onClick={onClose}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Keep Current Winnings
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DoubleOrNothing;
