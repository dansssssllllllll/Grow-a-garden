import { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import ProfileSetup from '@/components/ProfileSetup';
import GameInterface from '@/components/GameInterface';
import { UserProfile } from '@/types/game';

export default function Game() {
  const { gameState, updateGameState, seeds, gear, redeemCodes, startEventSystem } = useGameState();

  const handleProfileComplete = (profile: UserProfile) => {
    updateGameState({ user: profile });
  };

  // Start event system when user is set
  useEffect(() => {
    if (gameState.user && gameState.activeEvents.length === 0) {
      startEventSystem();
    }
  }, [gameState.user, gameState.activeEvents.length, startEventSystem]);

  return (
    <div className="min-h-screen">
      {!gameState.user ? (
        <ProfileSetup onComplete={handleProfileComplete} />
      ) : (
        <GameInterface 
          gameState={gameState}
          updateGameState={updateGameState}
          seeds={seeds}
          gear={gear}
          redeemCodes={redeemCodes}
        />
      )}
    </div>
  );
}
