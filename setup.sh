#!/usr/bin/env bash

cd client
npm install # postInstall will do `bower install`

cd src
git clone git@github.com:rabix/cottontail-editors.git editors
cd editors
npm install # postInstall will do `bower install`
grunt templates && grunt sass && grunt build

cd ../../../ # cottontail root

cd client/
gulp build && gulp dev
cd ..


echo "Finished building cottontail."

echo ""
echo "----"
echo "Run '(sudo) npm link' to get cottontail in path"
echo "----"
echo ""

echo "Run 'cottontail setup' to setup cottontail env."

