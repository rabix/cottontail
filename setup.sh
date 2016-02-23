#!/usr/bin/env bash

node post-install.js

cd client
npm install # postInstall will do `bower install`
gulp build

echo "Finished building cottontail."
echo "Run 'cottontail setup' to setup cottontail env."