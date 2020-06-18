

# Safeplaces Backend Ingestion Example

This repository holds an example backend for the ingestion API [Safeplaces API specification](https://github.com/Path-Check/safeplaces-frontend/blob/dev_mvp/Safe-Places-Server.md).

Safeplaces is a toolkit for public health, built on top of data shared by users of [Private Kit](https://github.com/tripleblindmarket/covid-safe-paths).

[Safeplaces Frontend](https://github.com/Path-Check/safeplaces-frontend) is an example client for these backends.

## Project Status

[![Project Status: WIP – The project is still under development and will reach a Minimum Viable Product stage soon.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)

The project is still under development and will reach a Minimum Viable Product (MVP) stage soon.  
*Note*: There can be breaking changes to the developing code until the MVP is released.

## Local Development

*Note*:
1. The installation assumes you have already installed Postgres DB in your local environment listening for connections at port 5432.
2. Your Postgres instance should listen to '*' instead of 'localhost' by setting the `listen_addresses` parameter, [this setting can be found in your pgconfig file](https://www.postgresql.org/docs/current/runtime-config-connection.html).

Clone this repository

```
cd safeplaces-backend/expressjs

```


#### Install Package Manager

Steps to install NVM are documented [in the nvm repository](https://github.com/nvm-sh/nvm#installing-and-updating).

Install npm using nvm

```
nvm install 13.1.0
nvm use 13.1.0
npm install
```
#### Setup Environment

Refer [.env.template](.env.template) for environment variables to be exported to your environment.

#### Setup Database

1. Create databases and users mentioned exported in your environment.
1. Grant database user superuser privilege to the database to create POSTGIS extension and setup other tables. Reduce this privilege later to just create and modify tables or tuples in this database after you run the migration for the first time.
1. Install [PostGIS extension](https://postgis.net/install/).

#### Knex migrations and seed the database

Install Knex globally
```
npm install knex -g
```
Run migrations
```
knex migrate:latest --env test
knex migrate:latest --env development
```

Seed the database

```
knex seed:run --env test
knex seed:run --env development
```
#### Tests
Run test with the following command:

```
npm test
```

### Local Development Using Docker
*Note*:  
1. The installation assumes you have already installed Postgres DB in your local environment listening for connections at port 5432.
2. Your Postgres instance should listen to '*' instead of 'localhost' by setting the `listen_addresses` parameter, [this setting can be found in your pgconfig file](https://www.postgresql.org/docs/current/runtime-config-connection.html).
3. Your `pg_hba.conf` should have a rule added for `host all all <docker-subnet> md5`. Replace `<docker-subnet>` with the actual CIDR for your docker installation's subnet. Note that `172.18.0.0/16` is usually the default.

Clone this repository

```
cd safeplaces-backend/expressjs
```
#### Build Dockerfile
```
docker build -t safeplaces-backend-expressjs .
```

#### Run Dockerfile
```
docker run --rm --name safeplaces-expressjs --env-file=.env -p 3000:3000 safeplaces-backend-expressjs

```
*Note*: sample env file can be found at .env.template`.

#### Deploy via docker-compose
 *Using docker-compose will bring a postgres server along with the application container*

Ensure to create application Environment variables  file .env from .env.template

Ensure to create Postgres Environment variables file  .database.env from .database.env.template

#### Run the following:
```
docker-compose build
docker-compose up
```
### Testing Your Deployment

Run:
```
curl http://localhost:3000/health
```
Should respond with:
```
{
  "message": "All Ok!"
}
```

## Production and Staging Deployments
This section of the readme will detail configuration of deployed environments. In our sample application, we support the deployment of a staging and production version of the application.

#### Staging
The staging deployment is based off of the `staging` branch. This environment is used by QA, product, and development teams to validate functionality before releasing to the general public.

##### Hosted Services
Frontend : [https://safeplaces.extremesolution.com/](https://safeplaces.extremesolution.com/)  
Backend API: [https://zeus.safeplaces.extremesolution.com](https://zeus.safeplaces.extremesolution.com/)  
Ingest Service API (this repo): [https://hermes.safeplaces.extremesolution.com/](https://hermes.safeplaces.extremesolution.com/)

#### Production
The production deployment is based off of the `master` branch. This environment is a production version of the SafePlaces application(s).

##### Hosted Services
Frontend: https://spl.extremesolution.com/
Backend API (this repo): https://yoda.spl.extremesolution.com/
Ingest Service (this repo): https://obiwan.spl.extremesolution.com/

### Database Configuration
Databases for the staging and production version of the application will be configured similarly. Each environment will use its own database.

The Ingest service utilizes PostgreSQL for its database. The following environment variables will need to be set on the server hosting the Ingest service:
```
# Public Database Configuration Environment Variables (Ingest Service Database)
DB_HOST (IP/URL of where database is hosted)
DB_NAME (Name of database)
DB_USER (Name of appropriatly configured user)
DB_PASS (Password for corresponding user)
```

### Node Environment
The `NODE_ENV` environment variable indicates what environment the application is running in.

For the staging environment the variable should be set as follows: `NODE_ENV=staging`

For the production environment the variable should be set as follows: `NODE_ENV=production`


### Post Deployment Tasks

#### All Deployments
Below are tasks that should run on every deployment.

##### Migrate Database
The following command should be run on every deployment to migrate the database (if using Docker this should be handled by the [dbsetup.sh](https://github.com/Path-Check/safeplaces-backend/blob/dev/dbsetup.sh) script):

`knex migrate:latest --env (staging|production)`
