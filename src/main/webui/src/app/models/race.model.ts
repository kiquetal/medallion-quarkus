export interface Race {
  id?: number;
  name: string;
  raceDate: string;
  distance: number;
  finishTime: string;
  location: string;
  category: RaceCategory;
  medalType: MedalType;
  notes?: string;
  imagePath?: string;
  stravaActivityId?: number;
  stravaPolyline?: string;
}

export type RaceCategory = 'FIVE_K' | 'TEN_K' | 'HALF_MARATHON' | 'MARATHON' | 'TRIATHLON' | 'ULTRA' | 'OTHER';
export type MedalType = 'GOLD' | 'SILVER' | 'BRONZE' | 'FINISHER' | 'NONE';

export const RACE_CATEGORIES: { value: RaceCategory; label: string }[] = [
  { value: 'FIVE_K', label: '5K' },
  { value: 'TEN_K', label: '10K' },
  { value: 'HALF_MARATHON', label: 'Half Marathon' },
  { value: 'MARATHON', label: 'Marathon' },
  { value: 'TRIATHLON', label: 'Triathlon' },
  { value: 'ULTRA', label: 'Ultra' },
  { value: 'OTHER', label: 'Other' },
];

export const MEDAL_TYPES: { value: MedalType; label: string }[] = [
  { value: 'GOLD', label: '🥇 Gold' },
  { value: 'SILVER', label: '🥈 Silver' },
  { value: 'BRONZE', label: '🥉 Bronze' },
  { value: 'FINISHER', label: '🏅 Finisher' },
  { value: 'NONE', label: 'None' },
];

export interface Stats {
  totalRaces: number;
  totalDistance: number;
  racesPerCategory: Record<string, number>;
  racesPerYear: Record<string, number>;
  medalsByType: Record<string, number>;
}
