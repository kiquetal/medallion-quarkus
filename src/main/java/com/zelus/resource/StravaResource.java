package com.zelus.resource;

import com.zelus.entity.StravaCache;
import com.zelus.entity.StravaToken;
import com.zelus.strava.StravaActivityDTO;
import com.zelus.strava.StravaService;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.net.URI;
import java.util.List;
import java.util.Map;

@Path("/strava")
@Produces(MediaType.APPLICATION_JSON)
public class StravaResource {

    @Inject StravaService stravaService;

    @POST @Path("/config")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response saveConfig(Map<String, String> body) {
        stravaService.saveConfig(body.get("clientId"), body.get("clientSecret"));
        return Response.ok().build();
    }

    @GET @Path("/authorize")
    @Transactional
    public Response authorize() {
        return Response.temporaryRedirect(URI.create(stravaService.buildAuthorizeUrl())).build();
    }

    @GET @Path("/callback")
    public Response callback(@QueryParam("code") String code, @QueryParam("scope") String scope) {
        stravaService.exchangeCode(code);
        stravaService.syncData();
        return Response.temporaryRedirect(URI.create("/zelus/strava")).build();
    }

    @GET @Path("/status")
    @Transactional
    public Map<String, Object> status() {
        StravaToken t = StravaToken.getOrCreate();
        return Map.of(
                "configured", t.isConfigured(),
                "connected", t.isConnected(),
                "athleteName", t.athleteName != null ? t.athleteName : "",
                "athleteId", t.athleteId != null ? t.athleteId : 0,
                "athleteProfile", t.athleteProfile != null ? t.athleteProfile : "");
    }

    @GET @Path("/data")
    @Transactional
    public Map<String, Object> data() {
        StravaCache c = StravaCache.getOrCreate();
        return Map.of(
                "athlete", c.athleteJson != null ? c.athleteJson : "null",
                "stats", c.statsJson != null ? c.statsJson : "null",
                "activities", c.activitiesJson != null ? c.activitiesJson : "[]",
                "lastSync", c.lastSync != null ? c.lastSync.toString() : "");
    }

    @GET @Path("/activities")
    @Transactional
    public List<StravaActivityDTO> activities() {
        return stravaService.getCachedActivities();
    }

    @DELETE @Path("/disconnect")
    public Response disconnect() {
        stravaService.disconnect();
        return Response.ok().build();
    }
}
