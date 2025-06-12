import { useState } from 'react';
import { GameState, Seed } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SellModalProps {
  gameState: GameState;
  seeds: Seed[];
  onClose: () => void;
  onSell: (newMoney: number, newInventory: Record<string, number>) => void;
}

export default function SellModal({ gameState, seeds, onClose, onSell }: SellModalProps) {
  const [selectedMode, setSelectedMode] = useState<'menu' | 'select' | 'worth'>('menu');

  const userName = gameState.user?.firstName || 'Player';

  // Calculate fruit value with bonuses
  const calculateFruitValue = (seed: Seed, quantity: number = 1) => {
    let value = seed.value * quantity;
    
    // Apply gear bonuses
    if (gameState.gear.includes('Sprinkler')) {
      value *= 1.5;
    }
    
    // Apply event bonuses
    gameState.activeEvents.forEach(event => {
      value *= event.multiplier;
    });
    
    return Math.floor(value);
  };

  // Get all fruits in inventory
  const getFruits = () => {
    return Object.keys(gameState.inventory)
      .filter(item => item.includes('Fruit') && gameState.inventory[item] > 0)
      .map(fruitName => {
        const baseName = fruitName.replace(' Fruit', '');
        const seed = seeds.find(s => s.name === baseName);
        return { fruitName, seed, quantity: gameState.inventory[fruitName] };
      })
      .filter(item => item.seed);
  };

  // Sell all fruits
  const sellAllFruits = () => {
    const fruits = getFruits();
    
    if (fruits.length === 0) {
      alert("You don't have any fruits to sell! 🍎");
      return;
    }

    let totalValue = 0;
    let soldCount = 0;
    const newInventory = { ...gameState.inventory };

    fruits.forEach(({ fruitName, seed, quantity }) => {
      if (seed) {
        totalValue += calculateFruitValue(seed, quantity);
        soldCount += quantity;
        delete newInventory[fruitName];
      }
    });

    const newMoney = gameState.money + totalValue;
    
    onSell(newMoney, newInventory);
    alert(`Sold ${soldCount} fruits for ${totalValue.toLocaleString()} coins! 💰`);
    onClose();
  };

  // Sell specific fruit
  const sellFruit = (fruitName: string, seed: Seed) => {
    const value = calculateFruitValue(seed, 1);
    const newInventory = { ...gameState.inventory };
    
    newInventory[fruitName]--;
    if (newInventory[fruitName] === 0) {
      delete newInventory[fruitName];
    }

    const newMoney = gameState.money + value;
    
    onSell(newMoney, newInventory);
    alert(`Sold ${fruitName} for ${value.toLocaleString()} coins! 💰`);
    onClose();
  };

  // Check fruit worth
  const checkFruitWorth = (fruitName: string, seed: Seed, quantity: number) => {
    const unitValue = calculateFruitValue(seed, 1);
    const totalValue = calculateFruitValue(seed, quantity);
    
    let bonusText = '';
    
    if (gameState.gear.includes('Sprinkler')) {
      bonusText += '\n🚿 Sprinkler: +50%';
    }
    
    gameState.activeEvents.forEach(event => {
      bonusText += `\n${event.emoji} ${event.name}: x${event.multiplier}`;
    });

    alert(
      `💎 ${fruitName} Worth:\n` +
      `Unit value: ${unitValue.toLocaleString()} coins\n` +
      `Total (${quantity}x): ${totalValue.toLocaleString()} coins${bonusText}`
    );
  };

  const fruits = getFruits();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-game font-bold text-forest">
            💰 Fruit Market
          </DialogTitle>
        </DialogHeader>

        {selectedMode === 'menu' && (
          <div className="space-y-4 mt-4">
            <p className="text-lg mb-6">Hi {userName}, what do you want to sell?</p>
            <div className="space-y-3">
              <Button 
                onClick={sellAllFruits}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl"
              >
                I want to sell all my fruits 🍎
              </Button>
              <Button 
                onClick={() => setSelectedMode('select')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl"
                disabled={fruits.length === 0}
              >
                I want to sell this fruit 🎯
              </Button>
              <Button 
                onClick={() => setSelectedMode('worth')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl"
                disabled={fruits.length === 0}
              >
                How much is this worth? 💎
              </Button>
            </div>
            {fruits.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                You don't have any fruits yet! Plant some seeds first. 🌱
              </p>
            )}
          </div>
        )}

        {selectedMode === 'select' && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Select a fruit to sell:</h3>
              <Button onClick={() => setSelectedMode('menu')} variant="outline">
                ← Back
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {fruits.map(({ fruitName, seed, quantity }) => (
                seed && (
                  <div
                    key={fruitName}
                    className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border-2 border-orange-200 hover:border-orange-400 transition-colors cursor-pointer"
                    onClick={() => sellFruit(fruitName, seed)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{seed.emoji}</div>
                      <h4 className="font-semibold text-sm">{fruitName}</h4>
                      <p className="text-xs text-gray-600">Qty: {quantity}</p>
                      <p className="text-xs text-green-600 font-bold">
                        {calculateFruitValue(seed, 1).toLocaleString()} coins each
                      </p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {selectedMode === 'worth' && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Check fruit value:</h3>
              <Button onClick={() => setSelectedMode('menu')} variant="outline">
                ← Back
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {fruits.map(({ fruitName, seed, quantity }) => (
                seed && (
                  <div
                    key={fruitName}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => checkFruitWorth(fruitName, seed, quantity)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{seed.emoji}</div>
                      <h4 className="font-semibold text-sm">{fruitName}</h4>
                      <p className="text-xs text-gray-600">Qty: {quantity}</p>
                      <p className="text-xs font-bold text-blue-600">Click to check value</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
