#!/usr/bin/env bash
docker-compose down
docker-compose build
docker-compose -f docker-compose.yml up -d
docker-compose exec app psql -c "CREATE DATABASE good_weather;" -U postgres
docker-compose exec app ./manage.py migrate
docker-compose exec app ./manage.py loaddata db.json

