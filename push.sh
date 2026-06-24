#!/usr/bin/env bash

git add .
current_date=$(date +"%Y-%m-%d %H:%M:%S")
msg=${1:-"Auto commit code $current_date"}
git commit -m "$msg"
git push
