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
  const [draggedGear, setDraggedGear] = useState<string | null>(null);
  const [dragOverPlot, setDragOverPlot] = useState<number | null>(null);

  // Get plant stage image based on growth percentage
  const getPlantStageImage = (plotData: PlotData) => {
    if (!plotData) return '';
    
    const { growthStage, name } = plotData;
    
    if (growthStage < 25) {
      return '🌱'; // Seed/sprout stage
    } else if (growthStage < 50) {
      return '🌿'; // Young plant stage  
    } else if (growthStage < 75) {
      return '🌾'; // Growing stage
    } else if (growthStage >= 100) {
      return plotData.emoji; // Fully grown fruit
    } else {
      return '🌿'; // Default growing stage
    }
  };

  // Calculate growth progress
  const calculateGrowthProgress = (plotData: PlotData, seed: Seed) => {
    const elapsed = Date.now() - plotData.plantedAt;
    const progress = Math.min((elapsed / seed.growTime) * 100, 100);
    return progress;
  };

  // Update growth stages periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedGarden = gameState.garden.map((plotData, index) => {
        if (!plotData || plotData.isGrown) return plotData;
        
        const seed = seeds.find(s => s.name === plotData.name);
        if (!seed) return plotData;
        
        const newProgress = calculateGrowthProgress(plotData, seed);
        const isNowGrown = newProgress >= 100;
        
        return {
          ...plotData,
          growthStage: newProgress,
          isGrown: isNowGrown
        };
      });
      
      // Only update if there are changes
      const hasChanges = updatedGarden.some((plot, index) => {
        const original = gameState.garden[index];
        return plot && original && (
          plot.growthStage !== original.growthStage || 
          plot.isGrown !== original.isGrown
        );
      });
      
      if (hasChanges) {
        updateGameState({ garden: updatedGarden });
      }
    }, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, [gameState.garden, seeds, updateGameState]);

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

  // Handle gear drag and drop
  const handleDragOver = (e: React.DragEvent, plotIndex: number) => {
    e.preventDefault();
    setDragOverPlot(plotIndex);
  };

  const handleDragLeave = () => {
    setDragOverPlot(null);
  };

  const handleDrop = (e: React.DragEvent, plotIndex: number) => {
    e.preventDefault();
    const gearName = e.dataTransfer.getData('text/plain');
    const plotData = gameState.garden[plotIndex];
    
    if (!plotData || !gearName) {
      setDragOverPlot(null);
      return;
    }

    applyGearToPlant(gearName, plotIndex);
    setDragOverPlot(null);
  };

  const applyGearToPlant = (gearName: string, plotIndex: number) => {
    const plotData = gameState.garden[plotIndex];
    if (!plotData) return;

    const newGarden = [...gameState.garden];
    
    if (gearName === 'Watering Can') {
      // Speed up growth by 25%
      const seed = seeds.find(s => s.name === plotData.name);
      if (seed && !plotData.isGrown) {
        const newGrowthStage = Math.min(plotData.growthStage + 25, 100);
        newGarden[plotIndex] = {
          ...plotData,
          growthStage: newGrowthStage,
          isGrown: newGrowthStage >= 100
        };
        
        updateGameState({ garden: newGarden });
        alert(`Used Watering Can! Plant growth boosted by 25%! 💧`);
      } else {
        alert("This plant doesn't need watering right now!");
      }
    } else if (gearName === 'Sprinkler') {
      // Enhance the plant's value
      if (plotData.isGrown) {
        const enhancedValue = Math.floor(plotData.value * 1.5);
        newGarden[plotIndex] = {
          ...plotData,
          value: enhancedValue
        };
        
        updateGameState({ garden: newGarden });
        alert(`Used Sprinkler! Fruit value enhanced by 50%! 💦`);
      } else {
        alert("Wait for the plant to grow first!");
      }
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
      isGrown: false,
      growthStage: 0
    };

    // Apply watering can effect (5% chance to skip growth)
    if (gameState.gear.includes('Watering Can') && Math.random() < 0.05) {
      plotData.isGrown = true;
      plotData.growthStage = 100;
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
    <div className="bg-white bg-opacity-90 rounded-2xl p-4 shadow-lg">
      <h2 className="font-game font-bold text-lg text-forest mb-4 text-center">
        🌿 Your Garden Paradise
      </h2>
      
      {/* Garden Grid (6x5 = 30 plots) */}
      <div className="grid grid-cols-6 gap-2 max-w-sm mx-auto">
        {gameState.garden.map((plotData, index) => (
          <div
            key={index}
            className={`w-14 h-14 plot-soil border-2 rounded-lg cursor-pointer transition-colors flex items-center justify-center relative ${
              dragOverPlot === index 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-soil hover:border-forest'
            }`}
            onClick={() => handlePlotClick(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            {plotData ? (
              <div className="flex flex-col items-center">
                <span className={`text-2xl transition-all duration-500 ${plotData.isGrown ? 'animate-bounce' : ''}`}>
                  {getPlantStageImage(plotData)}
                </span>
                {!plotData.isGrown && (
                  <div className="w-8 h-1 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-300"
                      style={{ width: `${plotData.growthStage}%` }}
                    />
                  </div>
                )}
                {plotData.isGrown && (
                  <div className="text-xs text-green-600 font-bold animate-pulse">Ready!</div>
                )}
              </div>
            ) : (
              <span className="text-gray-400 text-xl">+</span>
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
