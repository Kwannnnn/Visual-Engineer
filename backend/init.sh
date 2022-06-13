#!/bin/sh

DB_INIT_FILE="./.db-initialized"

if [ -f $DB_INIT_FILE ]; then
    exit 0
fi

./wait-for.sh postgres:5432 --  npm run db:update && npm run db:seed
touch $DB_INIT_FILE