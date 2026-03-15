package com.medallion.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.time.LocalDate;

@Entity
public class Race extends PanacheEntity {

    @Column(nullable = false)
    public String name;

    public LocalDate raceDate;

    public Double distance;

    public String finishTime;

    public String location;

    @Enumerated(EnumType.STRING)
    public RaceCategory category;

    @Enumerated(EnumType.STRING)
    public MedalType medalType;

    @Column(length = 2000)
    public String notes;

    public String imagePath;
}
