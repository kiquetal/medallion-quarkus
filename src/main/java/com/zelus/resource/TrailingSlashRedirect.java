package com.zelus.resource;

import io.quarkus.vertx.http.runtime.filters.Filters;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;

/**
 * Redirects /zelus (no trailing slash) → /zelus/.
 * Workaround for https://github.com/quarkusio/quarkus/issues/35076
 * Filters fire at the HTTP level, before root-path routing.
 */
@ApplicationScoped
public class TrailingSlashRedirect {

    public void init(@Observes Filters filters) {
        filters.register(rc -> {
            String path = rc.request().path();
            if (path.equals("/zelus")) {
                rc.response()
                    .setStatusCode(301)
                    .putHeader("location", "/zelus/")
                    .end();
            } else {
                rc.next();
            }
        }, 100);
    }
}
