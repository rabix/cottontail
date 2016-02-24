#!/usr/bin/env bash

cd client
npm install # postInstall will do `bower install`
gulp build && gulp dev

cd src
git clone git@github.com:rabix/cottontail-editors.git editors
cd editors
npm install # postInstall will do `bower install`
grunt templates && grunt sass

cd ../../../ # cottontail root

echo "Finished building cottontail."

echo ""
echo "----"
echo "Run '(sudo) npm link' to get cottontail in path"
echo "----"
echo ""

echo "Run 'cottontail setup' to setup cottontail env."

