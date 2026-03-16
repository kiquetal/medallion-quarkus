package com.zelus.strava;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.util.List;

@RegisterRestClient(configKey = "strava-api")
@Path("/")
public interface StravaClient {

    @POST
    @Path("oauth/token")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    StravaTokenResponse exchangeToken(
            @FormParam("client_id") String clientId,
            @FormParam("client_secret") String clientSecret,
            @FormParam("code") String code,
            @FormParam("grant_type") String grantType);

    @POST
    @Path("oauth/token")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    StravaTokenResponse refreshToken(
            @FormParam("client_id") String clientId,
            @FormParam("client_secret") String clientSecret,
            @FormParam("refresh_token") String refreshToken,
            @FormParam("grant_type") String grantType);

    @GET
    @Path("api/v3/athlete")
    @Produces(MediaType.APPLICATION_JSON)
    StravaAthleteDTO getAthlete(@HeaderParam("Authorization") String bearer);

    @GET
    @Path("api/v3/athletes/{id}/stats")
    @Produces(MediaType.APPLICATION_JSON)
    StravaStatsDTO getStats(@PathParam("id") long athleteId, @HeaderParam("Authorization") String bearer);

    @GET
    @Path("api/v3/athlete/activities")
    @Produces(MediaType.APPLICATION_JSON)
    List<StravaActivityDTO> getActivities(
            @HeaderParam("Authorization") String bearer,
            @QueryParam("per_page") int perPage,
            @QueryParam("page") int page);
}
