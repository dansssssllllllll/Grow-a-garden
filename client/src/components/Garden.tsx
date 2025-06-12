import { useState, useEffect } from 'react';
import { GameState, PlotData, Seed } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface GardenProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  seeds: Seed[];
}

export default function Garden({ gameState, updateGameState, seeds }: GardenProps) {
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);
  const [seedSelectionOpen, setSeedSelectionOpen] = useState(false);

  // Handle plot click
  const handlePlotClick = (plotIndex: number) => {
    const plotData = gameState.garden[plotIndex];
    
    if (!plotData) {
      // Empty plot - show seed selection
      const availableSeeds = seeds.filter(seed => (gameState.inventory[seed.name] || 0) > 0);
      
      if (availableSeeds.length === 0) {
        alert("You don't have any seeds! Visit the seed shop first.");
        return;
      }
      
      setSelectedPlot(plotIndex);
      setSeedSelectionOpen(true);
    } else if (plotData.isGrown) {
      // Harvest fruit
      harvestFruit(plotIndex);
    }
  };

  // Plant seed
  const plantSeed = (plotIndex: number, seed: Seed) => {
    const newInventory = { ...gameState.inventory };
    newInventory[seed.name]--;
    if (newInventory[seed.name] === 0) {
      delete newInventory[seed.name];
    }

    const newGarden = [...gameState.garden];
    const plotData: PlotData = {
      name: seed.name,
      emoji: seed.emoji,
      value: seed.value,
      plantedAt: Date.now(),
      isGrown: false
    };

    // Apply watering can effect (5% chance to skip growth)
    if (gameState.gear.includes('Watering Can') && Math.random() < 0.05) {
      plotData.isGrown = true;
    } else {
      // Start growth timer
      setTimeout(() => {
        const currentGarden = JSON.parse(localStorage.getItem('gardenGameState') || '{}').garden || [];
        if (currentGarden[plotIndex] && !currentGarden[plotIndex].isGrown) {
          const updatedGarden = [...currentGarden];
          updatedGarden[plotIndex] = { ...updatedGarden[plotIndex], isGrown: true };
          
          const savedState = JSON.parse(localStorage.getItem('gardenGameState') || '{}');
          savedState.garden = updatedGarden;
          localStorage.setItem('gardenGameState', JSON.stringify(savedState));
          
          // Trigger re-render
          updateGameState({ garden: updatedGarden });
        }
      }, seed.growTime);
    }

    newGarden[plotIndex] = plotData;
    
    updateGameState({ 
      inventory: newInventory, 
      garden: newGarden 
    });
    
    setSeedSelectionOpen(false);
    setSelectedPlot(null);
  };

  // Harvest fruit
  const harvestFruit = (plotIndex: number) => {
    const plotData = gameState.garden[plotIndex];
    if (!plotData) return;

    const fruitName = plotData.name + " Fruit";
    const newInventory = { ...gameState.inventory };
    newInventory[fruitName] = (newInventory[fruitName] || 0) + 1;

    const newGarden = [...gameState.garden];
    newGarden[plotIndex] = null;

    updateGameState({ 
      inventory: newInventory, 
      garden: newGarden 
    });
  };

  // Get available seeds for planting
  const getAvailableSeeds = () => {
    return seeds.filter(seed => (gameState.inventory[seed.name] || 0) > 0);
  };

  return (
    <div className="bg-white bg-opacity-90 rounded-2xl p-6 shadow-lg">
      <h2 className="font-game font-bold text-2xl text-forest mb-6 text-center">
        🌿 Your Garden Paradise
      </h2>
      
      {/* Garden Grid (6x5 = 30 plots) */}
      <div className="grid grid-cols-6 gap-3 max-w-4xl mx-auto">
        {gameState.garden.map((plotData, index) => (
          <div
            key={index}
            className="w-20 h-20 plot-soil border-2 border-soil rounded-lg cursor-pointer hover:border-forest transition-colors flex items-center justify-center text-2xl relative"
            onClick={() => handlePlotClick(index)}
          >
            {plotData ? (
              plotData.isGrown ? (
                <span className="text-3xl animate-pulse">{plotData.emoji}</span>
              ) : (
                <span className="text-xl">🌱</span>
              )
            ) : (
              <span className="text-gray-400 text-3xl">+</span>
            )}
          </div>
        ))}
      </div>

      {/* Seed Selection Dialog */}
      <Dialog open={seedSelectionOpen} onOpenChange={setSeedSelectionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-game text-forest">Choose a Seed to Plant 🌱</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {getAvailableSeeds().map((seed) => (
              <div
                key={seed.name}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer text-center"
                onClick={() => selectedPlot !== null && plantSeed(selectedPlot, seed)}
              >
                <div className="text-4xl mb-2">{seed.emoji}</div>
                <h3 className="font-bold text-forest">{seed.name}</h3>
                <p className="text-sm text-gray-600">
                  Available: {gameState.inventory[seed.name] || 0}
                </p>
                <Button className="mt-2 bg-forest hover:bg-forest/90 text-white text-sm">
                  Plant
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
