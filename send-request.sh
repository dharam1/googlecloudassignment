#!/bin/sh
curl -X POST "https://us-central1-pe-training.cloudfunctions.net/dharam-http-function" -H "Content-Type:application/json" --data '{"Name":"dharam-Instance-cloud","Size":"n1-standard-1","Sourcebucket":"gs://dharam-storage"}'
