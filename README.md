# Cottontail


## Packaging
Running `npm run package` in the root project folder will produce a tarball in the "release" subfolder.

## Unpacking
1. Either use your OS to unpack the tar, or run `tar -zxf {archive_name} -C {output_folder}`.
2. Run `sudo npm link` to create the `cottontail` global symlink.
3. Use it by running `cottontail [directory (optional)] [-o (open browser, optional)] [--port 1337 (optional)]`

In order to improve our software, we may report runtime errors back to our servers.
If you explicitly wish to disable this, you can add a `--no-error-reporting` parameter to the CLI command.

## Local Development

Local cottontail requires the following dependencies:

- [NodeJS 4+](https://nodejs.org/en/)
- [Bower](http://bower.io/)


After cloning the repo locally, run the following commands in the root of the cottontail project:

    cd server
    npm install
    
This will install the dependencies required for the server to run, then from the server directory:

    cd ../client
    npm install && bower install
    cd src/editors
    npm install && bower install
    
After all dependencies are installed, from the client root (`cottontail/client`) **run `gulp local-build` to build JS/CSS required for the client.**

To watch all JS and SCSS files during development, run `gulp watch`.


## Running the Server

After all local dependencies have been installed, you can run the server by doing the following from the root of the cottontail project:

	cd ../server
	node app.js {target_directory} [-o (open browser, optional)] [--port 1337 (optional)]

## Tests

**Server tests:**
To run the server tests run the following command from the project root:

	node serverSpec-runner.js

This will run the tests in the `/spec` folder and generates a JUnitXml report in the `/spec/report` folder. The tests files must have a ***[sS]pec.js** ending.

