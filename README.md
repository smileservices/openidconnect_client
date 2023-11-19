# OpenID Connect Client

This client is used for testing purposes. It was built (in a few hours) to showcase using TrustNet.app as an OpenId
Connect identity provider.

## Techstack

A simple web app running `FastAPI` in the backend and `ReactJs` in the frontend. `Nginx` is running in a docker
container to serve the frontend assets

## Setting it up

Create `.env` file to store configuration from `template_env`.

Make up the frontend:

1. install `nvm`
2. set the correct node version: `nvm use v16.13.0`

Run the docker services: `docker-compose -up`
Client app is available at `http://localhost:8081`
Note: if the OIDC server is run locally as well make sure to bridge the networks.

Alternatively you can just run only the `nginx` service and start the `fastapi` app manually by executing the
script `./run_fastapi`.