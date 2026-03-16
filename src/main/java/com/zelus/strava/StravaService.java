package com.zelus.strava;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zelus.entity.StravaCache;
import com.zelus.entity.StravaToken;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

@ApplicationScoped
public class StravaService {

    private static final Logger LOG = Logger.getLogger(StravaService.class);

    @ConfigProperty(name = "strava.redirect-uri")
    String redirectUri;

    @Inject @RestClient
    StravaClient client;

    @Inject
    ObjectMapper mapper;

    public String buildAuthorizeUrl() {
        StravaToken t = StravaToken.getOrCreate();
        return "https://www.strava.com/oauth/authorize" +
                "?client_id=" + t.clientId +
                "&redirect_uri=" + redirectUri +
                "&response_type=code" +
                "&approval_prompt=auto" +
                "&scope=read,activity:read_all";
    }

    @Transactional
    public void saveConfig(String clientId, String clientSecret) {
        StravaToken t = StravaToken.getOrCreate();
        t.clientId = clientId;
        t.clientSecret = clientSecret;
    }

    @Transactional
    public void exchangeCode(String code) {
        StravaToken t = StravaToken.getOrCreate();
        StravaTokenResponse resp = client.exchangeToken(
                t.clientId, t.clientSecret, code, "authorization_code");
        t.accessToken = resp.accessToken;
        t.refreshToken = resp.refreshToken;
        t.expiresAt = resp.expiresAt;
        if (resp.athlete != null) {
            t.athleteId = resp.athlete.id;
            t.athleteName = resp.athlete.firstname + " " + resp.athlete.lastname;
            t.athleteProfile = resp.athlete.profileMedium;
        }
    }

    @Transactional
    public void refreshTokenIfNeeded() {
        StravaToken t = StravaToken.getOrCreate();
        if (!t.isConnected() || !t.isExpired()) return;
        LOG.info("Refreshing Strava token...");
        StravaTokenResponse resp = client.refreshToken(
                t.clientId, t.clientSecret, t.refreshToken, "refresh_token");
        t.accessToken = resp.accessToken;
        t.refreshToken = resp.refreshToken;
        t.expiresAt = resp.expiresAt;
    }

    @Transactional
    public void syncData() {
        StravaToken t = StravaToken.getOrCreate();
        if (!t.isConnected()) return;
        refreshTokenIfNeeded();

        String bearer = "Bearer " + t.accessToken;
        try {
            StravaAthleteDTO athlete = client.getAthlete(bearer);
            t.athleteId = athlete.id;
            t.athleteName = athlete.firstname + " " + athlete.lastname;
            t.athleteProfile = athlete.profileMedium;

            StravaStatsDTO stats = client.getStats(t.athleteId, bearer);
            List<StravaActivityDTO> activities = client.getActivities(bearer, 50, 1);

            StravaCache cache = StravaCache.getOrCreate();
            cache.athleteJson = mapper.writeValueAsString(athlete);
            cache.statsJson = mapper.writeValueAsString(stats);
            cache.activitiesJson = mapper.writeValueAsString(activities);
            cache.lastSync = Instant.now();
            LOG.infof("Strava sync complete: %d activities cached", activities.size());
        } catch (Exception e) {
            LOG.error("Strava sync failed", e);
        }
    }

    @Transactional
    public void disconnect() {
        StravaToken t = StravaToken.getOrCreate();
        t.accessToken = null;
        t.refreshToken = null;
        t.expiresAt = null;
        t.athleteId = null;
        t.athleteName = null;
        t.athleteProfile = null;
        StravaCache cache = StravaCache.getOrCreate();
        cache.athleteJson = null;
        cache.statsJson = null;
        cache.activitiesJson = null;
        cache.lastSync = null;
    }

    public List<StravaActivityDTO> getCachedActivities() {
        StravaCache cache = StravaCache.getOrCreate();
        if (cache.activitiesJson == null) return Collections.emptyList();
        try {
            return mapper.readValue(cache.activitiesJson, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            return Collections.emptyList();
        }
    }
}
