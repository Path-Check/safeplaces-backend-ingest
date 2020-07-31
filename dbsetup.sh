#!/bin/bash
FILE=/app/.env

if [ -f "$FILE" ]; then
  env $(cat .env) spdl migrate:latest --scope public --env $NODE_ENV

  if [ $NODE_ENV = "development" ]; then
      env $(cat .env) spdl seed:run --scope public --env $NODE_ENV
  fi

else

  spdl migrate:latest --scope public --env $NODE_ENV
  if [ $NODE_ENV = "development" ]; then
      env $(cat .env) spdl seed:run --scope public --env $NODE_ENV
  fi

fi
exec "$@"
