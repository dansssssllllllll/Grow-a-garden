import { GameState } from '@/types/game';
import Garden from './Garden';
import SeedShop from './SeedShop';
import GearShop from './GearShop';
import SellModal from './SellModal';
import RedeemModal from './RedeemModal';
import Inventory from './Inventory';
import EventsDisplay from './EventsDisplay';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface GameInterfaceProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  seeds: any[];
  gear: any[];
  redeemCodes: Record<string, any>;
}

export default function GameInterface({ 
  gameState, 
  updateGameState, 
  seeds, 
  gear, 
  redeemCodes 
}: GameInterfaceProps) {
  const [seedShopOpen, setSeedShopOpen] = useState(false);
  const [gearShopOpen, setGearShopOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [redeemModalOpen, setRedeemModalOpen] = useState(false);

  const userAvatarUrl = gameState.user?.gender === 'girl'
    ? 'https://i.pravatar.cc/100?img=9'
    : 'https://i.pravatar.cc/100?img=8';

  return (
    <div className="game-bg min-h-screen max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white bg-opacity-95 shadow-lg p-3">
        <div className="flex justify-between items-center">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <img 
              src={userAvatarUrl}
              alt="User avatar" 
              className="w-10 h-10 rounded-full border-3 border-forest"
            />
            <div>
              <h1 className="font-game font-bold text-lg text-forest">
                {gameState.user?.firstName || 'Player'}
              </h1>
              <p className="text-xs text-gray-600">Garden Master</p>
            </div>
          </div>

          {/* Money Display */}
          <div className="flex items-center space-x-1 bg-gold bg-opacity-20 px-3 py-1 rounded-full border-2 border-gold">
            <span className="text-lg">💰</span>
            <span className="font-bold text-sm text-yellow-800">
              {gameState.money.toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-3 space-y-4">
        {/* Shop Buttons */}
        <div className="bg-white rounded-xl p-3 shadow-lg">
          <div className="grid grid-cols-3 gap-2">
            <Button 
              onClick={() => setSeedShopOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold text-xs py-2"
            >
              🌱 Seeds
            </Button>
            <Button 
              onClick={() => setGearShopOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs py-2"
            >
              🔧 Gear
            </Button>
            <Button 
              onClick={() => setSellModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2"
            >
              💰 Sell
            </Button>
          </div>
        </div>

        {/* Garden Area - Centered */}
        <div className="flex justify-center">
          <Garden 
            gameState={gameState}
            updateGameState={updateGameState}
            seeds={seeds}
          />
        </div>

        {/* Events Display */}
        <EventsDisplay activeEvents={gameState.activeEvents} />

        {/* Inventory */}
        <Inventory 
          inventory={gameState.inventory} 
          gear={gameState.gear} 
          seeds={seeds}
          gearItems={gear}
          onRedeemCode={() => setRedeemModalOpen(true)}
        />
      </div>

      {/* Modals */}
      {seedShopOpen && (
        <SeedShop 
          seeds={seeds}
          money={gameState.money}
          inventory={gameState.inventory}
          onClose={() => setSeedShopOpen(false)}
          onPurchase={(seedName, newMoney, newInventory) => {
            updateGameState({ money: newMoney, inventory: newInventory });
          }}
        />
      )}

      {gearShopOpen && (
        <GearShop 
          gear={gear}
          money={gameState.money}
          ownedGear={gameState.gear}
          onClose={() => setGearShopOpen(false)}
          onPurchase={(gearName, newMoney, newGear) => {
            updateGameState({ money: newMoney, gear: newGear });
          }}
        />
      )}

      {sellModalOpen && (
        <SellModal 
          gameState={gameState}
          seeds={seeds}
          onClose={() => setSellModalOpen(false)}
          onSell={(newMoney, newInventory) => {
            updateGameState({ money: newMoney, inventory: newInventory });
          }}
        />
      )}

      {redeemModalOpen && (
        <RedeemModal 
          usedCodes={gameState.usedCodes}
          redeemCodes={redeemCodes}
          onClose={() => setRedeemModalOpen(false)}
          onRedeem={(code, newMoney, newInventory, newUsedCodes) => {
            updateGameState({ 
              money: newMoney, 
              inventory: newInventory, 
              usedCodes: newUsedCodes 
            });
          }}
        />
      )}
    </div>
  );
}
