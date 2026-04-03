#!/bin/bash

REMOTEPATH=$(jq -r '.deploy.remotepath' config.json)
echo "Remote path ist: $REMOTEPATH"

read -p "There should not be a trailing slash. Press enter to continue"
rsync -azPdv *.sh "$REMOTEPATH"
rsync -azPdv *.js "$REMOTEPATH"
rsync -azPdv --exclude="photofeed" public/ "$REMOTEPATH/public"

