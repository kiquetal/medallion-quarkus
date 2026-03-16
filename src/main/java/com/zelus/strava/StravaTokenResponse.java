package com.zelus.strava;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class StravaTokenResponse {
    @JsonProperty("access_token") public String accessToken;
    @JsonProperty("refresh_token") public String refreshToken;
    @JsonProperty("expires_at") public Long expiresAt;
    @JsonProperty("expires_in") public Long expiresIn;
    public StravaAthleteDTO athlete;
}
