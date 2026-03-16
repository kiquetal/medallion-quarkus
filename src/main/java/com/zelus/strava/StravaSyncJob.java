package com.zelus.strava;

import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

@ApplicationScoped
public class StravaSyncJob {

    private static final Logger LOG = Logger.getLogger(StravaSyncJob.class);

    @Inject StravaService stravaService;

    @Scheduled(cron = "0 0 3 * * ?")
    void dailySync() {
        LOG.info("Starting daily Strava sync...");
        stravaService.syncData();
    }
}
