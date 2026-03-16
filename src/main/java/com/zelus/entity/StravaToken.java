package com.zelus.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class StravaToken extends PanacheEntity {

    public String clientId;
    public String clientSecret;
    public String accessToken;
    public String refreshToken;
    public Long expiresAt;
    public Long athleteId;
    public String athleteName;
    public String athleteProfile;

    public boolean isExpired() {
        return expiresAt == null || (System.currentTimeMillis() / 1000) >= (expiresAt - 300);
    }

    public boolean isConnected() {
        return accessToken != null && refreshToken != null;
    }

    public boolean isConfigured() {
        return clientId != null && clientSecret != null;
    }

    public static StravaToken getOrCreate() {
        StravaToken t = findAll().firstResult();
        if (t == null) {
            t = new StravaToken();
            t.persist();
        }
        return t;
    }
}
