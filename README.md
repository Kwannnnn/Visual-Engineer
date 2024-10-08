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

## Azure

The frontend package is automatically deployed to an Azure Static Web App using the [frontend:deploy CI job](./.gitlab-ci.yml#176).
The deployed frontend URL is currently [https://visualengineer-prod.philipposslicher.tech/](https://visualengineer-prod.philipposslicher.tech/).

The backend is deployed with a multi-container group using Azure ACI, accessible at [http://visualengineer-api.westeurope.azurecontainer.io:3000/](http://visualengineer-api.westeurope.azurecontainer.io:3000/).

Additionally, a sidecar reverse proxy Caddy container is deployed to proxy and serve the backend using TLS (with an automated LetsEncrypt certificate).

> To deploy this sidecar, run `az container create --resource-group 24HBOICTBVWBVE --file caddy-proxy-aci.yml` from the [azure directory](./azure/).

This will deploy the container to [https://visualengineer-api-tls.westeurope.azurecontainer.io/](https://visualengineer-api-tls.westeurope.azurecontainer.io/).

### Azure deployment 

Requires the az cli. 

**Login into the resource group**

> `az login` will redirect you to the login page in your default browser. Now you are logged in to Azure CLI.<br>
> `docker login azure` log in te same way to have access to deploy docker to azure <br>
> `az acr login -n visualengineer`

For the purpose of deploying in azure you have to create a new aci context and then switch to it.
> To create a new context use `docker context create aci <context-name>` cUse the command `docker context use <context-name>` form the backend directory

A .env file is needed in the azure directory.

**Configuration for the database production:**

POSTGRES_USER=USERNAME <br>
POSTGRES_PASSWORD=PW <br>
POSTGRES_DB=DATABASENAME 

DOMAIN_NAME=visualengineer-api (the domain where the backend can be found) <br>
IMAGE_TAG=main (the branch that is being deployed)

**Creating the azure containers**

In order to change the azure container instances, after you finish the changes into the docker and docker-compose are the following steps:

> `docker compose -f prod.docker-compose.yml down` - delete the previous container <br>
> `docker compose -f prod.docker-compose.yml up -d` - build the new container with the contents of the docker-compose file

