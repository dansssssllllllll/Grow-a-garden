import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RedeemCode } from '@/types/game';

interface RedeemModalProps {
  usedCodes: string[];
  redeemCodes: Record<string, RedeemCode>;
  onClose: () => void;
  onRedeem: (code: string, newMoney: number, newInventory: Record<string, number>, newUsedCodes: string[]) => void;
}

export default function RedeemModal({ 
  usedCodes, 
  redeemCodes, 
  onClose, 
  onRedeem 
}: RedeemModalProps) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');

  const handleRedeem = () => {
    if (!code.trim()) {
      setMessage('Please enter a code');
      setMessageType('error');
      return;
    }

    if (usedCodes.includes(code)) {
      setMessage('Code already used! 🚫');
      setMessageType('error');
      return;
    }

    const reward = redeemCodes[code];
    if (!reward) {
      setMessage('Invalid code! ❌');
      setMessageType('error');
      return;
    }

    // Get current state from localStorage for accurate calculations
    const savedState = JSON.parse(localStorage.getItem('gardenGameState') || '{}');
    const currentMoney = savedState.money || 0;
    const currentInventory = savedState.inventory || {};

    let newMoney = currentMoney;
    let newInventory = { ...currentInventory };

    if (reward.type === 'coins') {
      newMoney += reward.amount;
      setMessage(`Redeemed ${reward.amount.toLocaleString()} coins! 💰`);
    } else if (reward.type === 'seed' && reward.seedName) {
      newInventory[reward.seedName] = (newInventory[reward.seedName] || 0) + reward.amount;
      setMessage(`Redeemed ${reward.amount} ${reward.seedName} seed(s)! 🌱`);
    }

    setMessageType('success');
    const newUsedCodes = [...usedCodes, code];

    onRedeem(code, newMoney, newInventory, newUsedCodes);
    setCode('');

    // Auto-close after 2 seconds
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-game font-bold text-forest">
            🎁 Redeem Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <Input
            type="text"
            placeholder="Enter redeem code..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleRedeem()}
            className="border-2 border-sage focus:border-forest"
          />
          
          <Button 
            onClick={handleRedeem}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold"
          >
            Redeem 🎁
          </Button>
          
          {message && (
            <div className={`text-center text-sm ${
              messageType === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {message}
            </div>
          )}


        </div>
      </DialogContent>
    </Dialog>
  );
}
