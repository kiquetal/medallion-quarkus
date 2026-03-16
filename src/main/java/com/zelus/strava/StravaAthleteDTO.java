package com.zelus.strava;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class StravaAthleteDTO {
    public Long id;
    public String firstname;
    public String lastname;
    public String city;
    public String state;
    public String country;
    public String sex;
    public String profile;
    @JsonProperty("profile_medium") public String profileMedium;
}
