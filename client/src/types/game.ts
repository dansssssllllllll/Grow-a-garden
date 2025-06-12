export interface Seed {
  name: string;
  price: number;
  emoji: string;
  growTime: number;
  value: number;
}

export interface GearItem {
  name: string;
  price: number;
  emoji: string;
  effect: string;
}

export interface GameEvent {
  name: string;
  emoji: string;
  multiplier: number;
  duration: number;
  cooldown: number;
  description: string;
}

export interface PlotData {
  name: string;
  emoji: string;
  value: number;
  plantedAt: number;
  isGrown: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  age: number;
  gender: 'boy' | 'girl';
}

export interface GameState {
  user: UserProfile | null;
  money: number;
  inventory: Record<string, number>;
  garden: (PlotData | null)[];
  gear: string[];
  activeEvents: GameEvent[];
  usedCodes: string[];
}

export interface RedeemCode {
  type: 'coins' | 'seed';
  amount: number;
  seedName?: string;
}
