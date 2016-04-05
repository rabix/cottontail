#!/bin/bash

currentDirName="${PWD##*/}"

filename="cottontail-$(date +'%Y-%m-%d').tar.gz"

cd ../
echo "Packaging..."
tar --exclude="$currentDirName/release" -zcf $filename $currentDirName


cd $currentDirName
mkdir -p release
mv ../$filename release/$filename