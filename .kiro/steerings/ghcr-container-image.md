# Steering: GHCR Container Image — Quarkus JVM

Reusable CI setup for building a Quarkus JVM container image and pushing it to GitHub Container Registry.

## Tag Convention

```
ghcr.io/<owner>/<container-name>:<YYYYMMDDHHmmss>-<arch>   # arch-specific
ghcr.io/<owner>/<container-name>:<YYYYMMDDHHmmss>           # multi-arch manifest
ghcr.io/<owner>/<container-name>:latest                     # always points to newest
```

A `prepare` job generates the timestamp once; all downstream jobs reference it so tags are consistent. The `create-manifest` job combines both arch-specific images into a single multi-arch tag and updates `latest`.

## Required Files

### 1. `src/main/docker/Dockerfile.jvm`

Standard Quarkus JVM Dockerfile. Adjust the base image JDK version to match `maven.compiler.release` in `pom.xml`.

```dockerfile
FROM registry.access.redhat.com/ubi8/openjdk-21-runtime:1.20
ENV LANGUAGE='en_US:en'
COPY --chown=185 target/quarkus-app/lib/ /deployments/lib/
COPY --chown=185 target/quarkus-app/*.jar /deployments/
COPY --chown=185 target/quarkus-app/app/ /deployments/app/
COPY --chown=185 target/quarkus-app/quarkus/ /deployments/quarkus/
EXPOSE 8080
ENV JAVA_OPTS_APPEND="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"
ENTRYPOINT ["java", "-jar", "/deployments/quarkus-run.jar"]
```

### 2. `.github/workflows/ghcr-build-push.yml`

```yaml
name: Build & Push to GHCR

on:
  workflow_dispatch:
    inputs:
      container_name:
        description: "Container image name (default: repo name)"
        required: false
        type: string

env:
  REGISTRY: ghcr.io

jobs:
  prepare:
    runs-on: ubuntu-latest
    outputs:
      image: ${{ steps.meta.outputs.image }}
      tag: ${{ steps.meta.outputs.tag }}
    steps:
      - name: Generate shared tag
        id: meta
        run: |
          NAME="${{ inputs.container_name || github.event.repository.name }}"
          echo "image=${{ env.REGISTRY }}/${{ github.repository_owner }}/${NAME}" >> "$GITHUB_OUTPUT"
          echo "tag=$(date -u +%Y%m%d%H%M%S)" >> "$GITHUB_OUTPUT"

  build-and-push:
    needs: prepare
    runs-on: ${{ matrix.arch == 'arm64' && 'ubuntu-24.04-arm' || 'ubuntu-latest' }}
    strategy:
      matrix:
        arch: [amd64, arm64]
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v6

      - uses: actions/setup-java@v5
        with:
          distribution: temurin
          java-version: 21
          cache: maven

      - name: Build Quarkus app
        run: mvn package -DskipTests

      - uses: docker/login-action@v4
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - uses: docker/build-push-action@v7
        with:
          context: .
          file: src/main/docker/Dockerfile.jvm
          push: true
          tags: ${{ needs.prepare.outputs.image }}:${{ needs.prepare.outputs.tag }}-${{ matrix.arch }}

  create-manifest:
    needs: [prepare, build-and-push]
    runs-on: ubuntu-latest
    permissions:
      packages: write
    steps:
      - uses: docker/setup-buildx-action@v4

      - uses: docker/login-action@v4
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Create and push multi-arch manifest
        run: |
          IMAGE="${{ needs.prepare.outputs.image }}"
          TAG="${{ needs.prepare.outputs.tag }}"
          docker buildx imagetools create -t ${IMAGE}:${TAG} -t ${IMAGE}:latest \
            ${IMAGE}:${TAG}-amd64 \
            ${IMAGE}:${TAG}-arm64
```

## Adapting to a New Project

1. Copy this steering to `.kiro/steerings/ghcr-container-image.md`
2. Copy `src/main/docker/Dockerfile.jvm` — change the base image JDK version if needed
3. Copy `.github/workflows/ghcr-build-push.yml`
4. If the project uses a frontend (Quinoa/Angular/React), add a `setup-node` step before the Maven build:
   ```yaml
   - uses: actions/setup-node@v6
     with:
       node-version: 18
       cache: npm
       cache-dependency-path: src/main/webui/package-lock.json
   ```
5. Ensure `pom.xml` has `maven.compiler.release` matching the Dockerfile JDK version

## Key Constraints

- `GITHUB_TOKEN` has `packages: write` permission — no extra secrets needed
- ARM builds use `ubuntu-24.04-arm` GitHub-hosted runners (public preview)
- The workflow expects `mvn package` to produce `target/quarkus-app/` (standard Quarkus fast-jar)
- Container name defaults to the GitHub repo name; override via the `container_name` input
- One trigger builds both amd64 and arm64 images in parallel via matrix strategy
- The `prepare` job generates the timestamp once to guarantee consistent tags across all jobs
- All actions use Node 24 runtime — no deprecation warnings
