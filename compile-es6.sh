#!/bin/bash

./node_modules/.bin/babel client/src/app -d client/src/compiled

find client/src/app -name \*.js -print | sed -e 's/^client\/src\/app/compiled/' | sed -e 's/^/<script src="/' | sed -e 's/$/"><\/script>/' 