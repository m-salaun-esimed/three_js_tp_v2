FROM quay.io/keycloak/keycloak:26.4.0 as builder

ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

ENV KC_DB=postgres

WORKDIR /opt/keycloak
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.4.0
COPY --from=builder /opt/keycloak/ /opt/keycloak/

ENV KC_DB=postgres
ENV KC_DB_URL=jdbc:postgresql://keycloak-db:5432/keycloak
ENV KC_DB_USERNAME=keycloak
ENV KC_DB_PASSWORD=keycloak
ENV KC_HOSTNAME=localhost
ENV KC_HOSTNAME_STRICT=false
ENV KC_HOSTNAME_STRICT_HTTPS=false
EXPOSE 8443
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]