package com.zelus.resource;

import com.zelus.dto.StatsDTO;
import com.zelus.entity.Race;
import com.zelus.repository.RaceRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Path("/stats")
@Produces(MediaType.APPLICATION_JSON)
public class StatsResource {

    @Inject
    RaceRepository raceRepository;

    @GET
    public StatsDTO getStats() {
        var races = raceRepository.listAll();

        long totalRaces = races.size();
        double totalDistance = races.stream()
                .mapToDouble(r -> r.distance != null ? r.distance : 0)
                .sum();

        Map<String, Long> racesPerCategory = races.stream()
                .filter(r -> r.category != null)
                .collect(Collectors.groupingBy(r -> r.category.name(), Collectors.counting()));

        Map<String, Long> racesPerYear = races.stream()
                .filter(r -> r.raceDate != null)
                .collect(Collectors.groupingBy(
                        r -> String.valueOf(r.raceDate.getYear()),
                        LinkedHashMap::new,
                        Collectors.counting()));

        Map<String, Long> medalsByType = races.stream()
                .filter(r -> r.medalType != null)
                .collect(Collectors.groupingBy(r -> r.medalType.name(), Collectors.counting()));

        Map<String, Long> perActivityType = races.stream()
                .filter(r -> r.activityType != null)
                .collect(Collectors.groupingBy(r -> r.activityType.name(), Collectors.counting()));

        return new StatsDTO(totalRaces, totalDistance, racesPerCategory, racesPerYear, medalsByType, perActivityType);
    }
}
