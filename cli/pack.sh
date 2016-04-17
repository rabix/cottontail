#!/bin/bash

currentDirName="${PWD##*/}"

filename="cottontail-$(date +'%Y-%m-%d').tar.gz"

cd ../
echo "Packaging..."
tar --exclude="$currentDirName/release" --exclude="$currentDirName/client/node_modules" --exclude="$currentDirName/client/src"  --exclude="$currentDirName/.git" --exclude="$currentDirName/client/dist" --exclude="$currentDirName/client/src/editors/node_modules" -zcf $filename $currentDirName

echo "Created $currentDirName/release/$filename"

cd $currentDirName
mkdir -p release
mv ../$filename release/$filename