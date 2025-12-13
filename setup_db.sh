#!/bin/bash
sudo -u postgres createuser -s postgres
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'password';"
sudo -u postgres createdb -O postgres enernova
