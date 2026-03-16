package com.zelus.strava;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class StravaStatsDTO {
    @JsonProperty("biggest_ride_distance") public Double biggestRideDistance;
    @JsonProperty("biggest_climb_elevation_gain") public Double biggestClimbElevationGain;
    @JsonProperty("recent_ride_totals") public ActivityTotal recentRideTotals;
    @JsonProperty("recent_run_totals") public ActivityTotal recentRunTotals;
    @JsonProperty("recent_swim_totals") public ActivityTotal recentSwimTotals;
    @JsonProperty("ytd_ride_totals") public ActivityTotal ytdRideTotals;
    @JsonProperty("ytd_run_totals") public ActivityTotal ytdRunTotals;
    @JsonProperty("ytd_swim_totals") public ActivityTotal ytdSwimTotals;
    @JsonProperty("all_ride_totals") public ActivityTotal allRideTotals;
    @JsonProperty("all_run_totals") public ActivityTotal allRunTotals;
    @JsonProperty("all_swim_totals") public ActivityTotal allSwimTotals;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ActivityTotal {
        public int count;
        public double distance;
        @JsonProperty("moving_time") public int movingTime;
        @JsonProperty("elapsed_time") public int elapsedTime;
        @JsonProperty("elevation_gain") public double elevationGain;
    }
}
