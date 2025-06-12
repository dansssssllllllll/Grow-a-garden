import { GearItem } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface GearShopProps {
  gear: GearItem[];
  money: number;
  ownedGear: string[];
  onClose: () => void;
  onPurchase: (gearName: string, newMoney: number, newGear: string[]) => void;
}

export default function GearShop({ gear, money, ownedGear, onClose, onPurchase }: GearShopProps) {
  const buyGear = (item: GearItem) => {
    if (ownedGear.includes(item.name)) {
      alert("You already own this item! 🔧");
      return;
    }

    if (money >= item.price) {
      const newMoney = money - item.price;
      const newGear = [...ownedGear, item.name];
      
      onPurchase(item.name, newMoney, newGear);
      alert(`Purchased ${item.name}! 🔧`);
    } else {
      alert("Not enough coins! 💰");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div 
            className="w-full h-32 bg-cover bg-center rounded-xl mb-4"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=200')"
            }}
          />
          <DialogTitle className="text-3xl font-game font-bold text-forest">
            🔧 Gear Shop
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          {gear.map((item) => {
            const owned = ownedGear.includes(item.name);
            
            return (
              <div
                key={item.name}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200 hover:border-blue-400 transition-colors"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{item.emoji}</div>
                  <h3 className="font-bold text-blue-800">{item.name}</h3>
                  <p className="text-gold font-bold">{item.price.toLocaleString()} coins</p>
                  <p className="text-xs text-gray-600 mt-2 mb-3">{item.effect}</p>
                  <Button
                    onClick={() => buyGear(item)}
                    className={`w-full text-white px-4 py-2 rounded-lg text-sm ${
                      owned 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : money >= item.price
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={owned || money < item.price}
                  >
                    {owned ? 'Owned ✓' : money >= item.price ? 'Buy Gear' : 'Not Enough Coins'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
