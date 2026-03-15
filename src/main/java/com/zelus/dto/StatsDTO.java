package com.zelus.dto;

import java.util.Map;

public record StatsDTO(
        long totalRaces,
        double totalDistance,
        Map<String, Long> racesPerCategory,
        Map<String, Long> racesPerYear,
        Map<String, Long> medalsByType
) {}
