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
    ? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100'
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100';

  return (
    <div className="game-bg min-h-screen">
      {/* Header */}
      <header className="bg-white bg-opacity-95 shadow-lg p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <img 
              src={userAvatarUrl}
              alt="User avatar" 
              className="w-12 h-12 rounded-full border-4 border-forest"
            />
            <div>
              <h1 className="font-game font-bold text-xl text-forest">
                {gameState.user?.firstName || 'Player'}
              </h1>
              <p className="text-sm text-gray-600">Garden Master</p>
            </div>
          </div>

          {/* Money Display */}
          <div className="flex items-center space-x-2 bg-gold bg-opacity-20 px-4 py-2 rounded-full border-2 border-gold">
            <span className="text-2xl">💰</span>
            <span className="font-bold text-xl text-yellow-800">
              {gameState.money.toLocaleString()}
            </span>
            <span className="text-sm text-yellow-700">coins</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex max-w-7xl mx-auto p-4 gap-6">
        {/* Left Sidebar */}
        <div className="w-80 space-y-4">
          {/* Shop Buttons */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <h3 className="font-game font-bold text-lg text-forest mb-4">🛍️ Shops</h3>
            <div className="space-y-2">
              <Button 
                onClick={() => setSeedShopOpen(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold shadow-md"
              >
                🌱 Seed Shop
              </Button>
              <Button 
                onClick={() => setGearShopOpen(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-md"
              >
                🔧 Gear Shop
              </Button>
              <Button 
                onClick={() => setSellModalOpen(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md"
              >
                💰 Sell Fruits
              </Button>
            </div>
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

        {/* Garden Area */}
        <div className="flex-1">
          <Garden 
            gameState={gameState}
            updateGameState={updateGameState}
            seeds={seeds}
          />
        </div>
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
