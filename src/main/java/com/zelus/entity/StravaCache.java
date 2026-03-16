package com.zelus.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.time.Instant;

@Entity
public class StravaCache extends PanacheEntity {

    @Column(columnDefinition = "TEXT")
    public String athleteJson;

    @Column(columnDefinition = "TEXT")
    public String statsJson;

    @Column(columnDefinition = "TEXT")
    public String activitiesJson;

    public Instant lastSync;

    public static StravaCache getOrCreate() {
        StravaCache c = findAll().firstResult();
        if (c == null) {
            c = new StravaCache();
            c.persist();
        }
        return c;
    }
}
