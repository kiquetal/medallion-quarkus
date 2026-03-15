package com.zelus.resource;

import com.zelus.entity.Race;
import com.zelus.repository.RaceRepository;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheRepositoryResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@ResourceProperties(path = "races")
public interface RaceResource extends PanacheRepositoryResource<RaceRepository, Race, Long> {
}
