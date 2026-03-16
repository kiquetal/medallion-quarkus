package com.zelus.strava;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class StravaActivityDTO {
    public Long id;
    public String name;
    public double distance;
    @JsonProperty("moving_time") public int movingTime;
    @JsonProperty("elapsed_time") public int elapsedTime;
    @JsonProperty("total_elevation_gain") public double totalElevationGain;
    @JsonProperty("sport_type") public String sportType;
    public String type;
    @JsonProperty("start_date_local") public String startDateLocal;
    public MapDTO map;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MapDTO {
        @JsonProperty("summary_polyline") @JsonAlias("summaryPolyline") public String summaryPolyline;
    }
}
