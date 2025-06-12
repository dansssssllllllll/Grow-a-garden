import { Seed, GearItem } from '@/types/game';
import { Button } from '@/components/ui/button';

interface InventoryProps {
  inventory: Record<string, number>;
  gear: string[];
  seeds: Seed[];
  gearItems: GearItem[];
  onRedeemCode: () => void;
}

export default function Inventory({ 
  inventory, 
  gear, 
  seeds, 
  gearItems, 
  onRedeemCode 
}: InventoryProps) {
  const getItemEmoji = (itemName: string) => {
    // Check if it's a seed
    const seed = seeds.find(s => s.name === itemName);
    if (seed) return seed.emoji;
    
    // Check if it's a fruit
    const baseName = itemName.replace(' Fruit', '');
    const fruitSeed = seeds.find(s => s.name === baseName);
    if (fruitSeed) return fruitSeed.emoji;
    
    return '📦';
  };

  const getGearEmoji = (gearName: string) => {
    const gearItem = gearItems.find(g => g.name === gearName);
    return gearItem ? gearItem.emoji : '🔧';
  };

  const inventoryItems = Object.keys(inventory).filter(item => inventory[item] > 0);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-game font-bold text-lg text-forest">🎒 Inventory</h3>
        <Button 
          onClick={onRedeemCode}
          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg text-sm"
        >
          Redeem Code 🎁
        </Button>
      </div>
      
      <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
        {/* Inventory Items */}
        {inventoryItems.map((itemName) => (
          <div
            key={itemName}
            className="bg-gray-100 rounded-lg p-2 text-center border-2 border-gray-200 hover:border-gray-300 transition-colors"
            title={itemName}
          >
            <div className="text-lg">{getItemEmoji(itemName)}</div>
            <div className="text-xs font-semibold">{inventory[itemName]}</div>
          </div>
        ))}
        
        {/* Gear Items */}
        {gear.map((gearName) => (
          <div
            key={gearName}
            className="bg-blue-100 rounded-lg p-2 text-center border-2 border-blue-200 hover:border-blue-300 transition-colors"
            title={gearName}
          >
            <div className="text-lg">{getGearEmoji(gearName)}</div>
            <div className="text-xs font-semibold">1</div>
          </div>
        ))}
        
        {/* Empty State */}
        {inventoryItems.length === 0 && gear.length === 0 && (
          <div className="col-span-4 text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-sm">Your inventory is empty!</p>
            <p className="text-xs text-gray-400">Buy seeds or gear to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
