export interface StravaStatus {
  configured: boolean;
  connected: boolean;
  athleteName: string;
  athleteId: number;
  athleteProfile: string;
}

export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  movingTime: number;
  elapsedTime: number;
  totalElevationGain: number;
  sportType: string;
  type: string;
  startDateLocal: string;
  map?: { summaryPolyline: string };
}

export interface StravaStats {
  biggestRideDistance: number;
  biggestClimbElevationGain: number;
  allRunTotals: ActivityTotal;
  allRideTotals: ActivityTotal;
  allSwimTotals: ActivityTotal;
  ytdRunTotals: ActivityTotal;
  ytdRideTotals: ActivityTotal;
  ytdSwimTotals: ActivityTotal;
}

export interface ActivityTotal {
  count: number;
  distance: number;
  movingTime: number;
  elevationGain: number;
}

export interface StravaData {
  athlete: string;
  stats: string;
  activities: string;
  lastSync: string;
}
