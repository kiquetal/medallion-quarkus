package com.zelus.repository;

import com.zelus.entity.Race;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RaceRepository implements PanacheRepository<Race> {
}
