import { useState, useEffect, useCallback } from 'react';
import { GameState, Seed, GearItem, GameEvent, RedeemCode } from '@/types/game';

const SEEDS: Seed[] = [
  { name: "Carrot", price: 10, emoji: "🥕", growTime: 30000, value: 15 },
  { name: "Orange", price: 20, emoji: "🍊", growTime: 45000, value: 30 },
  { name: "Banana", price: 15, emoji: "🍌", growTime: 35000, value: 25 },
  { name: "Mango", price: 50, emoji: "🥭", growTime: 60000, value: 75 },
  { name: "Bamboo", price: 4000, emoji: "🎋", growTime: 120000, value: 6000 },
  { name: "Beans", price: 100, emoji: "🫘", growTime: 40000, value: 150 },
  { name: "Cacao", price: 20000, emoji: "🍫", growTime: 180000, value: 30000 },
  { name: "Candy Blossom", price: 2550000, emoji: "🌸", growTime: 300000, value: 3825000 },
  { name: "Super Seed", price: 5000, emoji: "✨", growTime: 90000, value: 10000 },
  { name: "Apple", price: 25, emoji: "🍎", growTime: 40000, value: 40 },
  { name: "Grape", price: 35, emoji: "🍇", growTime: 50000, value: 55 },
  { name: "Strawberry", price: 18, emoji: "🍓", growTime: 25000, value: 30 },
  { name: "Pineapple", price: 80, emoji: "🍍", growTime: 70000, value: 120 },
  { name: "Watermelon", price: 45, emoji: "🍉", growTime: 55000, value: 70 },
  { name: "Corn", price: 12, emoji: "🌽", growTime: 35000, value: 20 },
  { name: "Tomato", price: 22, emoji: "🍅", growTime: 42000, value: 35 }
];

const GEAR: GearItem[] = [
  { name: "Watering Can", price: 200, emoji: "🪣", effect: "5% chance to skip growth stage" },
  { name: "Sprinkler", price: 45000, emoji: "💦", effect: "Makes fruits larger and more valuable (+50% value)" }
];

const EVENTS: GameEvent[] = [
  { name: "Bee Event", emoji: "🐝", multiplier: 5, duration: 60000, cooldown: 50000, description: "Honey boosts fruit value!" },
  { name: "Thunder Event", emoji: "⚡", multiplier: 15, duration: 120000, cooldown: 60000, description: "Lightning charges your crops!" },
  { name: "Lucky Event", emoji: "🍀", multiplier: 20, duration: 180000, cooldown: 30000, description: "Fortune smiles upon your sales!" }
];

const REDEEM_CODES: Record<string, RedeemCode> = {
  "dansdev": { type: "coins", amount: 50000000 },
  "pogi_ni_daniel": { type: "seed", seedName: "Candy Blossom", amount: 3 },
  "free_super_seed": { type: "seed", seedName: "Super Seed", amount: 3 }
};

const INITIAL_STATE: GameState = {
  user: null,
  money: 1000,
  inventory: {},
  garden: Array(30).fill(null),
  gear: [],
  activeEvents: [],
  usedCodes: []
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [eventTimers, setEventTimers] = useState<Record<string, NodeJS.Timeout>>({});

  // Load game state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gardenGameState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate old garden data to include growthStage
        if (parsed.garden) {
          parsed.garden = parsed.garden.map((plot: any) => {
            if (plot && typeof plot.growthStage === 'undefined') {
              return {
                ...plot,
                growthStage: plot.isGrown ? 100 : 0
              };
            }
            return plot;
          });
        }
        setGameState(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load game state:', error);
      }
    }
  }, []);

  // Save game state to localStorage
  const saveGameState = useCallback((state: GameState) => {
    localStorage.setItem('gardenGameState', JSON.stringify(state));
  }, []);

  // Update and save game state
  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => {
      const newState = { ...prev, ...updates };
      saveGameState(newState);
      return newState;
    });
  }, [saveGameState]);

  // Start event system
  const startEventSystem = useCallback(() => {
    EVENTS.forEach((event, index) => {
      const startEvent = () => {
        updateGameState({
          activeEvents: [...gameState.activeEvents, event]
        });

        const stopTimer = setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            activeEvents: prev.activeEvents.filter(e => e.name !== event.name)
          }));
        }, event.duration);

        const restartTimer = setTimeout(startEvent, event.duration + event.cooldown);

        setEventTimers(prev => ({
          ...prev,
          [`${event.name}_stop`]: stopTimer,
          [`${event.name}_restart`]: restartTimer
        }));
      };

      // Stagger initial starts
      const initialTimer = setTimeout(startEvent, event.cooldown * (index + 1));
      setEventTimers(prev => ({
        ...prev,
        [`${event.name}_initial`]: initialTimer
      }));
    });
  }, [gameState.activeEvents, updateGameState]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      Object.values(eventTimers).forEach(timer => clearTimeout(timer));
    };
  }, [eventTimers]);

  return {
    gameState,
    updateGameState,
    seeds: SEEDS,
    gear: GEAR,
    events: EVENTS,
    redeemCodes: REDEEM_CODES,
    startEventSystem
  };
}
