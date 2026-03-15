package com.medallion.resource;

import com.medallion.entity.Race;
import com.medallion.repository.RaceRepository;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheRepositoryResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@ResourceProperties(path = "races")
public interface RaceResource extends PanacheRepositoryResource<RaceRepository, Race, Long> {
}
