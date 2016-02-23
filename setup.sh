#!/bin/bash

npm install
cd client
npm install
cd src/editors
npm install
grunt sass
grunt templates