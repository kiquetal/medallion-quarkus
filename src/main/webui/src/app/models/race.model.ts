export interface Race {
  id?: number;
  name: string;
  raceDate: string;
  distance: number;
  finishTime: string;
  location: string;
  activityType: ActivityType;
  category: RaceCategory;
  medalType: MedalType;
  notes?: string;
  imagePath?: string;
  stravaActivityId?: number;
  stravaPolyline?: string;
}

export type ActivityType = 'RACE' | 'RUN' | 'RIDE';
export type RaceCategory = 'FIVE_K' | 'TEN_K' | 'HALF_MARATHON' | 'MARATHON' | 'TRIATHLON' | 'ULTRA' | 'SHORT_RIDE' | 'MEDIUM_RIDE' | 'CENTURY' | 'OTHER';
export type MedalType = 'GOLD' | 'SILVER' | 'BRONZE' | 'FINISHER' | 'NONE';

export const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: 'RACE', label: '🏁 Race' },
  { value: 'RUN', label: '🏃 Run' },
  { value: 'RIDE', label: '🚴 Ride' },
];

export const RUN_CATEGORIES: { value: RaceCategory; label: string }[] = [
  { value: 'FIVE_K', label: '5K' },
  { value: 'TEN_K', label: '10K' },
  { value: 'HALF_MARATHON', label: 'Half Marathon' },
  { value: 'MARATHON', label: 'Marathon' },
  { value: 'TRIATHLON', label: 'Triathlon' },
  { value: 'ULTRA', label: 'Ultra' },
  { value: 'OTHER', label: 'Other' },
];

export const RIDE_CATEGORIES: { value: RaceCategory; label: string }[] = [
  { value: 'SHORT_RIDE', label: 'Short (< 30 km)' },
  { value: 'MEDIUM_RIDE', label: 'Medium (30–80 km)' },
  { value: 'CENTURY', label: 'Century (100 km+)' },
  { value: 'OTHER', label: 'Other' },
];

export const RACE_CATEGORIES = [...RUN_CATEGORIES, ...RIDE_CATEGORIES.filter(c => c.value !== 'OTHER')];

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
  perActivityType: Record<string, number>;
}
