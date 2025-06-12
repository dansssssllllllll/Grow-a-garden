import { Seed } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SeedShopProps {
  seeds: Seed[];
  money: number;
  inventory: Record<string, number>;
  onClose: () => void;
  onPurchase: (seedName: string, newMoney: number, newInventory: Record<string, number>) => void;
}

export default function SeedShop({ seeds, money, inventory, onClose, onPurchase }: SeedShopProps) {
  const buySeed = (seed: Seed) => {
    if (money >= seed.price) {
      const newMoney = money - seed.price;
      const newInventory = { ...inventory };
      newInventory[seed.name] = (newInventory[seed.name] || 0) + 1;
      
      onPurchase(seed.name, newMoney, newInventory);
      alert(`Purchased ${seed.name} seed! 🌱`);
    } else {
      alert("Not enough coins! 💰");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div 
            className="w-full h-32 bg-cover bg-center rounded-xl mb-4"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200')"
            }}
          />
          <DialogTitle className="text-3xl font-game font-bold text-forest">
            🌱 Seed Shop
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          {seeds.map((seed) => (
            <div
              key={seed.name}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200 hover:border-green-400 transition-colors"
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{seed.emoji}</div>
                <h3 className="font-bold text-forest">{seed.name}</h3>
                <p className="text-gold font-bold">{seed.price.toLocaleString()} coins</p>
                <p className="text-xs text-gray-600 mt-1">
                  Growth: {(seed.growTime / 1000).toFixed(0)}s
                </p>
                <p className="text-xs text-gray-600">
                  Value: {seed.value.toLocaleString()} coins
                </p>
                <Button
                  onClick={() => buySeed(seed)}
                  className="bg-forest hover:bg-forest/90 text-white px-4 py-2 rounded-lg mt-2 text-sm w-full"
                  disabled={money < seed.price}
                >
                  {money >= seed.price ? 'Buy Seed' : 'Not Enough Coins'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
