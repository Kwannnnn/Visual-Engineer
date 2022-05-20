# Visual Engineer - DHI2V.e1

## Backend

### Environment

The necessary environment variables for the backend can be configured by copying the [.env.example](./backend/.env.example) file into a new `.env` file, and editing the values as required.

| Key          | Description                        | Default Value |          Required?           |
| :----------- | :--------------------------------- | :-----------: | :--------------------------: |
| DATABASE_URL | PostgreSQL connection string       |      N/A      |              ✅              |
| DB_USER      | PostgreSQL username                |      N/A      | 🟨 (if using docker-compose) |
| DB_PASS      | PostgreSQL password                |      N/A      | 🟨 (if using docker-compose) |
| DB_NAME      | PostgreSQL database name to create |      N/A      | 🟨 (if using docker-compose) |

A development environment for the necessary backing services can be launched using `docker-compose -f dev.docker-compose.yml up -d`.
This [compose file](./backend/dev.docker-compose.yml) spins up a PostgreSQL container to be used for local development.

With a database configured and available, the schema can be updated using: `npm run db:update`

> The `npm run db:drop` command can be used to drop the local schema

Various other npm scripts are available for common local database opeerations, like `npm run db:fresh` and `npm run db:seed`. These scripts re-initialize a fresh database, and run the seeders, respectively.

### Running

To run the backed in development mode (with auto-reloading), use `npm run dev`.

#### Production

For running under a production environment, use `npm run start` to compile and run on-demand, or bundle the backend with 1) `npm run build`, and serve using 2) `npm run prod`.

### Linting

Our CI pipeline requires all code to be linted, so make sure the linter has been used before committing and pushing code.
The `npm run lint` can be used to view all linter warnings, with `npm run lint:fix` for automatically fixing auto-fixable issues.

### Apidoc

To generate API documentation (using apidoc), execute `npm run apidoc`. The resulting documentation will be located in the `dist/docs/apidoc/` directory.

### CI

The included Jest API integration tests can be locally executed with `npm run test`.

Additionally, a [test docker-compose file](./backend/test.docker-compose.yml) has been provided that will build and run the backend and a temporary database container, before running the test suite. This can be used with the `npm run ci:integration` command. Ensure Docker and Docker Compose are available.

### Docker

Two Dockerfiles have been written, one for the [backend itself](./backend/Dockerfile), and one for the [integration test backend](./backend/test.Dockerfile), the latter simply running the Jest tests.

The main backend docker image can be locally built using `npm run docker:build`, and then launched using `npm run docker:run`.

### SonarQube

Our current SonarQube server is located [here](https://sonarqube.philipposslicher.tech:8443/). Use the credentials found in our Discord server to authenticate.

## Frontend

For the available frontend scripts, see the accompanying [README](./frontend/README.md) file.

## GitLab CI

The [.gitlab-ci.yml](./.gitlab-ci-yml) file contains the project CI pipeline.

This pipeline is configured to build the frontend and backend projects, generate documentation, lint, run integration and cypress tests, and also push up relevant Docker images.

> Frontend and backend tasks will only be scheduled when there are relevant changes. For example, frontend tasks will only run when the contents of the [frontend](./frontend/) directory have been changed. This saves CI time.

### Test Artifacts

The `jest-junit` reporter is used when running the backend integration tests, as to be able to integrate the test results into GitLab as a report artifact.

### CI Images

Currently, Docker images will be built and pushed (using Kaniko) to the GitLab Container Registry for the `staging` and `main` branches.
